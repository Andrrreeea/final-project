import { ConnectButton, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { ethers, formatUnits } from "ethers";
import { useEffect, useState } from "react";
import IBTTokenContract from "../out/Token.s.sol/Token.json";
import { convertFromEthereumToSuiTokens } from "./utils/converter";

export default function Transfer() {
  const [userAccount, setUserAccount] = useState<string | null>(null);
  const [ethIbtBalance, setEthIbtBalance] = useState<string | null>(null);
  const [connectStatus, setConnectStatus] = useState<boolean>(false);
  const [suiIbtBalance, setSuiIbtBalance] = useState<string | null>(null);

  const suiClient = useSuiClient();
  const suiWallet = useCurrentAccount();

  useEffect(() => {
    (async () => {
      if (!suiWallet) return;

      try {
        const suiContractAddress = import.meta.env.VITE_SUI_CONTRACT;

        const balance = await suiClient.getBalance({
          owner: suiWallet.address,
          coinType: `${suiContractAddress}::ibt::IBT`,
        });

        setEthIbtBalance(balance.totalBalance);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [suiIbtBalance, suiWallet, suiClient]);

  useEffect(() => {
    if (!connectStatus) return;

    (async () => {
      const ethContractAddress = import.meta.env.VITE_ETH_CONTRACT;

      try {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        const ethSigner = await ethProvider.getSigner();
        const ibtContract = new ethers.Contract(ethContractAddress, IBTTokenContract.abi, ethSigner);

        const walletAddr = await ethSigner.getAddress();
        const balance = await ibtContract.balanceOf(walletAddr);
        setEthIbtBalance(formatUnits(balance, 18));
        setUserAccount(walletAddr);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [connectStatus]);

  const [ethAmount, setEthAmount] = useState<number>(0);
  const [suiAmount, setSuiAmount] = useState<number>(0);

  return (
    <>
      <div className="metamask">
        <button className="connect-button" onClick={() => setConnectStatus(true)}>
          Connect on Ethereum
        </button>
        {userAccount && (
          <div className="details">
            {ethIbtBalance && <p>Amount: {ethIbtBalance} IBT</p>}

            <input
              value={ethAmount}
              onChange={(event) => setEthAmount(Number(event.target.value) || 0)}
              id="amount"
              type="text"
              placeholder="Amount"
            />
            <br />
            <button
              onClick={() => {
                if (!suiWallet?.address) return;
                convertFromEthereumToSuiTokens(ethAmount.toString(), suiWallet.address);
              }}
            >
              Transfer IBT tokens
            </button>
          </div>
        )}
      </div>

      <ConnectButton className="connect-button" onClick={() => setSuiIbtBalance("0")} connectText="Connect with Sui" />
      {suiIbtBalance !== null && (
        <div className="sui-details">
          {suiIbtBalance && <p>Amount: {suiIbtBalance} IBT</p>}
          <input
            value={suiAmount}
            onChange={(event) => setSuiAmount(Number(event.target.value))}
            type="number"
            placeholder="Amount"
          />
          <button>Transfer IBT tokens</button>
        </div>
      )}
    </>
  );
}
