import { ethers, parseUnits } from "ethers";
import IBTTokenContract from "../../out/Token.s.sol/Token.json";
import { mintSuiIBT } from "./mint";

export async function convertFromEthereumToSuiTokens(amount: string, suiWalletAddress: string) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contractAddress = import.meta.env.VITE_ETH_CONTRACT;
    const contractABI = IBTTokenContract.abi;

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log(contract);
    await contract.burn(parseUnits(amount, 18));

    contract.on("BurnEvent", (_, amount) => {
      alert("IBT coins from Ethereum successfully burned.");
      mintSuiIBT(amount, suiWalletAddress).then(alert).catch(alert);
    });
  } catch (error) {
    console.error(error);
    throw new Error("There's been an error burning Ethereum IBT coins.");
  }
}
