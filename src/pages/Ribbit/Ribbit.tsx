import { useEffect, useState } from 'react';

import {
  type DappMetadata,
  type WalletBalanceRequest,
  type RawTransactionResponse,
  type SignMessageRequest,
  type SignMessageResponse,
  type RawTxnRequest,
  SupraChainId,
  BCS,
  type WalletInfo,
  initSdk,
  type RibbitWalletSDK,
} from 'ribbit-wallet-connect';

const Ribbit = () => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [sdk, setSdk] = useState<RibbitWalletSDK | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Check if Ribbit wallet is available
  useEffect(() => {
    try {
      const instance: RibbitWalletSDK | null = initSdk();
      setSdk(instance);

      const existing = instance?.getWalletInfo();
      if (existing?.connected) {
        setWallet(existing);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error initializing SDK:', error);
    }
  }, []);

  useEffect(() => {
    const handler = () => checkSessionStatus();
    window.addEventListener('ribbit-wallet-connected', handler);
    return () => window.removeEventListener('ribbit-wallet-connected', handler);
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `${timestamp}: ${message}`]);
    console.log(message);
  };

  const connectToWallet = async () => {
    try {
      if (!sdk) {
        return;
      }

      const dAppMetaData: DappMetadata = {
        name: 'Ribbit DApp Demo',
        description: 'A demo application showcasing Ribbit Wallet Connect SDK',
        logo: window.location.origin + '/assets/icon256.png',
        url: window.location.origin,
      };
      const info: WalletInfo = await sdk.connectToWallet(dAppMetaData);
      setWallet(info);
      setIsConnected(true);
      addLog(`✅ Connected to wallet: ${info.walletAddress}`);
    } catch (error) {
      addLog(`❌ Error connecting to wallet: ${error}`);
    }
  };

  const checkSessionStatus = async () => {
    try {
      if (!sdk) {
        addLog('❌ Ribbit not found');
      }
      const connectedWallet = sdk?.getWalletInfo();
      if (connectedWallet?.connected) {
        setWallet(connectedWallet);
        setIsConnected(true);
        addLog(`✅ Session is active: ${connectedWallet.walletAddress}`);
      }
    } catch (error) {
      addLog(`❌ Error checking session status: ${error}`);
    }
  };

  const getWalletAddress = async () => {
    try {
      if (!sdk) {
        console.warn('Ribbit not found');
      }
      const connectedWallet = sdk?.getWalletInfo();
      if (connectedWallet?.connected) {
        setWallet(connectedWallet);
        setIsConnected(true);
        addLog(`✅ Wallet address: ${connectedWallet.walletAddress}`);
      }
    } catch (error) {
      addLog(`❌ Error checking session status: ${error}`);
    }
  };

  const signMessage = async (message: string, nonce: number) => {
    if (!sdk || !isConnected) {
      addLog('❌ ERROR: Not connected to wallet');
      return;
    }

    const signMessageRequest: SignMessageRequest = {
      message: `${message} at ${nonce}`,
      nonce,
      chainId: SupraChainId.TESTNET,
    };

    try {
      addLog('📝 Signing message...');
      const response: SignMessageResponse = await sdk.signMessage(
        signMessageRequest
      );
      if (response.approved) {
        addLog(`✅ Message signed successfully!`);
        addLog(`🎯 Result: ${JSON.stringify(response)}`);
      } else {
        addLog(
          `❌ Message signing rejected: ${response.error || 'Unknown error'}`
        );
      }
    } catch (error) {
      addLog(`❌ Message signing failed: ${error}`);
    }
  };

  const getWalletBalance = async () => {
    if (!sdk || !isConnected) {
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
      const balance = await sdk.getWalletBalance(walletBalanceRequest);
      console.log(balance);
      setWalletBalance(balance.balance);
      addLog(`✅ Wallet balance: ${balance.balance} SUPRA`);
    } catch (error) {
      addLog(`❌ Failed to get wallet balance: ${error}`);
    }
  };

  const sendTransaction = async () => {
    if (!sdk || !isConnected) {
      addLog('❌ ERROR: Not connected to wallet');
      return;
    }

    try {
      if (!sdk || !wallet) {
        addLog('❌ ERROR: Not connected to wallet');
        return;
      }
      addLog('🚀 Sending transaction...');
      const chainId = SupraChainId.TESTNET;
      const receiver = BCS.bcsSerializeAddress(
        '0xcd57ba74df68ceea6c46b0e30ac77204bd043d1f57b92384c8d42acb9ed63184'
      );
      const amount = BCS.bcsSerializeU64(BigInt(100000000)); // 1 SUPRA = 100,000,000 microSUPRA
      const tokenType = BCS.typeTagStruct('0x1::supra_coin::SupraCoin');

      const rawTxnRequest: RawTxnRequest = {
        sender: wallet?.walletAddress,
        moduleAddress:
          '0x4feceed8187cde99299ba0ad418412a7d84e54b70bdc4efe756067ca0c3f9c9a',
        moduleName: 'token',
        functionName: 'send',
        typeArgs: [tokenType],
        args: [receiver, amount],
        chainId,
      };

      const rawTxnBase64: string = await sdk.createRawTransactionBuffer(
        rawTxnRequest
      );

      console.log('Raw Transaction from website:', rawTxnBase64);

      // Send to wallet
      const response: RawTransactionResponse =
        await sdk.signAndSendRawTransaction({
          rawTxn: rawTxnBase64,
          chainId,
          meta: {
            description: 'Send tokens',
          },
        });

      if (response.approved) {
        addLog(`✅ Transaction sent! Hash: ${response.txHash}`);
      } else {
        addLog(`❌ Transaction rejected: ${response.error}`);
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
      await sdk?.disconnect();
      // Reset state
      setWallet(null);
      setChainId(null);
      setWalletBalance(null);
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
    <div className="app">
      <header className="App-header">
        <h3>🐸 Ribbit Connect SDK Demo</h3>
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
                <label>Connected Wallet:</label>
                <code>{isConnected ? 'Connected' : 'Not connected'}</code>
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
              onClick={() =>
                signMessage('Sign to login at', new Date().getTime())
              }
              className="demo-button info"
              disabled={!isConnected}
            >
              📝 Sign message
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
          {wallet?.walletAddress && (
            <div className="wallet-data">
              <h3>📍 Wallet Address:</h3>
              <code>{wallet?.walletAddress || 'Not yet connected'}</code>
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
                  <code>window.ribbit.getWalletAddress()</code>
                </li>
                <li>
                  <code>window.ribbit.createRawTransaction()</code>
                </li>
                <li>
                  <code>window.ribbit.signAndSendRawTransaction()</code>
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
};

export default Ribbit;
