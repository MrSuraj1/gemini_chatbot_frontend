// src/components/ChatMessage.jsx
import React from "react";

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[70%] p-3 rounded-xl ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
