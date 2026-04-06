import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({});
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // GET USER DATA
      const res = await API.get(`/auth/profile/${userId}`);
      setUser(res.data);

      // GET INCOME + EXPENSE
      const incomeRes = await API.get(`/income/${userId}`);
      const expenseRes = await API.get(`/expenses/${userId}`);

      const totalIncome = incomeRes.data.reduce((sum, i) => sum + i.amount, 0);
      const totalExpense = expenseRes.data.reduce((sum, e) => sum + e.amount, 0);

      setBalance(totalIncome - totalExpense);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="profile-page">

      {/* 🔙 BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <div className="profile-card">

        <h2>User Profile</h2>

        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Balance Remaining:</strong> ₹{balance}</p>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}