import { useState, useEffect } from 'react';
import './App.css';

// Import types from ribbit-connect package
import {
  type DappMetadata,
  type ConnectResponse,
  type TransactionResponse,
  type WalletBalanceRequest,
  type TransactionParams,
  TransportMessageType,
  SupraChainId,
} from 'ribbit-wallet-connect';

// Extend window object to include ribbit
declare global {
  interface Window {
    ribbit?: {
      ready: Promise<boolean>;
      connectToWallet(metadata: DappMetadata): Promise<ConnectResponse>;
      sendTransaction(payload: {
        method: TransportMessageType;
        params: unknown;
        chainId: number;
      }): Promise<TransactionResponse>;
      getSessionStatus(): Promise<{ sessionId: string | null }>;
      getWalletAddress(chainId: number): Promise<string>;
      getWalletBalance(request: WalletBalanceRequest): Promise<string>;
      disconnect(): Promise<void>;
    };
  }
}

function App() {
  const [sessionId, setSessionId] = useState<string>('');
  const [accounts, setAccounts] = useState<string[]>([]);
  const [chainId, setChainId] = useState<number | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Check if Ribbit wallet is available
  useEffect(() => {
    const init = async () => {
      if (!window.ribbit) {
        addLog('❌ Ribbit Wallet SDK not injected.');
        return;
      }

      try {
        const isReady = await window.ribbit.ready;
        if (isReady) {
          addLog('🐸 Ribbit Wallet is ready!');
          checkSessionStatus();
        } else {
          addLog('⚠️ Ribbit Wallet is not available.');
        }
      } catch (e) {
        addLog(`❌ Error initializing Ribbit Wallet: ${e}`);
      }
    };

    init();
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${timestamp}: ${message}`]);
    console.log(message);
  };

  const connectToWallet = async () => {
    if (!window.ribbit) {
      addLog('❌ ERROR: Ribbit Wallet not available');
      return;
    }

    try {
      addLog('🔗 Attempting to connect to Ribbit Wallet...');

      const dappMetadata: DappMetadata = {
        name: 'Ribbit DApp Demo',
        description: 'A demo application showcasing Ribbit Wallet Connect SDK',
        logo: window.location.origin + '/logo.png',
        url: window.location.origin,
      };

      const response: ConnectResponse = await window.ribbit.connectToWallet(
        dappMetadata
      );

      if (!response || !response?.approved) {
        addLog(
          `❌ Connection rejected: ${
            response?.error || response?.message || 'extension not available'
          }`
        );
        return;
      }

      setSessionId(response.sessionId || '');
      setAccounts(response.accounts || []);
      setChainId(response.chainId || null);
      setIsConnected(true);

      addLog(`✅ Connected successfully!`);
      addLog(`📋 Session ID: ${response.sessionId}`);
      addLog(`👛 Accounts: ${response.accounts?.join(', ')}`);
      addLog(`🔗 Chain ID: ${response.chainId}`);
    } catch (error) {
      addLog(`❌ Connection failed: ${error}`);
    }
  };

  const checkSessionStatus = async () => {
    if (!window.ribbit) {
      addLog('❌ ERROR: Ribbit Wallet not available');
      return;
    }

    try {
      addLog('🔍 Checking session status...');
      const session = await window.ribbit.getSessionStatus();
      if (!session) {
        addLog('❌ No active session found');
        setIsConnected(false);
      } else if (session.sessionId === null) {
        setIsConnected(false);
        addLog('❌ No active session found');
      } else if (session.sessionId === '') {
        setIsConnected(false);
        addLog('❌ No active session found');
      } else if (session.sessionId === undefined) {
        setIsConnected(false);
        addLog('❌ No active session found');
      } else if (session.sessionId === 'null') {
        setIsConnected(false);
        addLog('❌ No active session found');
      } else if (session.sessionId === 'undefined') {
        setIsConnected(false);
        addLog('❌ No active session found');
      } else if (session.sessionId === '0') {
        setIsConnected(false);
        addLog('❌ No active session found');
      } else if (session.sessionId === 'false') {
        setIsConnected(false);
        addLog('❌ No active session found');
      } else if (session.sessionId === 'true') {
        setIsConnected(false);
        addLog('❌ No active session found');
      } else if (session.sessionId === 'NaN') {
        setIsConnected(false);
        addLog('❌ No active session found');
      } else if (!session?.sessionId) {
        setIsConnected(false);
        addLog('❌ No active session found');
      } else if (session.sessionId) {
        setIsConnected(true);
        addLog('✅ Session is active');
      } else {
        setIsConnected(false);
        addLog('❌ No active session found');
      }
    } catch (error) {
      addLog(`❌ Failed to check session status: ${error}`);
      setIsConnected(false);
    }
  };

  const getWalletAddress = async () => {
    if (!window.ribbit || !isConnected) {
      addLog('❌ ERROR: Not connected to wallet');
      return;
    }

    try {
      addLog('📍 Getting wallet address...');
      const address = await window.ribbit.getWalletAddress(
        SupraChainId.TESTNET
      );
      setWalletAddress(address);
      addLog(`✅ Wallet address: ${address}`);
    } catch (error) {
      addLog(`❌ Failed to get wallet address: ${error}`);
    }
  };

  const getWalletBalance = async () => {
    if (!window.ribbit || !isConnected) {
      addLog('❌ ERROR: Not connected to wallet');
      return;
    }

    try {
      addLog('💰 Getting wallet balance...');
      const walletBalanceRequest: WalletBalanceRequest = {
        chainId: SupraChainId.TESTNET,
        resourceType: '<0x1::supra_coin::SupraCoin>',
        decimals: 8, // 1 SUPRA = 10^8 microSUPRA
      };
      const balance = await window.ribbit.getWalletBalance(
        walletBalanceRequest
      );
      setWalletBalance(balance);
      addLog(`✅ Wallet balance: ${balance} SUPRA`);
    } catch (error) {
      addLog(`❌ Failed to get wallet balance: ${error}`);
    }
  };

  const sendTransaction = async () => {
    if (!window.ribbit || !isConnected) {
      addLog('❌ ERROR: Not connected to wallet');
      return;
    }

    try {
      addLog('📝 Preparing transaction...');

      // Example transaction payload for Supra token transfer
      const transactionPayload: TransactionParams = {
        moduleAddress: '0x1',
        moduleName: 'supra_coin',
        functionName: 'transfer',
        tyArg: ['0x1::supra_coin::SupraCoin'],
        args: [
          '0x7a752cec6624d4894c2e4d83c53a8c4c8b4c7c9d', // Replace with actual recipient
          '1000000', // Amount in smallest unit (1 SUPRA = 1000000 microSUPRA)
        ],
      };

      addLog('🚀 Sending transaction...');
      const response: TransactionResponse = await window.ribbit.sendTransaction(
        {
          method: TransportMessageType.SEND_TRANSACTION,
          params: transactionPayload,
          chainId: SupraChainId.TESTNET,
        }
      );

      if (response.approved) {
        addLog(`✅ Transaction sent successfully!`);
        addLog(`🎯 Result: ${JSON.stringify(response.result)}`);
      } else {
        addLog(`❌ Transaction rejected: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      addLog(`❌ Transaction failed: ${error}`);
    }
  };

  const disconnect = async () => {
    if (!window.ribbit) {
      addLog('❌ ERROR: Ribbit Wallet not available');
      return;
    }

    try {
      addLog('🔌 Disconnecting...');
      await window.ribbit.disconnect();

      // Reset state
      setSessionId('');
      setAccounts([]);
      setChainId(null);
      setWalletAddress('');
      setWalletBalance('');
      setIsConnected(false);

      addLog('✅ Disconnected successfully');
    } catch (error) {
      addLog(`❌ Failed to disconnect: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('🧹 Logs cleared');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🐸 Ribbit Connect SDK Demo</h1>
        <p>
          Demo application showcasing the Ribbit Wallet Connect SDK integration
        </p>
        <div className="connection-status">
          Status:{' '}
          <span className={isConnected ? 'connected' : 'disconnected'}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
      </header>

      <main className="App-main">
        {/* Connection Controls */}
        <section className="controls-section">
          <h2>🔗 Connection Controls</h2>
          <div className="button-container">
            <button
              onClick={connectToWallet}
              className="demo-button connect"
              disabled={isConnected}
            >
              Connect Wallet
            </button>

            <button onClick={checkSessionStatus} className="demo-button status">
              Check Session
            </button>

            <button
              onClick={disconnect}
              className="demo-button disconnect"
              disabled={!isConnected}
            >
              Disconnect
            </button>
          </div>
        </section>

        {/* Wallet Information */}
        {isConnected && (
          <section className="wallet-info">
            <h2>📋 Wallet Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Session ID:</label>
                <code>{sessionId}</code>
              </div>
              <div className="info-item">
                <label>Chain ID:</label>
                <code>
                  {chainId}{' '}
                  {chainId === 6
                    ? '(Supra Testnet)'
                    : chainId === 8
                    ? '(Supra Mainnet)'
                    : ''}
                </code>
              </div>
              <div className="info-item">
                <label>Accounts:</label>
                <code>{accounts.join(', ')}</code>
              </div>
            </div>
          </section>
        )}

        {/* Wallet Actions */}
        <section className="actions-section">
          <h2>⚡ Wallet Actions</h2>
          <div className="button-container">
            <button
              onClick={getWalletAddress}
              className="demo-button info"
              disabled={!isConnected}
            >
              📍 Get Address
            </button>

            <button
              onClick={getWalletBalance}
              className="demo-button info"
              disabled={!isConnected}
            >
              💰 Get Balance
            </button>

            <button
              onClick={sendTransaction}
              className="demo-button transaction"
              disabled={!isConnected}
            >
              🚀 Send Transaction
            </button>
          </div>

          {/* Display wallet info */}
          {walletAddress && (
            <div className="wallet-data">
              <h3>📍 Wallet Address:</h3>
              <code>{walletAddress}</code>
            </div>
          )}

          {walletBalance && (
            <div className="wallet-data">
              <h3>💰 Wallet Balance:</h3>
              <code>{walletBalance} SUPRA</code>
            </div>
          )}
        </section>

        {/* SDK Documentation Quick Reference */}
        <section className="documentation-section">
          <h2>📚 Quick Reference</h2>
          <div className="docs-grid">
            <div className="doc-item">
              <h4>Chain IDs</h4>
              <ul>
                <li>
                  Supra Testnet: <code>{SupraChainId.TESTNET}</code>
                </li>
                <li>
                  Supra Mainnet: <code>{SupraChainId.MAINNET}</code>
                </li>
              </ul>
            </div>
            <div className="doc-item">
              <h4>Key Methods</h4>
              <ul>
                <li>
                  <code>window.ribbit.connectToWallet()</code>
                </li>
                <li>
                  <code>window.ribbit.sendTransaction()</code>
                </li>
                <li>
                  <code>window.ribbit.getSessionStatus()</code>
                </li>
                <li>
                  <code>window.ribbit.disconnect()</code>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Logs Section */}
        <section className="logs-container">
          <div className="logs-header">
            <h2>📝 Activity Logs</h2>
            <button onClick={clearLogs} className="clear-logs">
              🧹 Clear Logs
            </button>
          </div>
          <div className="logs">
            {logs.length === 0 ? (
              <p className="no-logs">
                No activity yet. Try connecting to the wallet!
              </p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="log-entry">
                  {log}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
