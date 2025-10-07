"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ChatInterface {
  role: "AI Model" | "Me";
  content?: string;
  documents?: string[];
}

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [isUserThinking, setUserThinking] = useState(true);
  const [messages, setMessages] = useState<ChatInterface[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleAIRunning = () => {
    setUserThinking(false);
  };

  const handleClickChatMessage = async () => {
    setMessages((prev) => [...prev, { role: "Me", content: message }]);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat?message=${message}`);
    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        role: "AI Model",
        content: data?.message,
        documents: data?.docs,
      },
    ]);

    setMessage("");
    setUserThinking(true);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full min-h-full flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 hide-scrollbar">
        {messages.length === 0 ? (
          <div className="w-full  flex flex-col justify-center items-center">
            <Image src="/ai.png" width={150} height={150} alt="" />
            <div className="text-center">
              <h1 className="text-6xl text-center">Understand</h1>
              <h1 className="text-6xl text-center gradient">Anything</h1>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-2 p-2 rounded-md flex flex-col min-w-[200px] w-fit max-w-[500px] ${
                  msg.role === "Me"
                    ? "bg-blue-300 "
                    : "bg-blue-100 "
                }`}
              >
                <p className="text-[12px] font-bold px-1 w-fit bg-white rounded mb-2 text-blue-600 ">
                  {msg.role}
                </p>

                <p>{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat Input */}
      <div className="w-full sticky bottom-0 flex flex-col justify-center items-start gap-2 rounded-t-lg bg-gray-50 border-t border-gray-200 p-4">
        {!isUserThinking && (
          <div className="h-8 px-2 py-1 rounded-2xl text-white bg-blue-500">
            Analysing
          </div>
        )}
        <div className="w-full flex">
          <input
            className="w-full bg-gray-200 rounded-md p-2 border-2 border-gray-300"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Ask your query"
          />
          <button
            className="p-2 ml-2 bg-blue-300 rounded-md border-2 border-blue-400"
            onClick={() => {
              handleClickChatMessage();
              handleAIRunning();
            }}
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};


export default ChatComponent;
