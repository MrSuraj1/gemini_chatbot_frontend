import React from "react";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
