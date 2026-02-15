import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ChatInput from "./chatipt";
import ChatMessage from "./chatmsg";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // --- UNIQUE USER ID LOGIC ---
  const getUserId = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && (storedUser.id || storedUser._id)) {
      return storedUser.id || storedUser._id;
    }

    let browserId = localStorage.getItem("browser_id");
    if (!browserId) {
      browserId = 'user_' + Math.random().toString(36).substring(2, 15) + Date.now();
      localStorage.setItem("browser_id", browserId);
    }
    return browserId;
  };

  const userId = getUserId();
  const API_BASE_URL = "https://gemini-chatbot-backend-999m.onrender.com/api/chat";

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Fetch history specifically for THIS userId
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/${userId}`);
        // Backend data format (role/content) to frontend format
        const formatted = res.data.map(m => ({
          role: m.role,
          content: m.content
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Fetch history error:", err);
      }
    };
    fetchHistory();
  }, [userId]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // Local update for UI
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsTyping(true);

    try {
      const res = await axios.post(API_BASE_URL, {
        message: text,
        userId: userId,
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Oops! Connection error. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#131314] text-white font-sans">
      
      {/* Header */}
      <header className="px-6 py-4 bg-[#1e1f20] border-b border-gray-700 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
          Suraj AI - Bright
        </h1>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Secure Session</span>
          <span className="text-[10px] text-blue-400 font-mono">{userId.substring(0, 12)}</span>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && !isTyping && (
            <div className="flex flex-col items-center justify-center mt-32 space-y-4 opacity-40">
               <div className="text-6xl animate-pulse">✨</div>
               <p className="text-xl font-light italic">How can I help you today?</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}

          {isTyping && (
            <div className="flex items-center space-x-3 text-gray-400 bg-[#1e1f20] w-fit px-5 py-3 rounded-2xl rounded-bl-none shadow-sm">
              <span className="text-xs font-medium">Suraj is thinking</span>
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.8s]"></div>
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:0.8s]"></div>
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:0.8s]"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-[#131314] p-4 pb-8">
        <div className="max-w-3xl mx-auto relative">
          <div className="bg-[#1e1f20] rounded-3xl border border-gray-700 focus-within:border-blue-500/50 transition-all shadow-2xl">
             <ChatInput onSend={handleSend} disabled={isTyping} />
          </div>
          <p className="text-[9px] text-center text-gray-600 mt-4 tracking-tight">
            Suraj AI may display inaccurate info, including about people, so double-check its responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;