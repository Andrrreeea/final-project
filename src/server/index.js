import { spawn } from "child_process";
import express, { json } from "express";

const app = express();
const port = 5000;

app.use(json());

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/mint", (req, res) => {
  const { packageId, treasuryCapId, amount, walletAddress } = req.body;

  if (!packageId || !treasuryCapId || !walletAddress) {
    return res.status(400).send("Parameters missing");
  }

  const command = "sui";
  const args = [
    "client",
    "call",
    "--package",
    packageId,
    "--module",
    "ibt",
    "--function",
    "mint",
    "--args",
    treasuryCapId,
    amount,
    walletAddress,
    "--gas-budget",
    "10000000",
  ];

  const child = spawn(command, args);

  child.on("close", (code) => {
    if (code !== 0) {
      console.error(`Command failed with code ${code}: ${errorOutput}`);
      return res.status(500).json({ error: `Command failed with code ${code}: ${errorOutput}` });
    }
    console.log(`Command output: ${output}`);

    res.json({ message: "Sui tokens minted." });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
