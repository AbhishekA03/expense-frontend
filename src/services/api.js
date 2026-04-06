import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-backend-1-71i8.onrender.com"
});

export default API;