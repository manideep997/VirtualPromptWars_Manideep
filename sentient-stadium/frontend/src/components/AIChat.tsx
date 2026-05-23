"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { Send, Bot, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';

export default function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: "🏟️ Welcome to the Sentient Stadium! I am your real-time AI Concierge, connected directly to our gate sensors and concessions. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const gates = useTelemetryStore((state) => state.gates);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isLoading]);

  const sendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    setChatLog(prev => [...prev, { role: 'user', text: textToSend }]);
    setPrompt("");
    setIsLoading(true);

    try {
      // First try the Next.js serverless route
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          liveTelemetry: gates
        })
      });

      if (!res.ok) {
        throw new Error("Local serverless route failed. Falling back.");
      }

      const data = await res.json();
      setChatLog(prev => [...prev, { role: 'assistant', text: data.text }]);
    } catch (err) {
      // Fallback: try Spring Boot backend
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        const res = await fetch(`${backendUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: textToSend,
            liveTelemetry: gates
          })
        });

        if (!res.ok) throw new Error();
        const data = await res.text();
        setChatLog(prev => [...prev, { role: 'assistant', text: data }]);
      } catch (fallbackErr) {
        // Safe-mode degradation response
        setChatLog(prev => [...prev, { 
          role: 'assistant', 
          text: "⚠️ [Safe-Mode Degradation] My AI neural net is currently offline. Please monitor the 2D Stadium Live Map directly for queue status. Restrooms are located near all main gates, and the First Aid is at Gate A." 
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: "Shortest Queue?", text: "Which gate has the shortest wait time right now? Direct me there." },
    { label: "Bag Size Limits?", text: "Can I bring my large backpack or bag into the stadium?" },
    { label: "Cheeseburger?", text: "Where can I buy a cheeseburger inside the venue?" },
    { label: "VIP Gate Status?", text: "How busy is the VIP Gate currently?" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      {/* Quick Suggestions Board */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Quick AI Telemetry Prompts
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Click any prompt to instantly query the Gemini AI using the active, live stadium sensor measurements:
          </p>

          <div className="space-y-2">
            {quickPrompts.map((p, idx) => (
              <button 
                key={idx}
                onClick={() => sendMessage(p.text)}
                disabled={isLoading}
                className="w-full bg-slate-950/40 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-3 group disabled:opacity-50"
              >
                <span>{p.label}</span>
                <Sparkles className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Context Card */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 mt-6">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Active AI Brain System Context</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs text-emerald-400 font-bold">Synchronized</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
            The AI chatbot combines active crowd metrics with the venue handbook in a single contextual prompt.
          </p>
        </div>
      </div>

      {/* Main Glassmorphic Chat Window */}
      <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-800/80 shadow-2xl flex flex-col h-[500px] justify-between relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -bottom-36 -left-36 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>

        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-950 border border-emerald-500/30 p-2 rounded-xl">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                Stadium AI Concierge
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded">ONLINE</span>
              </h2>
              <p className="text-[10px] text-slate-400">Powered by Gemini 1.5 Flash • Live Sensor Aware</p>
            </div>
          </div>
          <MessageCircle className="w-5 h-5 text-slate-500" />
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {chatLog.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div 
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-br-none shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-3.5 rounded-2xl rounded-bl-none bg-slate-950/60 border border-slate-800 text-slate-400 italic text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-150"></span>
                Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 bg-slate-950/80 border border-slate-850 p-1.5 rounded-xl z-10">
          <input 
            type="text" 
            className="flex-1 bg-transparent text-white rounded-lg px-4 py-2 text-xs focus:outline-none placeholder-slate-500"
            placeholder="Ask about rules, food sections, exit gates or wait times..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
          />
          <button 
            onClick={() => sendMessage()}
            disabled={isLoading || !prompt.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg transition-all disabled:opacity-40 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
