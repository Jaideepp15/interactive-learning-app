import React, { useState, useEffect } from "react";
import { MessageSquare, X } from 'lucide-react';
import Chatbot from "./chatbot";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`mb-4 transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-20 pointer-events-none"
      }`}>
        {isOpen && <Chatbot />}
      </div>

      <button
        onClick={toggleChat}
        className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 ${
          isOpen ? "bg-slate-700 hover:bg-slate-800" : "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6 text-white" />}
      </button>
    </div>
  );
}
