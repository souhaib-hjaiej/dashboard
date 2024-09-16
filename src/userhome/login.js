import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        matricule,
        password,
      });
      console.log(response.data  , response.data.token )
      if (response.data && response.data.token) {
        localStorage.setItem("authToken", response.data.token); 
        console.log(localStorage.getItem("authToken"));
        onLogin(); 
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError("Invalid login credentials or server error");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: '300px', padding: '20px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>} 
        <div>
          <label>Matricule</label>
          <input
            type="text"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '10px 0' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#3f51b5', color: '#fff', border: 'none' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
