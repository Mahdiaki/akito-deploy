import { useEffect, useState } from "react";
const ZEN_TESTNET = {
    chainId: "0x20d8", 
    // 8408  
    chainName: "ZenChain Testnet",  
    nativeCurrency: { name: "ZTC", symbol: "ZTC", decimals: 18 }, 
    rpcUrls: [
        // این را با RPC درست خود ZenChain Testnet عوض کن   
         "https://zenchain-testnet.api.onfinality.io/public",
        ],  blockExplorerUrls: ["https://zentrace.io/"]};
export default function ConnectWallet(){  
    const [account,setAccount]=useState(null);  
    const [ok,setOk]=useState(false);
  async function ensureChain(){    try{      
    await window.ethereum.request({       
         method:"wallet_switchEthereumChain",        
         params:[{ chainId: ZEN_TESTNET.chainId }]      
        });      
        setOk(true);    
    }catch(e){      
        if(e.code === 4902){        
            await window.ethereum.request({          
                method:"wallet_addEthereumChain",          
                params:[ZEN_TESTNET]        
            });        
            setOk(true);      
        }else{        
            console.error(e);      
        }    
    }  
}
  async function connect(){    
    if(!window.ethereum){ alert("MetaMask نصب نیست."); return; }    
    const [acc] = await window.ethereum.request({ method:"eth_requestAccounts" });    
    setAccount(acc);    
    await ensureChain();  
}
  useEffect(()=>{    
    if(!window.ethereum) return;    
    const handleChain = (cid)=> setOk(cid === ZEN_TESTNET.chainId);    
    const handleAccounts = (accs)=> setAccount(accs?.[0] ?? null);    
    window.ethereum.on("chainChanged", handleChain);    
    window.ethereum.on("accountsChanged", handleAccounts);   
     return ()=>{      
        window.ethereum?.removeListener("chainChanged", handleChain);      
        window.ethereum?.removeListener("accountsChanged", handleAccounts);    
    }; 
 },[]);
  return (    
<button className={`btn ${ok ? "btn-solid" : "btn-outline"}`} onClick={connect}>      
    {account ? `${account.slice(0,6)}…${account.slice(-4)}` : "Connect Wallet"}    
    </button>  
    );}