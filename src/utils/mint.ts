import { ethers, parseUnits } from "ethers";
import IBTTokenContract from "../../out/Token.s.sol/Token.json";

export async function mintEthereumIBT(amount: string) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contractAddress = import.meta.env.VITE_ETH_IBT_CONTRACT;
  const contractABI = IBTTokenContract.abi;

  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  await contract.mint(parseUnits(amount, 18));

  contract.on("MintEvent", (to, amount) => {
    alert(`Minted to ${to} amount ${amount}`);
  });
}

export async function mintSuiIBT(amount: string, walletAddress: string) {
  const packageId = import.meta.env.VITE_SUI_IBT_CONTRACT;
  const treasuryCapId = import.meta.env.VITE_SUI_IBT_TREASURY_CAP;

  try {
    const response = await fetch("http://localhost:5000/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        packageId,
        amount,
        treasuryCapId,
        walletAddress,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const serverResponse: { error?: string; message?: string } = await response.json();
    if (!serverResponse?.message) {
      console.log(serverResponse.error || serverResponse);
      throw new Error("There's been an error minting coins.");
    }

    alert(serverResponse.message);
  } catch (error) {
    console.error("Error minting tokens:", error);
    throw new Error("Error minting tokens");
  }
}
