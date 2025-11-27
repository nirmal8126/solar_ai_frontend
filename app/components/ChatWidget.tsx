"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, SendHorizontal } from "lucide-react";
import { API_URL } from "@/lib/api";

export default function ChatWidget() {

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const [conversationStep, setConversationStep] = useState(0);
  const [leadData, setLeadData] = useState({
    name: "",
    address: "",
    property_type: "",
    bill: 0,
    email: "",
    phone: "",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typing]);

  // Auto start conversation
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Hi! I’m Solar AI Assistant ☀️ I can help you calculate solar savings and create a quote.\n\nWhat’s your name?",
        },
      ]);
    }
  }, [open]);

  // ---------------------------------------------------------
  // SAVE LEAD TO BACKEND
  // ---------------------------------------------------------
  const saveLeadToBackend = async (data: any) => {
    setTyping(true);

    try {
      const res = await axios.post(`${API_URL}/leads/`, {
        customer_name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        property_type: data.property_type,
        avg_monthly_bill: Number(data.bill), // ← FIXED
      });


      setTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Your details are saved ✔ Preparing your proposal!",
        },
      ]);
    } catch (err) {
      setTyping(false);
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again!" },
      ]);
    }
  };

  // ---------------------------------------------------------
  // SEND MESSAGE + CONVERSATION FLOW
  // ---------------------------------------------------------
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    let botReply = "";

    // STEP 0 → Ask Name
    if (conversationStep === 0) {
      setLeadData({ ...leadData, name: input });
      botReply = "Great! What is your full address?";
      setConversationStep(1);
    }

    // STEP 1 → Ask Address
    else if (conversationStep === 1) {
      setLeadData({ ...leadData, address: input });
      botReply = "Nice! Is this Residential or Commercial property?";
      setConversationStep(2);
    }

    // STEP 2 → Ask Property Type
    else if (conversationStep === 2) {
      setLeadData({ ...leadData, property_type: input });
      botReply =
        "Got it! What is your average monthly electricity bill (in ₹)?";
      setConversationStep(3);
    }

    // STEP 3 → Ask Bill
    else if (conversationStep === 3) {
      if (isNaN(Number(input))) {
        botReply = "Please enter a valid number (e.g., 2500)";
      } else {
        setLeadData({ ...leadData, bill: Number(input) });
        botReply = "Great! What is your email address?";
        setConversationStep(4);
      }
    }

    // STEP 4 → Ask Email
    else if (conversationStep === 4) {
      if (!input.includes("@")) {
        botReply = "Please enter a valid email.";
      } else {
        setLeadData({ ...leadData, email: input });
        botReply = "Last step! Please share your phone number.";
        setConversationStep(5);
      }
    }

    // STEP 5 → Ask Phone & SAVE LEAD
    else if (conversationStep === 5) {
      if (input.length < 10) {
        botReply = "Please enter a valid phone number.";
      } else {
        const finalLead = { ...leadData, phone: input };
        setLeadData(finalLead);

        botReply = "Thank you! Creating your solar proposal…";
        setConversationStep(6);

        saveLeadToBackend(finalLead);
      }
    }

    setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    setInput("");
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `📎 Sent file: ${file.name}` },
    ]);

    // If you want real file upload:
    // const formData = new FormData();
    // formData.append("file", file);
    // await axios.post("http://127.0.0.1:8000/upload", formData);

    setTyping(true);

    // Bot response
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "File received! We will review it." },
      ]);
    }, 1200);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition"
      >
        <MessageCircle size={30} />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-28 right-6 w-96 bg-white rounded-xl shadow-2xl border overflow-hidden">
          <div className="p-4 bg-blue-600 text-white rounded-t-xl">
            <h2 className="text-xl font-semibold">Solar AI Assistant</h2>
            <p className="text-sm opacity-80">We are here to help 💬</p>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="h-80 p-4 bg-gray-50">
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 animate-fadeIn ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[70%] p-3 rounded-xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white border rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {typing && (
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-white border p-3 rounded-xl text-sm text-gray-500 flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce delay-150">•</span>
                    <span className="animate-bounce delay-300">•</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef}></div>
            </div>
          </ScrollArea>

          {/* Input Row */}
          <div className="p-3 border-t flex items-center gap-2">
            <input
              className="flex-1 p-2 border rounded-lg bg-white"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // ❗ stops double trigger
                  sendMessage(); // send message
                }
              }}
            />

            <button
              onClick={startVoiceRecognition}
              className="bg-gray-200 p-2 rounded-lg text-gray-700 hover:bg-gray-300"
            >
              🎤
            </button>

            <label className="bg-gray-200 p-2 rounded-lg text-gray-700 hover:bg-gray-300 cursor-pointer">
              📎
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload(e)}
              />
            </label>

            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`p-2 rounded-lg ${
                input.trim()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
