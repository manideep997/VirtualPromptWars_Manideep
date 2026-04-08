"use client";

import React, { useEffect } from 'react';
import StadiumMap from '../components/StadiumMap';
import AIChat from '../components/AIChat';
import { connectWebSocket, disconnectWebSocket } from '../lib/socket';

export default function Home() {
  
  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 lg:p-24 bg-slate-900 border-t-4 border-emerald-500">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 text-center drop-shadow-sm">
          Sentient Stadium
        </h1>
        <p className="text-slate-300 text-lg text-center max-w-2xl">
          Live physical event experience dashboard. Monitoring real-time crowd deltas and gate wait times across the venue.
        </p>
        
        <StadiumMap />
        <AIChat />
      </div>
    </main>
  );
}
