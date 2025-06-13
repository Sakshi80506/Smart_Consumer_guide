import React, { useState } from "react";
import "./Chatbot.css";

const PopupChatbot = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Use environment variable or fallback to localhost for dev
      const API_URL = process.env.REACT_APP_API_URL || "https://consumerbackend.onrender.com";

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, product }),
      });

      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: typeof data.response === "string" ? data.response : JSON.stringify(data.response),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "⚠️ Sorry, something went wrong." },
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="chat-button" onClick={toggleChatbot}>
        <div className="chat-icon">
          {isOpen ? "✕" : "💬"}
        </div>
      </div>

      {/* Chatbot Container */}
      <div className={`chatbot-container ${!isOpen ? 'hidden' : ''}`}>
        <div className="chatbot-header">
          Chat with AI 🤖
        </div>

        <div className="chatbox">
          {messages.length === 0 && (
            <div className="welcome-message">
              👋 How can I help you today?
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text.split("\n").map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          ))}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
          />
          <button className="send-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default PopupChatbot;
