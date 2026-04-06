import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Signup.css";


export default function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!data.name || !data.email || !data.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/auth/signup", data);

      alert("Signup successful ✅");

      // 👉 Redirect to login page
      navigate("/");

    } catch (err) {
      alert("Signup failed ❌");
    }
  };

  return (
    <div className="login-page">
    <div className="login-container">
      <h2>Signup</h2>

      <input
        placeholder="Name"
        value={data.name}
        onChange={(e) =>
          setData({ ...data, name: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={data.email}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) =>
          setData({ ...data, password: e.target.value })
        }
      />

      <button onClick={handleSignup}>Signup</button>

      <p onClick={() => navigate("/")}>
        Already have an account? Login
      </p>
    </div>
    </div>
  );
}