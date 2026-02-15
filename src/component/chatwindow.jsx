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
    // 1. Pehle dekho login user hai kya?
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && (storedUser.id || storedUser._id)) {
      return storedUser.id || storedUser._id;
    }

    // 2. Agar login nahi hai, to browser ka unique ID check karo
    let browserId = localStorage.getItem("browser_id");
    if (!browserId) {
      // Naya unique ID generate karo (Laptop specific)
      browserId = 'user_' + Math.random().toString(36).substring(2, 15) + Date.now();
      localStorage.setItem("browser_id", browserId);
    }
    return browserId;
  };

  const userId = getUserId(); 

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Fetch history specifically for THIS userId
  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `https://gemini-chatbot-backend-999m.onrender.com/api/chat/${userId}`
        );
        // Ensure data is mapped correctly if backend uses role/content
        setMessages(res.data);
      } catch (err) {
        console.error("Fetch history error:", err);
      }
    };
    fetchHistory();
  }, [userId]); // Jab userId badle (login/logout), tab re-fetch ho

  const handleSend = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: text,
        userId: userId, // Bhejo unique ID
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Oops! Connection error." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#131314] text-white font-sans">
      
      {/* Header with User Info */}
      <header className="px-6 py-4 bg-[#1e1f20] border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Suraj AI - bright
        </h1>
        <div className="text-[10px] text-gray-500">
          Session ID: {userId.substring(0, 8)}...
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && !isTyping && (
            <div className="flex flex-col items-center justify-center mt-20 opacity-50">
               <div className="text-4xl mb-4">✨</div>
               <p className="text-xl">How can I help you today?</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-gray-400 animate-pulse bg-[#1e1f20] w-fit px-4 py-2 rounded-full">
              <span className="text-xs">Suraj is thinking</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-[#131314] p-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isTyping} />
          <p className="text-[10px] text-center text-gray-600 mt-4">
            Personalized session for {userId.substring(0, 10)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;