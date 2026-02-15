import React, { useState } from "react";

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(text);
    setText("");
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-[#131314] dark:text-gray-100"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        disabled={disabled}
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
