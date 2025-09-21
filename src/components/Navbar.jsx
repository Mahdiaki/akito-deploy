import { Link, useLocation } from "react-router-dom";
import ConnectWallet from "./ConnectWallet.jsx";
export default function Navbar(){  
  const { pathname } = useLocation();
  return (   
   <header className="navbar">      
   <div className="container spread">       
     <div className="stack">          
      <div className="brand">AKITO DEPLOY</div>          
      <nav className="navlinks">            
        <Link to="/home" style={{opacity: pathname.startsWith("/home") ? 1 : .7}}>Home</Link>            
        <Link to="/GmDeploy" style={{opacity: pathname.startsWith("/GmDeploy") ? 1 : .7}}>GmDeploy</Link>            
        <Link to="/Deploy" style={{opacity: pathname.startsWith("/Deploy") ? 1 : .7}}>Deploy</Link>            


 </nav>        
 </div>       
  <ConnectWallet />      
 </div>    
 </header>  );}