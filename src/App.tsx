import { useCurrentAccount } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import "./index.css";
import TransferringPart from "./TransferringPart";
import { deploySolidityContract } from "./utils/deployContract";
import { mintEthereumIBT, mintSuiIBT } from "./utils/mint";
import transferEther from "./utils/transferEther";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
  }
}

const App = () => {
  const account = useCurrentAccount();

  return (
    <div className="App">
      <div className="buttons">
        <button onClick={transferEther}>Add eth</button>
        <button onClick={() => mintEthereumIBT("500")}>Mint 500 IBT coins</button>
        <button onClick={deploySolidityContract}>Deploy contract on Ethereum</button>
        <button onClick={() => mintSuiIBT("500", account?.address || "")}>Mint 1000 IBT coins</button>
      </div>
      <TransferringPart />
    </div>
  );
};

export default App;
