"use client";

import { useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let aiContent = "";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, aiMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        aiContent += text;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessage.id ? { ...m, content: aiContent } : m
          )
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "抱歉，发生了错误。请稍后再试。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">AI Chat (Gemini)</h1>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-lg ${
                m.role === "user"
                  ? "bg-blue-100 dark:bg-blue-900 ml-auto max-w-[80%]"
                  : "bg-gray-100 dark:bg-gray-800 mr-auto max-w-[80%]"
              }`}
            >
              <div className="font-bold mb-1">
                {m.role === "user" ? "👤 User" : "🤖 AI"}
              </div>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">
            开始一段新的对话吧...
          </div>
        )}
        {isLoading && (
          <div className="text-center text-gray-400">AI 正在思考...</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
          placeholder="说点什么..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </form>
    </div>
  );
}
