import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Dashboard.css";

import logo from "../assets/images/Logo.jpg";
import profile from "../assets/images/Profile.jpg";
import bot from "../assets/images/Robot.jpg";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PointElement
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  PointElement
);
export default function Dashboard() {
  const navigate = useNavigate();


  const userId = localStorage.getItem("userId");

  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);

  const [incomeForm, setIncomeForm] = useState({});
  const [expenseForm, setExpenseForm] = useState({});



  useEffect(() => {
  const load = async () => {
    await fetchData();
  };
  load();
}, []);

  // 📊 FETCH DATA
  const fetchData = async () => {
    const inc = await API.get(`/income/${userId}`);
    const exp = await API.get(`/expenses/${userId}`);

    setIncome(inc.data);
    setExpenses(exp.data);
  };

  // 💰 TOTALS
  const totalIncome = income.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const balance = totalIncome - totalExpense;

  // 📊 FILTER LOGIC
  const filterData = (data) => {
    return data.filter((item) => {
      const d = new Date(item.date);

      return (
        (!filter.month || d.getMonth() + 1 == filter.month) &&
        (!filter.year || d.getFullYear() == filter.year) &&
        (!filter.date || d.toISOString().split("T")[0] === filter.date)
      );
    });
  };

  const filteredIncome = filterData(income);
  const filteredExpense = filterData(expenses);

  // 📈 LINE CHART
  const lineData = {
    labels: filteredExpense.map(e =>
      new Date(e.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Expenses",
        data: filteredExpense.map(e => e.amount),
        borderColor: "green"
      }
    ]
  };

  // 🥧 PIE CHART
  const categoryData = {};
  filteredExpense.forEach(e => {
    categoryData[e.category] =
      (categoryData[e.category] || 0) + Number(e.amount);
  });

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#ff6384","#36a2eb","#ffce56","#4bc0c0","#9966ff"
        ]
      }
    ]
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <div className="header-left">
          <img src={logo} alt="" />
          <span>    Expenso</span>
        </div>

        <div className="profile-icon">
          <img
            src={profile}
            alt="profile"
            onClick={() => navigate("/profile")}
          />
        </div>
      </div>

      {/* CARDS */}
      <div className="cards">
        <div className="card">
          <h3>Total Income</h3>
          <p>₹{totalIncome}</p>
        </div>

        <div className="card">
          <h3>Total Expense</h3>
          <p>₹{totalExpense}</p>
        </div>

        <div className="card">
          <h3>Balance</h3>
          <p>₹{balance}</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="actions">
        <button onClick={() => setShowIncome(true)}>Add Income</button>
        <button onClick={() => setShowExpense(true)}>Add Expense</button>
      </div>

      {/* CHARTS */}
      <div className="charts">
        <div className="chart-box">
          <Line data={lineData} />
        </div>

        <div className="chart-box">
          <Pie data={pieData} />
        </div>
      </div>

      {/* FILTER + AI */}
      <div className="middle-section">

  {/* FILTER */}
  

  {/* CHATBOT */}
  <div className="chatbot">
    <img src={bot} alt="bot" />

    <h3>Need help? Chat with our bot!</h3>

    <button onClick={() => navigate("/chat")}>
      Chat with AI
    </button>
  </div>

</div>

      {/* INCOME TABLE */}
      <h2>Filtered Income</h2>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Source</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncome.map(i => (
            <tr key={i._id}>
              <td>{i.amount}</td>
              <td>{i.source}</td>
              <td>{new Date(i.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EXPENSE TABLE */}
      <h2>Filtered Expenses</h2>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Payment</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpense.map(e => (
            <tr key={e._id}>
              <td>{e.amount}</td>
              <td>{e.category}</td>
              <td>{e.title}</td>
              <td>{e.payment}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD INCOME MODAL */}
      {showIncome && (
        <div className="modal">
          <div className="modal-box">
            <h2>Add Income</h2>

            <input placeholder="Amount"
              onChange={e=>setIncomeForm({...incomeForm, amount:e.target.value})}
            />

            <input placeholder="Source"
              onChange={e=>setIncomeForm({...incomeForm, source:e.target.value})}
            />

            <input type="date"
              onChange={e=>setIncomeForm({...incomeForm, date:e.target.value})}
            />

            <button onClick={async ()=>{
              await API.post("/income/add",{...incomeForm,userId});
              setShowIncome(false);
              fetchData();
            }}>Add Income</button>

            <button onClick={()=>setShowIncome(false)}>Close</button>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {showExpense && (
        <div className="modal">
          <div className="modal-box">
            <h2>Add Expense</h2>

            <input placeholder="Amount"
              onChange={e=>setExpenseForm({...expenseForm, amount:e.target.value})}
            />

            <select
              onChange={e=>setExpenseForm({...expenseForm, category:e.target.value})}
            >
              <option>Category</option>
              <option>Food</option>
              <option>Shopping</option>
              <option>Travel</option>
            </select>

            <select
              onChange={e=>setExpenseForm({...expenseForm, payment:e.target.value})}
            >
              <option>Payment</option>
              <option>UPI</option>
              <option>Cash</option>
            </select>

            <input placeholder="Description"
              onChange={e=>setExpenseForm({...expenseForm, title:e.target.value})}
            />

            <input type="date"
              onChange={e=>setExpenseForm({...expenseForm, date:e.target.value})}
            />

            <button onClick={async ()=>{
              await API.post("/expenses/add",{...expenseForm,userId});
              setShowExpense(false);
              fetchData();
            }}>Add Expense</button>

            <button onClick={()=>setShowExpense(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}