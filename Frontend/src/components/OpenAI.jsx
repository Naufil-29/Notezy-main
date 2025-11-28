import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button.tsx";
import { Textarea } from "../components/ui/textarea.tsx";
import { Card } from "./ui/card.tsx";
import api from "../lib/api.js";

const ChatBox = ({ onNewNote }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I am Notezy Assistant", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    const userInput = input;
    setInput("");

    try {
      const res = await api.post("/api/chat", { message: userInput });
      const data = res.data;

      setMessages((prev) => [
        ...prev,
        { text: data.reply, sender: "bot" }
      ]);

      if (data.note) onNewNote();
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
<div className="chatbox border-x-2 w-[400px] p-4 flex flex-col h-screen pt-20 bg-base-200">


      {/* CHAT MESSAGES SECTION */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-hide">
        {messages.map((msg, index) => (
          <Card
            key={index}
            className={`max-w-[70%] px-4 py-2 rounded-2xl shadow
              ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-gray-900 mr-auto"
              }
            `}
          >
            {msg.text}
          </Card>
        ))}

        {/* SCROLL TARGET */}
        <div ref={messagesEndRef} />
      </div>

      <div className=" bg-transparent backdrop-blur-md rounded-xl">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask what can I help..."
          className="flex-1 h-[90px] bg-transparent "
        />
        <Button onClick={handleSend} className="mt-2">
          Send
        </Button>
      </div>

    </div>
  );
};

export default ChatBox;


