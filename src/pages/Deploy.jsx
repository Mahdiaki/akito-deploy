import { useState } from "react";
import { ethers } from "ethers";

import simpleArtifact from "../ABI/SimpleCounter.json";

// کد قرارداد برای نمایش در صفحه
const simpleContractCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleCounter {
    uint public count;
    address public owner;

    constructor(address _owner) payable {
        count = 0;
        owner = _owner;
        require(msg.value >= 1 ether, "Send 1 ZTC as fee");
        payable(owner).transfer(msg.value);
    }

    function increment() public {
        count += 1;
    }
}
`;

export default function DeployContracts() {
  const [simpleAddress, setSimpleAddress] = useState("");
  const [simpleTxHash, setSimpleTxHash] = useState("");
  const [isDeploying, setIsDeploying] = useState("");
  const [error, setError] = useState("");

  const ownerAddress = "0xc9e84Df3D7C3C8763E7A6979BbFa67395A29eD5C";

  async function deployContract(artifact, setTxHash, setAddress, type) {
    setIsDeploying(type);
    setError("");
    setTxHash("");
    setAddress("");

    try {
      if (!window.ethereum) throw new Error("No wallet detected");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      await provider.send("eth_requestAccounts", []);

      const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
      const deployTx = await factory.deploy(ownerAddress, {
        value: ethers.utils.parseEther("1.0"),
        gasLimit: 3_000_000
      });

      setTxHash(deployTx.deployTransaction?.hash || deployTx.hash);
      const receipt = await deployTx.deployed();
      setAddress(receipt.address);
    } catch (err) {
      console.error(err);
      setError(err.message || "Deployment failed");
    } finally {
      setIsDeploying("");
    }
  }

  return (
    <>
      <h1 className="big">Deploy Contracts</h1>
      <div className="card" style={{ maxWidth: 660 }}>
        <div className="grid">
          <div>
            <div className="sub">Simple Contract</div>
            <pre style={{ background: "#06501eff", padding: "10px", borderRadius: "5px", overflow: "auto" }}>
              {simpleContractCode}
            </pre>
            <button
              className="btn btn-solid"
              onClick={() => deployContract(simpleArtifact, setSimpleTxHash, setSimpleAddress, "simple")}
              disabled={isDeploying === "simple"}
            >
              {isDeploying === "simple" ? "Deploying..." : "Deploy Simple"}
            </button>
            {simpleTxHash && (
              <div>
                <div className="sub">Transaction Hash</div>
                <p>{simpleTxHash}</p>
              </div>
            )}
            {simpleAddress && (
              <div>
                <div className="sub">Contract Address</div>
                <p>{simpleAddress}</p>
              </div>
            )}
          </div>

          {error && (
            <div style={{ color: "red" }}>
              <div className="sub">Error</div>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
