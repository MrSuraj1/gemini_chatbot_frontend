import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ChatInput from "./chatipt";
import ChatMessage from "./chatmsg";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const getUserId = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.id || storedUser?._id) return storedUser.id || storedUser._id;
    let browserId = localStorage.getItem("browser_id") || 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("browser_id", browserId);
    return browserId;
  };

  const userId = getUserId();
  const API_BASE_URL = "https://gemini-chatbot-backend-999m.onrender.com/api/chat";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/${userId}`);
        setMessages(res.data.map(m => ({ role: m.role, content: m.content })));
      } catch (err) { console.error(err); }
    };
    fetchHistory();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsTyping(true);

    try {
      const res = await axios.post(API_BASE_URL, { message: text, userId });
      setMessages((prev) => [...prev, { role: "ai", content: res.data.reply }]);
    } catch (err) {
      // API quota error handle karna
      const errorMsg = err.response?.data?.message || "Oops! Connection error.";
      setMessages((prev) => [...prev, { role: "ai", content: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#131314] text-white">
      <header className="px-6 py-4 bg-[#1e1f20] border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">Suraj AI</h1>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => <ChatMessage key={idx} message={msg} />)}
          {isTyping && <div className="text-gray-400 animate-pulse">Suraj is thinking...</div>}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-[#131314]">
        <div className="max-w-3xl mx-auto bg-[#1e1f20] rounded-3xl border border-gray-700">
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;