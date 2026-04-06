import { useState } from "react";
import API from "../services/api";
import "../styles/Chatbot.css";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const userId = localStorage.getItem("userId");

  const sendMessage = async () => {
  if (!message.trim()) return;

  const userMsg = { sender: "user", text: message };

  setChat(prev => [...prev, userMsg]);

  try {
    const res = await API.post("/ai/chat", {
      message,
      userId
    });

    const botMsg = {
      sender: "bot",
      text: res.data.reply || "No response"
    };

    setChat(prev => [...prev, botMsg]);

  } catch (err) {
    console.log(err);

    setChat(prev => [
      ...prev,
      { sender: "bot", text: "Error getting response" }
    ]);
  }

  setMessage("");
};

  return (
    <div className="chat-container">

      <div className="chat-box">
        {chat.map((c, i) => (
          <div key={i} className={c.sender}>
            {c.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your finances..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
}