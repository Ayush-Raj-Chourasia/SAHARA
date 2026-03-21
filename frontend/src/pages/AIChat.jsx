import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Mic, Bot, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AIChat = ({ onBack, th, G }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, text: `Namaste ${user?.name || ''}! I am SAHARA AI. How can I help you with your health today?`, sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, user_id: user?.id })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, text: data.response, sender: "bot" }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "I'm sorry, I'm having trouble connecting. Try again later.", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white font-['Outfit',sans-serif]">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EA580C] text-white flex items-center justify-center shadow-lg shadow-[#EA580C]/20">
            <Bot size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black">SAHARA AI</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Assistant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-5 rounded-[28px] shadow-sm ${
              m.sender === 'user' 
                ? 'bg-[#111827] text-white rounded-tr-none' 
                : 'bg-white text-[#111827] border border-gray-100 rounded-tl-none'
            }`}>
              {m.sender === 'bot' && <div className="flex items-center gap-2 mb-2 text-[#EA580C] font-black text-xs uppercase tracking-widest"><Sparkles size={12}/> AI Insight</div>}
              <p className="text-lg font-medium leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-100 p-5 rounded-[28px] rounded-tl-none flex gap-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-4 max-w-4xl mx-auto">
          <button type="button" className="p-4 bg-gray-100 rounded-2xl text-gray-500 hover:bg-[#EA580C]/10 hover:text-[#EA580C] transition-all">
            <Mic size={24} />
          </button>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your health..." 
            className="flex-1 px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#EA580C] focus:bg-white rounded-2xl outline-none font-bold text-lg transition-all"
          />
          <button type="submit" disabled={!input.trim()} className="p-4 bg-[#111827] text-white rounded-2xl disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-[#111827]/20">
            <Send size={24} />
          </button>
        </form>
        <p className="text-center text-xs font-bold text-gray-400 mt-4 uppercase tracking-widest">Supports Hindi, Odia & English Voice Inputs</p>
      </div>
    </div>
  );
};

export default AIChat;
