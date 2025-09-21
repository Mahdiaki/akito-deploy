import { useState } from "react";
import { ethers } from "ethers";

import gmArtifact from "../ABI/GMMsg.json";

// فقط کد قرارداد GM
const gmContractCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GMMsg {
    string public message;
    address public owner;

    constructor(address _owner) payable {
        message = "GM";
        owner = _owner;
        require(msg.value >= 1 ether, "Send 1 ZTC as fee");
        payable(owner).transfer(msg.value);
    }

    function setMessage(string memory _msg) public {
        message = _msg;
    }
}
`;

export default function DeployGM() {
  const [gmAddress, setGmAddress] = useState("");
  const [gmTxHash, setGmTxHash] = useState("");
  const [isDeploying, setIsDeploying] = useState("");
  const [error, setError] = useState("");

  const ownerAddress = "0xc9e84Df3D7C3C8763E7A6979BbFa67395A29eD5C";

  async function deployContract() {
    setIsDeploying("gm");
    setError("");
    setGmTxHash("");
    setGmAddress("");

    try {
      if (!window.ethereum) throw new Error("No wallet detected");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      await provider.send("eth_requestAccounts", []);

      const factory = new ethers.ContractFactory(gmArtifact.abi, gmArtifact.bytecode, signer);
      const deployTx = await factory.deploy(ownerAddress, {
        value: ethers.utils.parseEther("1.0"),
        gasLimit: 3_000_000
      });

      setGmTxHash(deployTx.deployTransaction?.hash || deployTx.hash);
      const receipt = await deployTx.deployed();
      setGmAddress(receipt.address);
    } catch (err) {
      console.error(err);
      setError(err.message || "Deployment failed");
    } finally {
      setIsDeploying("");
    }
  }

  return (
    <>
      <h1 className="big">Deploy GM Contract</h1>
      <div className="card" style={{ maxWidth: 660 }}>
        <div>
          <div className="sub">GM Contract</div>
          <pre
            style={{
              background: "#06501eff",
              padding: "10px",
              borderRadius: "5px",
              overflow: "auto"
            }}
          >
            {gmContractCode}
          </pre>
          <button
            className="btn btn-solid"
            onClick={deployContract}
            disabled={isDeploying === "gm"}
          >
            {isDeploying === "gm" ? "Deploying..." : "Deploy GM"}
          </button>
          {gmTxHash && (
            <div>
              <div className="sub">Transaction Hash</div>
              <p>{gmTxHash}</p>
            </div>
          )}
          {gmAddress && (
            <div>
              <div className="sub">Contract Address</div>
              <p>{gmAddress}</p>
            </div>
          )}
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
