// src/components/ChatInput.jsx
import React, { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex p-2 border-t">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleEnter}
        placeholder="Type a message..."
        className="flex-grow p-2 border rounded-l-lg outline-none"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
