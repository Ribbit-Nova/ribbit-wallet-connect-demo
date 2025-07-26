# 🐸 Ribbit Wallet Connect Demo

A comprehensive demo application showcasing the integration of Ribbit Wallet Connect SDK with React + TypeScript + Vite.

## 📋 Overview

This demo application demonstrates how to integrate the Ribbit Wallet Connect SDK into a web application, providing examples of wallet connection, transaction handling, and wallet information retrieval on the Supra blockchain.

## ✨ Features

- **Wallet Connection**: Connect to Ribbit Wallet extension
- **Session Management**: Check connection status and maintain sessions
- **Wallet Information**: Retrieve wallet address and balance
- **Transaction Handling**: Send transactions on Supra blockchain
- **Real-time Logging**: Activity logs with timestamps
- **Chain Support**: Supra Testnet and Mainnet support

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Ribbit Wallet browser extension installed
- Modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ribbit-Nova/ribbit-wallet-connect-demo.git
   cd ribbit-wallet-connect-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 Usage

### 1. Connect to Wallet

Click "Connect Wallet" to establish a connection with the Ribbit Wallet extension. This will prompt the user to approve the connection.

### 2. Check Session Status

Verify if an active session exists with the wallet.

### 3. Get Wallet Information

- **Get Address**: Retrieve the current wallet address
- **Get Balance**: Fetch the wallet balance in SUPRA tokens

### 4. Send Transactions

Send transactions on the Supra blockchain (configured for token transfers in the demo).

### 5. Disconnect

Safely disconnect from the wallet and clear session data.

## 🌐 Supported Networks

- **Supra Testnet**: Chain ID `6`
- **Supra Mainnet**: Chain ID `8`

## 📚 API Reference

### Core Methods

#### `window.ribbit.connectToWallet(metadata: DappMetadata)`

Establishes connection with the Ribbit Wallet.

```typescript
const dappMetadata: DappMetadata = {
    name: 'Your DApp Name',
    description: 'Your DApp Description',
    logo: 'https://your-domain.com/logo.png',
    url: 'https://your-domain.com'
};
```

#### `window.ribbit.getSessionStatus()`

Checks if an active session exists.

#### `window.ribbit.getWalletAddress(chainId: number)`

Retrieves the wallet address for the specified chain.

#### `window.ribbit.getWalletBalance(request: WalletBalanceRequest)`

Gets the wallet balance for a specific token.

```typescript
const request: WalletBalanceRequest = {
    chainId: SupraChainId.TESTNET,
    resourceType: '0x1::supra_coin::SupraCoin',
    decimals: 7
};
```

#### `window.ribbit.sendTransaction(payload)`

Sends a transaction to the blockchain.

```typescript
const payload = {
    method: TransportMessageType.SEND_TRANSACTION,
    params: {
        moduleAddress: '0x1',
        moduleName: 'supra_coin',
        functionName: 'transfer',
        tyArg: ['0x1::supra_coin::SupraCoin'],
        args: [recipientAddress, amount]
    },
    chainId: SupraChainId.TESTNET
};
```

#### `window.ribbit.disconnect()`

Disconnects from the wallet and clears session data.

## 🛠 Development

### Build for Production

```bash
npm run build
```

### Lint Code

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## 📦 Dependencies

- **ribbit-wallet-connect**: Core SDK for wallet integration
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and development server

## 🔗 Chain Information

### Supra Blockchain

- **Testnet Chain ID**: 6
- **Mainnet Chain ID**: 8
- **Native Token**: SUPRA
- **Decimals**: 7 (1 SUPRA = 10^7 microSUPRA)

## 🐛 Troubleshooting

### Common Issues

1. **"Ribbit Wallet not detected"**
   - Ensure the Ribbit Wallet browser extension is installed and enabled
   - Refresh the page after installing the extension

2. **Connection Rejected**
   - Check that you're approving the connection in the wallet popup
   - Verify the DApp metadata is correctly configured

3. **Transaction Failed**
   - Ensure you have sufficient balance for the transaction
   - Verify the recipient address is valid
   - Check that you're connected to the correct network

## 📄 License

This project is for demonstration purposes. Please refer to the Ribbit Wallet Connect SDK license for usage terms.

## 🤝 Contributing

This is a demo application. For SDK improvements or bug reports, please contact the Ribbit team.
