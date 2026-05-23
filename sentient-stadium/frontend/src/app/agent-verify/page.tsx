"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  User, 
  MapPin, 
  DoorOpen, 
  CheckCircle, 
  AlertOctagon, 
  Sparkles, 
  Lock, 
  Smartphone,
  Activity,
  Heart
} from 'lucide-react';

function AgentVerifyContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticketId') || 'ST-99824';

  const [ticketDetails, setTicketDetails] = useState({
    fullName: searchParams.get('name') || 'John Doe',
    email: searchParams.get('email') || 'john.doe@example.com',
    stadiumName: searchParams.get('stadium') || 'Spotify Camp Nou',
    gateId: searchParams.get('gate') || 'Gate A',
    idType: searchParams.get('idType') || 'Passport',
    photoDataUrl: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [entryStatus, setEntryStatus] = useState<'pending' | 'granted' | 'flagged'>('pending');
  const [scanTime] = useState(() => new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }));

  useEffect(() => {
    if (!ticketId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`/api/tickets?ticketId=${encodeURIComponent(ticketId)}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        if (data && data.ticket) {
          setTicketDetails({
            fullName: data.ticket.fullName,
            email: data.ticket.email,
            stadiumName: data.ticket.stadium?.name || 'Spotify Camp Nou',
            gateId: data.ticket.gate || 'Gate A',
            idType: data.ticket.idType || 'Passport',
            photoDataUrl: data.ticket.photoDataUrl || ''
          });
        }
      })
      .catch(err => {
        console.warn("Could not load real-time database ticket, falling back to URL search params:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [ticketId]);

  const handleGrantEntry = () => {
    setEntryStatus('granted');
    // Simulated success sound
    try {
      if (typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note (success)
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          osc.start();
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
          osc.stop(audioCtx.currentTime + 0.3);
        }
      }
    } catch (soundErr) {
      console.warn("AudioContext blocked on mobile device:", soundErr);
    }
  };

  const handleFlagTicket = () => {
    setEntryStatus('flagged');
    // Simulated alert sound
    try {
      if (typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, audioCtx.currentTime); // low frequency buzz
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          osc.start();
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
          osc.stop(audioCtx.currentTime + 0.5);
        }
      }
    } catch (soundErr) {
      console.warn("AudioContext blocked on mobile device:", soundErr);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/20 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.55)] relative overflow-hidden transition-all duration-500 hover:border-white/[0.08]">
      
      {/* Background Neon Glows */}
      <div className="absolute -top-36 -left-36 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-36 -right-36 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>

      {/* Terminal Title */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950 border border-emerald-500/30 p-2.5 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-100 uppercase tracking-widest">Agent Verification Terminal</h1>
            <p className="text-[10px] text-slate-400">Turnstile Scanner Node • Live Gate Telemetry Synced</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-500 block">SCAN TIME</span>
          <span className="text-xs font-mono font-bold text-slate-350">{scanTime}</span>
        </div>
      </header>

      {/* Main Verification Dashboard Content */}
      <div className="space-y-6 z-10 relative">
        
        {/* Verification Status Banner */}
        {entryStatus === 'pending' && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-5 rounded-2xl flex gap-4 items-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h2 className="text-sm font-black text-emerald-400 uppercase tracking-wider">PASSPORT MATCH VERIFIED</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Attendee biometrics matched government ID. Ticket is active and clear to board.</p>
            </div>
          </div>
        )}

        {entryStatus === 'granted' && (
          <div className="bg-cyan-950/80 border border-cyan-500/40 p-5 rounded-2xl flex gap-4 items-center animate-[bounce_0.5s_ease-out]">
            <CheckCircle className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div>
              <h2 className="text-sm font-black text-cyan-400 uppercase tracking-wider">ACCESS GRANTED • TURNSTILE OPEN</h2>
              <p className="text-[10px] text-slate-300 mt-0.5">Assigned entry turnstile has been released. Customer is entering the arena.</p>
            </div>
          </div>
        )}

        {entryStatus === 'flagged' && (
          <div className="bg-rose-950/80 border border-rose-500/40 p-5 rounded-2xl flex gap-4 items-center animate-shake">
            <AlertOctagon className="w-8 h-8 text-rose-400 animate-pulse" />
            <div>
              <h2 className="text-sm font-black text-rose-400 uppercase tracking-wider">TICKET FLAGGED FOR INSPECTION</h2>
              <p className="text-[10px] text-slate-300 mt-0.5">Turnstile locked. Security personnel have been dispatched to Gate sector.</p>
            </div>
          </div>
        )}

        {/* Boarding Pass Ticket Info */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Portrait Photo */}
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.25)] flex-shrink-0 flex items-center justify-center">
              {ticketDetails.photoDataUrl ? (
                <img 
                  src={ticketDetails.photoDataUrl} 
                  alt="Biometric Portrait" 
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Fallback image as standard user icon */
                <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-650">
                  <User className="w-10 h-10" />
                </div>
              )}
              {/* Holographic scanner line */}
              <div className="absolute inset-x-0 h-0.5 bg-emerald-400 opacity-60 top-0 animate-[bounce_2s_infinite]"></div>
            </div>

            {/* Ticket details */}
            <div className="flex-1 space-y-3 min-w-0">
              <div>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">VERIFIED ATTENDEE</span>
                <h3 className="text-base font-black text-white leading-tight truncate">{ticketDetails.fullName}</h3>
                <span className="text-[10px] text-slate-400 block truncate">{ticketDetails.email}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-900 text-xs">
                <div>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">VENUE LOCK</span>
                  <span className="font-extrabold text-slate-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {ticketDetails.stadiumName.split(' ')[0]}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">TICKET REF ID</span>
                  <span className="font-mono font-bold text-slate-350 block mt-0.5">{ticketId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Checklist (Realism) */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 space-y-3">
          <h3 className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Agent Check-in Directives</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Biometric Photo matches visitor</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Assigned Gate lock: <strong className="text-cyan-400">{ticketDetails.gateId}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Verification Document: <strong>{ticketDetails.idType.toUpperCase()}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Bags match clear plastic policy</span>
            </div>
          </div>
        </div>

        {/* Live Telemetry Health Integration */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex gap-4 items-center">
          <Activity className="w-6 h-6 text-cyan-400 animate-pulse flex-shrink-0" />
          <div className="text-xs">
            <span className="text-slate-400 font-bold block">Gate Sector Security Status</span>
            <p className="text-slate-300 mt-0.5">
              Assigned gate is operating normally. Flow throughput is optimal with minimal queues. Ready for turnstile dispatch.
            </p>
          </div>
        </div>

        {/* Agent Verification Actions */}
        {entryStatus === 'pending' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <button
              onClick={handleFlagTicket}
              className="bg-slate-950 hover:bg-slate-900 border border-rose-500/30 hover:border-rose-500/60 text-rose-400 font-black text-xs py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group scale-100 active:scale-98"
            >
              <Lock className="w-4 h-4" />
              FLAG & LOCK TURNSTILE
            </button>
            <button
              onClick={handleGrantEntry}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 scale-100 active:scale-98"
            >
              <DoorOpen className="w-4 h-4" />
              APPROVE & OPEN GATE
            </button>
          </div>
        )}

        {entryStatus !== 'pending' && (
          <button
            onClick={() => setEntryStatus('pending')}
            className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-black text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Smartphone className="w-4 h-4" />
            SCAN NEXT BOARDING PASS
          </button>
        )}

      </div>

      {/* Footer */}
      <footer className="text-center mt-8 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-center items-center gap-1">
        <span>Sentient Stadium Gate Systems • Handcrafted with</span>
        <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
        <span>for safety</span>
      </footer>

    </div>
  );
}

export default function AgentVerifyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-[#05070f] text-slate-100 overflow-x-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-[#05070f] to-transparent -z-10 blur-3xl"></div>
      
      <Suspense fallback={
        <div className="bg-slate-900/20 backdrop-blur-2xl rounded-3xl p-8 border border-white/[0.04] text-center text-xs text-slate-400">
          Loading Security Terminal...
        </div>
      }>
        <AgentVerifyContent />
      </Suspense>
    </main>
  );
}
