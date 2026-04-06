import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-backend-tqrx.onrender.com"
});

export default API;