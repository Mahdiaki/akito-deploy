import { ethers } from "ethers";
import factorytokenABI from "../ABI/factorytokenABI.json";

let provider, signer,  faucet, factoryContract;

async function connectContracts() {
  console.log("Starting connection...", { ethereum: typeof window.ethereum });
  if (!window.ethereum || typeof window.ethereum === "undefined") {
    console.error("MetaMask not detected. Please install it.");
    return false;
  }
  try {
    console.log("Ethers Loaded:", typeof ethers, typeof ethers.providers);
    if (!ethers.providers || !ethers.providers.Web3Provider) {
      console.error("Ethers providers not loaded correctly. Check installation");
      return false;
    }
    console.log("Checking ABI imports:", {  faucetABI, factorytokenABI });
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    console.log("Provider created:", provider);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    console.log("Signer obtained:", await signer.getAddress());

    // تعریف Contract‌ها
    wrapperHelper = new ethers.Contract("0x868956342E65D75ef4126C2568aAfa25B8EcB7d4", AbiWrapperHelper, signer);
    faucet = new ethers.Contract("0xE1CF608e1514Ca909e27d1c7748bb7A63244d9bc", faucetABI, signer);
    factoryContract = new ethers.Contract("0x822d2358B2355A9b3b90A42d6e2de50f913707Db", factorytokenABI, signer); // Contract برای TokenFactory

    console.log("Contracts connected:", await signer.getAddress());
    window.dispatchEvent(new Event("contractsLoaded"));
    return true;
  } catch (error) {
    console.error("Error connecting contracts:", error);
    return false;
  }
}

// اتصال خودکار با چک
if (document.readyState === "complete" || document.readyState === "interactive") {
  connectContracts().then((success) => {
    if (!success) throw new Error("Connection failed");
  }).catch((err) => console.error("Initial connection error:", err));
} else {
  window.addEventListener("load", () => {
    connectContracts().then((success) => {
      if (!success) throw new Error("Connection failed");
    }).catch((err) => console.error("Initial connection error:", err));
  });
}

// export متغیرها
let exportedContracts = {};
connectContracts().then((success) => {
  if (success) {
    exportedContracts = { wrapperHelper, faucet, factoryContract };
    console.log("Exported contracts:", exportedContracts);
  }
});

export {  factorytokenABI };
export const factoryAddress = "0x4d426Ff15fF866865D2eF1F37131993E8Db66Cba"; // آدرس ثابت TokenFactory