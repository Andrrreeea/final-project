import { ethers } from "ethers";
import IBTTokenContract from "../../out/Token.s.sol/Token.json";

export async function deploySolidityContract() {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const ContractFactory = new ethers.ContractFactory(IBTTokenContract.abi, IBTTokenContract.bytecode, signer);

    const contract = await ContractFactory.deploy();
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();

    console.log(contractAddress);
  } catch (error) {
    console.error(error);
  }
}
