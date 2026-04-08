import React, { useState } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

export default function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState<{role: string, text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const gates = useTelemetryStore((state) => state.gates);

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setChatLog(prev => [...prev, { role: 'user', text: userMessage }]);
    setPrompt("");
    setIsLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          liveTelemetry: gates
        })
      });

      const data = await res.text();
      setChatLog(prev => [...prev, { role: 'assistant', text: data }]);
    } catch (err) {
      setChatLog(prev => [...prev, { role: 'assistant', text: "AI offline, routing active. Please check the venue map manually for crowd levels." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 mt-8 flex flex-col h-[400px]">
      <h2 className="text-2xl font-bold text-white mb-4">Stadium AI Concierge</h2>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-slate-900 rounded-lg">
        {chatLog.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-100'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-slate-700 text-slate-400 italic">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Ask about rules, food, or wait times..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
