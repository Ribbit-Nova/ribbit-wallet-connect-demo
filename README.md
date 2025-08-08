<div align="center">
  <h1>🐸 Ribbit Wallet Connect Demo</h1>
  <p><strong>A comprehensive demo application showcasing the integration of Ribbit Wallet Connect SDK</strong></p>
  
  [![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.x-purple?logo=vite)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 📋 Overview

This demo application demonstrates how to integrate the **Ribbit Wallet Connect SDK** into a modern web application. Built with React, TypeScript, and Vite, it provides comprehensive examples of wallet connection, transaction handling, and wallet information retrieval on the Supra blockchain.

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔗 **Wallet Connection** | Seamless connection to Ribbit Wallet extension |
| 📊 **Session Management** | Real-time connection status and session persistence |
| 💼 **Wallet Information** | Retrieve wallet address and token balances |
| 🔐 **Message Signing** | Cryptographic message signing capabilities |
| 💸 **Transaction Handling** | Send transactions on Supra blockchain |
| 📝 **Activity Logging** | Real-time activity logs with timestamps |
| 🌐 **Multi-Chain Support** | Supra Testnet and Mainnet compatibility |

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Ribbit Wallet** browser extension
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ribbit-Nova/ribbit-wallet-connect-demo.git
   cd ribbit-wallet-connect-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 🎯 Usage Guide

### 1. 🔗 Wallet Connection

Initialize connection with the Ribbit Wallet extension:

```typescript
const dappMetadata: DappMetadata = {
  name: 'Your DApp Name',
  description: 'Your DApp Description',
  logo: 'https://your-domain.com/logo.png',
  url: 'https://your-domain.com'
};

const response = await window.ribbit.connectToWallet(dappMetadata);
```

### 2. 📊 Session Management

Check active session status:

```typescript
const session = await window.ribbit.getSessionStatus();
if (session?.success) {
  console.log('Connection is active');
} else {
  console.log('No active connection');
}
```

### 3. 💼 Wallet Information

**Get Wallet Address**
```typescript
try {
  const address = await window.ribbit.getWalletAddress(SupraChainId.TESTNET);
  console.log('Wallet address:', address);
} catch (error) {
  console.error('Failed to get wallet address:', error);
}
```

**Get Wallet Balance**
```typescript
try {
  const walletBalanceRequest: WalletBalanceRequest = {
    chainId: SupraChainId.TESTNET,
    resourceType: '0x1::supra_coin::SupraCoin',
    decimals: 7
  };
  const balance = await window.ribbit.getWalletBalance(walletBalanceRequest);
  console.log('Wallet balance:', balance);
} catch (error) {
  console.error('Failed to get wallet balance:', error);
}
```

### 4. 🔐 Message Signing

Sign messages for authentication or verification:

```typescript
try {
  const response = await window.ribbit.signMessage({
    message: 'Sign to authenticate',
    nonce: new Date().getTime(),
    chainId: SupraChainId.TESTNET,
  });

  if (response.approved) {
    console.log('Message signed successfully:', response);
  } else {
    console.log('Message signing rejected:', response.error);
  }
} catch (error) {
  console.error('Message signing failed:', error);
}
```

### 5. 💸 Transaction Handling

**Prepare Raw Transaction**
```typescript
import { BCS, type RawTxnRequest, type RawTransactionResponse } from 'ribbit-wallet-connect';

const receiver = BCS.bcsSerializeAddress('0x1234577898sdjbcws98y9......');
const amount = BCS.bcsSerializeU64(BigInt(100000000)); // 1 SUPRA = 100,000,000 microSUPRA
const tokenType = BCS.typeTagStruct('0x1::supra_coin::SupraCoin');

const transactionPayload: RawTxnRequest = {
  sender: selectedWalletAddress,
  sequenceNumber,
  moduleAddress: '0x1234578899999.........',
  moduleName: 'module name',
  functionName: 'function name',
  typeArgs: [tokenType],
  args: [receiver, amount],
  maxGasAmount: BigInt(5000),
  gasUnitPrice: BigInt(1),
  expirationTimestampSecs: Math.floor(Date.now() / 1000) + 300,
  chainId,
};

const rawTransactionBase64 = window.ribbit.createRawTransactionBuffer(transactionPayload);
```

**Send Transaction**
```typescript
try {
  const response: RawTransactionResponse = await window.ribbit.sendTransaction({
    rawTxn: rawTxnBase64,
    chainId,
    meta: {
      description: 'Send tokens',
    },
  });

  if (response.approved) {
    console.log('Transaction sent successfully:', response.result);
  } else {
    console.error('Transaction rejected:', response.error);
  }
} catch (error) {
  console.error('Transaction failed:', error);
}
```

### 6. 🔌 Disconnect

Safely disconnect from the wallet:

```typescript
try {
  await window.ribbit.disconnect();
  console.log('Disconnected successfully');
} catch (error) {
  console.error('Failed to disconnect:', error);
}
```

## 🌐 Supported Networks

| Network | Chain ID | Description |
|---------|----------|-------------|
| **Supra Testnet** | `6` | Development and testing environment |
| **Supra Mainnet** | `8` | Production blockchain network |

### Chain Configuration

```typescript
const SUPRA_CHAINS = {
  TESTNET: {
    chainId: 6,
    name: 'Supra Testnet',
    nativeCurrency: {
      name: 'SUPRA',
      symbol: 'SUPRA',
      decimals: 7
    }
  },
  MAINNET: {
    chainId: 8,
    name: 'Supra Mainnet',
    nativeCurrency: {
      name: 'SUPRA',
      symbol: 'SUPRA',
      decimals: 7
    }
  }
};
```

## 📚 API Reference

### Core Interface

```typescript
interface Window {
  ribbit?: {
    connectToWallet(metadata: DappMetadata): Promise<ConnectResponse>;
    getSessionStatus(): Promise<{success: boolean; message: string;}>;
    getWalletAddress(chainId: number): Promise<string>;
    getWalletBalance(request: WalletBalanceRequest): Promise<string>;
    signMessage(payload: SignMessagePayload): Promise<SignMessageResponse>;
    sendTransaction(payload: TransactionPayload): Promise<TransactionResponse>;
    disconnect(): Promise<void>;
  };
}
```

### Type Definitions

```typescript
interface DappMetadata {
  name: string;
  description: string;
  logo: string;
  url: string;
}

interface ConnectResponse {
  approved: boolean;
  sessionId?: string;
  accounts?: string[];
  chainId?: number;
  error?: string;
  message?: string;
}

interface WalletBalanceRequest {
  chainId: number;
  resourceType: string;
  decimals: number;
}
```

## 🛠 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler |

### Project Structure

```
ribbit-wallet-connect-demo/
├── src/
│   ├── components/     # React components
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── App.tsx        # Main application component
├── public/            # Static assets
├── docs/             # Documentation
└── package.json      # Project configuration
```

## 📦 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI Framework |
| **TypeScript** | 5.x | Type Safety |
| **Vite** | 7.x | Build Tool & Dev Server |
| **Ribbit Connect** | Latest | Wallet Integration SDK |

## 🔗 Blockchain Information

### Supra Blockchain Details

- **Native Token**: SUPRA
- **Decimals**: 7 (1 SUPRA = 10^7 microSUPRA)
- **Block Time**: ~1 second
- **Consensus**: AptosBFT

### Token Standards

| Standard | Description | Example |
|----------|-------------|---------|
| **Coin** | Native fungible tokens | `0x1::supra_coin::SupraCoin` |
| **Token** | Custom fungible tokens | `0x1::managed_coin::ManagedCoin` |

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><strong>❌ "Ribbit Wallet not detected"</strong></summary>

**Solutions:**
- Install the Ribbit Wallet browser extension
- Refresh the page after installation
- Check if the extension is enabled
- Try opening in an incognito/private window
</details>

<details>
<summary><strong>❌ Connection Rejected</strong></summary>

**Solutions:**
- Ensure you approve the connection in the wallet popup
- Verify DApp metadata is correctly configured
- Check if popup was blocked by browser
- Try disconnecting and reconnecting
</details>

<details>
<summary><strong>❌ Transaction Failed</strong></summary>

**Solutions:**
- Verify sufficient balance for transaction + gas fees
- Check that recipient address is valid
- Ensure you're connected to the correct network
- Verify transaction parameters are correct
</details>

<details>
<summary><strong>❌ Import/Export Errors</strong></summary>

**Solutions:**
- Check if all required dependencies are installed
- Verify import paths are correct
- Try restarting the development server
- Clear node_modules and reinstall dependencies
</details>

## 📈 Performance Tips

1. **Optimize Bundle Size**
   - Use dynamic imports for large dependencies
   - Implement code splitting for better load times

2. **Connection Management**
   - Cache connection status to avoid repeated API calls
   - Implement connection retry logic with exponential backoff

3. **Error Handling**
   - Always wrap wallet interactions in try-catch blocks
   - Provide meaningful error messages to users

## 🔒 Security Best Practices

- ✅ Always validate user inputs
- ✅ Implement proper error handling
- ✅ Never store private keys in frontend
- ✅ Use HTTPS in production
- ✅ Validate transaction parameters
- ✅ Implement rate limiting for API calls

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For technical support and questions:

- **Email**: [support@ribbitwallet.com](mailto:support@ribbitwallet.com)
- **Discord**: [Join our community](https://discord.com/invite/PQ96y6S9aS)

## 🙏 Acknowledgments

- Supra Foundation for blockchain infrastructure
- React team for the amazing framework
- Vite team for the lightning-fast build tool
- TypeScript team for type safety

---

<div align="center">
  <p><strong>Built with ❤️ by the Ribbit Team</strong></p>
  <p>
    <a href="https://ribbitwallet.com">Website</a> 
    <a href="https://x.com/ribbitwallet">Twitter</a> •
    <a href="https://discord.com/invite/PQ96y6S9aS">Discord</a>
  </p>
</div>
