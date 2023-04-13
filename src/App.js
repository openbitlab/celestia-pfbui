import './App.css';
import React from 'react'
import { useEffect, useState } from 'react';
import { SigningStargateClient } from "@cosmjs/stargate";

export const BLOCKSPACERACE_PARAMS = {
  chainId: 'blockspacerace',
  chainName: 'Blockspace Race Testnet',
  rpc: 'https://rpc-2.celestia.nodes.guru/',
}

function encodeDataToHex(data) {
  let hex = '';
  for (let i = 0; i < data.length; i++) {
    console.log(typeof(data));
    const codePoint = data.charCodeAt(i);
    const hexCodePoint = codePoint.toString(16);
    hex += hexCodePoint;
  }
  return hex;
}

function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);

  const [retrieveNamespace, setRetrieveNamespace] = useState("");
  const [retrieveBlock, setRetrieveBlock] = useState(0);

  const [submitNamespace, setSubmitNamespace] = useState("");
  const [submitData, setSubmitData] = useState("");

  async function add() {
    if (!window.keplr) {
      alert("Please install keplr extension");
    } else {
      if (window.keplr.experimentalSuggestChain) {
        try {
          await window.keplr.experimentalSuggestChain({
            chainId: BLOCKSPACERACE_PARAMS.chainId,
            chainName: BLOCKSPACERACE_PARAMS.chainName,
            rpc: BLOCKSPACERACE_PARAMS.rpc,
            rest: BLOCKSPACERACE_PARAMS.rest,
            bip44: {
              coinType: 118,
            },
            bech32Config: {
              bech32PrefixAccAddr: "celestia",
              bech32PrefixAccPub: "celestia" + "pub",
              bech32PrefixValAddr: "celestia" + "valoper",
              bech32PrefixValPub: "celestia" + "valoperpub",
              bech32PrefixConsAddr: "celestia" + "valcons",
              bech32PrefixConsPub: "celestia" + "valconspub",
            },
            currencies: [
              {
                coinDenom: "TIA",
                coinMinimalDenom: "utia",
                coinDecimals: 6,
                coinGeckoId: "celestia",
              },
            ],
            feeCurrencies: [
              {
                coinDenom: "TIA",
                coinMinimalDenom: "utia",
                coinDecimals: 6,
                coinGeckoId: "celestia",
                gasPriceStep: {
                  low: 0.01,
                  average: 0.025,
                  high: 0.04,
                },
              },
            ],
            stakeCurrency: {
              coinDenom: "TIA",
              coinMinimalDenom: "utia",
              coinDecimals: 6,
              coinGeckoId: "celestia",
            },
          })
        } catch {
          alert("Failed to suggest the chain");
        }
      }
      // Enabling before using the Keplr is recommended.
      // This method will ask the user whether to allow access if they haven't visited this website.
      // Also, it will request that the user unlock the wallet if the wallet is locked.
      await window.keplr.enable(BLOCKSPACERACE_PARAMS.chainId);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('submit ' + submitNamespace + ', ' + submitData);
  }

  async function handleRetrieve(e) {
    e.preventDefault();
    console.log('retrieve ' + retrieveBlock + ', ' + retrieveNamespace);

    const namespaceId = encodeDataToHex(retrieveNamespace);
    try {
      const response = await fetch(`${BLOCKSPACERACE_PARAMS['rpc']}namespaced_shares/${namespaceId}/height/${retrieveBlock}`);
      const json = await response.json();
      alert(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    const fetchAddress = async (offlineSigner) => {
      const accounts = await offlineSigner.getAccounts();;
      setAccount(accounts[0].address);
    }

    const fetchBalance = async (offlineSigner) => {
      const signingClient = await SigningStargateClient.connectWithSigner(
        {
          url: BLOCKSPACERACE_PARAMS.rpc,
          headers: {
            'Content-Type': 'application/json'
          }
        },
        offlineSigner
      )
      const balance = await signingClient.getBalance(account, "utia")
      if (balance) {
        setBalance(balance.amount * 10 ** -6)
      }
    }

    add();
    const offlineSigner = window.keplr.getOfflineSigner(BLOCKSPACERACE_PARAMS.chainId);
    fetchAddress(offlineSigner)
      .catch(console.error);
    if (account) {
      fetchBalance(offlineSigner)
        .catch(console.error);
    }
  }, [account, balance]);

  return (
    <div className="App container py-5">
      <h1 className="mb-5">PFB Transaction</h1>
      {
        account ?
          <div>
            <h3 className="mb-6">Connected account: <span id="address">{account}</span></h3>
            <h3 className="mb-5">Balance: <span id="balance">{balance}</span> TIA</h3>
          </div> :
          <h3>No account connected!</h3>
      }
      <div className="row">
        <div className="col-md-6">
          <h2>Submit</h2>
          <form onSubmit={handleSubmit} id="submit-form" className="mb-5">
            <div className="mb-3">
              <label htmlFor="namespace-id" className="form-label">Namespace ID:</label>
              <input
                type="text"
                value={submitNamespace}
                onChange={(e) => setSubmitNamespace(e.target.value)}
                id="namespace-id" className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="data" className="form-label">Data:</label>
              <input
                type="text"
                value={submitData}
                onChange={(e) => setSubmitData(e.target.value)}
                id="data" className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
        <div className="col-md-6">
          <h2>Retrieve</h2>
          <form onSubmit={handleRetrieve} id="retrieve-form" className="mb-5">
            <div className="mb-3">
              <label htmlFor="retrieve-namespace-id" className="form-label">Namespace ID:</label>
              <input
                type="text"
                value={retrieveNamespace}
                onChange={(e) => setRetrieveNamespace(e.target.value)}
                id="retrieve-namespace-id" className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="blockheight" className="form-label">Blockheight:</label>
              <input
                type="number"
                value={retrieveBlock}
                onChange={(e) => setRetrieveBlock(e.target.value)}
                id="blockheight" className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary">Retrieve</button>
          </form>
        </div>
      </div>
      <h2>Result:</h2>
      <pre id="result"></pre>
    </div>
  );
}

export default App;
