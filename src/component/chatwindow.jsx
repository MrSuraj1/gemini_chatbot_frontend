import React, { useEffect, useState, useRef } from "react";
import ChatInput from "./chatipt";
import ChatMessage from "./chatmsg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatWindow = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch token and chat history
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      // Show blank 5 sec then redirect
      setTimeout(() => navigate("/login"), 5000);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsTyping(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { message: text, userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, { sender: "ai", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "ai", text: "Connection error" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (!localStorage.getItem("token")) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-[#131314]">
        <p className="text-gray-400 dark:text-gray-500 text-lg">Redirecting to login in 5 seconds...</p>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "dark" : ""} flex flex-col h-screen w-full bg-[#f8fafc] dark:bg-[#131314] transition-colors duration-300`}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-[#1e1f20] border-b dark:border-gray-700 shadow-sm">
        <span className="text-2xl font-bold bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent">Gemini</span>
        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">{darkMode ? "☀️" : "🌙"}</button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto px-4">
        <div className="max-w-3xl mx-auto py-10 space-y-6">
          {messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)}
          {isTyping && (
            <div className="flex items-center space-x-2 text-gray-400 animate-pulse">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full delay-75"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full delay-150"></div>
              <span className="text-xs ml-2 dark:text-gray-500">Gemini is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#1e1f20] rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
        <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 mt-4">
          Gemini may display inaccurate info, double-check responses.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
