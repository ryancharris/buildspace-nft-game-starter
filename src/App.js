import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "ryan_c_harris";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install a web3 wallet");
        return;
      }

      // Ask for access to wallet's account
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected!", accounts[0]);
      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkForWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        // The user has no wallet
        console.log("You need to connect a web3 wallet!");
        return;
      } else {
        // The user has a web3 wallet in their browser
        console.log("We detect you have a web3 wallet!");

        // Fetch the accounts in the wallet
        const accounts = await ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length !== 0) {
          const account = accounts[0];
          setAccount(account);
          console.log("Added account from your wallet:", account);
        } else {
          console.log("No accounts found in your wallet...");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkForWallet();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Final Fantasy</p>
          <p className="header gradient-text">⚔️</p>
          <p className="header gradient-text">Blockchain</p>
          <p className="sub-text">
            Sepiroth has invaded the metaverse and we must stop him!
          </p>
          <div className="connect-wallet-container">
            <img
              src="https://media.giphy.com/media/xUNda4iGoWk9YqKS0U/giphy.gif"
              alt="Final Fantasy VII GIF"
            />
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWallet}
            >
              Connect Wallet To Get Started
            </button>
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
