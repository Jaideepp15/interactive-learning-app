"use client"

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { marked } from "marked";

interface Message {
  content: string;
  role: "user" | "assistant";
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(
    () => JSON.parse(localStorage.getItem("chatMessages") || "[]")
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{ text: `${input}\n\nRespond as if you are responding to a kid` }],
            }],
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (!data?.candidates?.length) throw new Error("Invalid API response");

      const botMessage: Message = {
        role: "assistant",
        content: data.candidates[0]?.content?.parts?.[0]?.text || "No response available",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "AI service unavailable. Try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="w-full max-w-md h-[500px] shadow-lg border rounded-xl overflow-hidden flex flex-col bg-white">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-4 px-6">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Bot className="h-5 w-5" /> AI Assistant
        </div>
      </div>

      <div className="flex-grow p-0 overflow-hidden">
        <div className="h-[350px] p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center p-6">
              <div className="space-y-2">
                <Bot className="h-12 w-12 mx-auto text-slate-300" />
                <p className="text-slate-500">How can I help you today?</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${message.role === "assistant" ? "bg-slate-700" : "bg-slate-500"}`}
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-4 w-4 text-white" />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg py-2 px-3 ${
                        message.role === "assistant" ? "bg-slate-100" : "bg-slate-700 text-white"
                      }`}
                    >
                      <p>
                        <span
                          className="text-sm whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
                        />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t bg-slate-50">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow rounded-full border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="rounded-full bg-slate-700 hover:bg-slate-800 text-white p-2 w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
