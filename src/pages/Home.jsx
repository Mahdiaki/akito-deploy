import { Link } from "react-router-dom";

export default function Home(){
  return (
    <>
      <h1 className="big">Welcome to Akito site </h1>
      <p className="sub">deploy and GM and Creat token</p>

      <div className="grid cols-2">
        <div className="card">
          <h3>GmDeploy</h3>
          <p className="sub">Gm deploy contract </p>
          <Link className="btn btn-solid" to="/GMDeploy">Gm Deploy</Link>
        </div>
      
        
       
      
        
<div className="card">
          <h3>Deploy</h3>
          <p className="sub">Deploy contract </p>
          <Link className="btn btn-outline" to="/Deploy">Deploy</Link>
</div>

      </div>
    </>
  );
}