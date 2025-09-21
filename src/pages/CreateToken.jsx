import { useState } from "react";
import { ethers } from "ethers";
import factoryArtifact from "../ABI/factorytokenABI.json"; // آرتیفکت کامل
import { factoryAddress } from "../constants/contract.js"; // آدرس دیپلوی‌شده

// فقط ABI رو بگیریم
const factorytokenABI = factoryArtifact.abi ? factoryArtifact.abi : factoryArtifact;

export default function CreateToken() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");

  async function createToken() {
    setIsLoading(true);
    setError("");
    try {
      if (!window.ethereum) throw new Error("No wallet detected");
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const factory = new ethers.Contract(factoryAddress, factorytokenABI, signer);

      // ❌ supply رو دوبار ضرب نکنیم
      const feeAmount = ethers.utils.parseEther("10"); // 10 ZTC (با 18 دسیمال)
      console.log("Supply:", supply, "Decimals:", decimals, "Fee:", feeAmount.toString());

      // توکن جدید بسازیم
      const tx = await factory.createToken(
        name,
        symbol,
        supply, // supply ساده
        decimals,
        { value: feeAmount }
      );
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      // 📌 استخراج رویداد TokenCreated با interface
      const iface = new ethers.utils.Interface(factorytokenABI);
      let tokenAddr = null;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed.name === "TokenCreated") {
            tokenAddr = parsed.args.tokenAddress;
            break;
          }
        } catch (e) {}
      }

      if (!tokenAddr) throw new Error("TokenCreated event not found!");

      setTxHash(receipt.transactionHash);
      setTokenAddress(tokenAddr);
      alert("✅ Token created successfully!");
    } catch (err) {
      console.error("Create token error:", err);
      setError(err.reason || err.message || "Failed to create token");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 className="big">Create Token</h1>
      <div className="card" style={{ maxWidth: 560 }}>
        <div className="grid">
          <label>
            <div className="sub">Token Name</div>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., MyToken"
            />
          </label>
          <label>
            <div className="sub">Token Symbol</div>
            <input
              className="input"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g., MTK"
            />
          </label>
          <label>
            <div className="sub">Total Supply</div>
            <input
              className="input"
              type="number"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              placeholder="e.g., 1000000"
            />
          </label>
          <label>
            <div className="sub">Decimals</div>
            <input
              className="input"
              type="number"
              value={decimals}
              onChange={(e) => setDecimals(Number(e.target.value))}
              placeholder="e.g., 18"
            />
          </label>
          <button
            className="btn btn-solid"
            onClick={createToken}
            disabled={isLoading || !name || !symbol || !supply}
          >
            {isLoading ? "Creating..." : "Create Token (10 ZTC Fee)"}
          </button>
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          {txHash && (
            <div>
              <p>
                Transaction Hash:{" "}
                <a
                  href={`https://explorer.zenchain.org/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {txHash}
                </a>
              </p>
              <p>
                Token Address:{" "}
                <a
                  href={`https://explorer.zenchain.org/address/${tokenAddress}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {tokenAddress}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
