import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [tab, setTab] = useState('multiple'); // Default to multiple deposits
  const [depositAmount, setDepositAmount] = useState(1); // State for deposit amount
  const [withdrawAmount, setWithdrawAmount] = useState(1); // State for withdraw amount

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async (amount) => {
    if (atm) {
      let tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
    }
  }

  const withdraw = async (amount) => {
    if (atm) {
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
    }
  }

  const withdrawAllButOne = async () => {
    if (atm && balance > 1) {
      let tx = await atm.withdraw(balance - 1);
      await tx.wait();
      getBalance();
    } else {
      alert("Insufficient balance to withdraw and leave 1 ETH.");
    }
  }

  const handleDepositAmountChange = (e) => {
    setDepositAmount(Number(e.target.value));
  }

  const handleWithdrawAmountChange = (e) => {
    setWithdrawAmount(Number(e.target.value));
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <div className="tabs">
          <button className={tab === 'multiple' ? 'active' : ''} onClick={() => setTab('multiple')}>Multiple Deposits</button>
          <button className={tab === 'withdraw' ? 'active' : ''} onClick={() => setTab('withdraw')}>Withdraw Amount</button>
          <button className={tab === 'withdrawAll' ? 'active' : ''} onClick={() => setTab('withdrawAll')}>Withdraw All But 1</button>
        </div>
        {tab === 'multiple' && (
          <div className="tab-content">
            <input
              type="number"
              value={depositAmount}
              onChange={handleDepositAmountChange}
              min="1"
            />
            <button onClick={() => deposit(depositAmount)}>Deposit {depositAmount} ETH</button>
          </div>
        )}
        {tab === 'withdraw' && (
          <div className="tab-content">
            <input
              type="number"
              value={withdrawAmount}
              onChange={handleWithdrawAmountChange}
              min="1"
              max={balance - 1}
            />
            <button onClick={() => withdraw(withdrawAmount)}>Withdraw {withdrawAmount} ETH</button>
          </div>
        )}
        {tab === 'withdrawAll' && (
          <div className="tab-content">
            <button onClick={withdrawAllButOne}>Withdraw All But 1 ETH</button>
          </div>
        )}
      </div>
    )
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
        .tabs {
          margin: 20px 0;
        }
        .tabs button {
          margin: 0 5px;
          padding: 10px 20px;
          cursor: pointer;
        }
        .tabs .active {
          font-weight: bold;
          border-bottom: 2px solid #000;
        }
        .tab-content {
          margin-top: 20px;
        }
        .tab-content input {
          padding: 5px;
          margin-right: 10px;
        }
        .tab-content button {
          padding: 10px 20px;
        }
      `}
      </style>
    </main>
  )
}
