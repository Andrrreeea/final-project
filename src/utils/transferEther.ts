import { ethers, parseEther, parseUnits } from "ethers";

export default async function transferEther() {
  const ethProvider = new ethers.BrowserProvider(window.ethereum);

  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, ethProvider);

  const recipient = import.meta.env.VITE_RECEPIENT_ADDRESS;

  const txResponse = await wallet.sendTransaction({
    to: recipient,
    value: parseEther("1000"),
    gasPrice: parseUnits("5", "gwei"),
  });

  await txResponse.wait();
  console.log("Transfer ok.");
}
