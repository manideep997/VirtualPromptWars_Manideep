"use client";

import React, { useState, useEffect } from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { Play, Pause, AlertTriangle, Shield, CheckCircle, Zap } from 'lucide-react';

export default function StadiumMap() {
  const gates = useTelemetryStore((state) => state.gates);
  const updateGate = useTelemetryStore((state) => state.updateGate);

  const isSimulating = useTelemetryStore((state) => state.isSimulating);
  const setIsSimulating = useTelemetryStore((state) => state.setIsSimulating);
  const simulationMode = useTelemetryStore((state) => state.simulationMode);
  const setSimulationMode = useTelemetryStore((state) => state.setSimulationMode);
  const [activeGateHover, setActiveGateHover] = useState<string | null>(null);

  // Local simulation engine - runs when WebSocket is not pushing or by choice
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const gateIds = ["Gate A", "Gate B", "Gate C", "Gate VIP"];
      
      gateIds.forEach(gateId => {
        let baseWait = 2;
        let baseCrowd = 8;
        let multiplier = 1;

        if (simulationMode === 'halftime') {
          multiplier = 5;
        } else if (simulationMode === 'evac') {
          multiplier = 8;
        }

        // Random walk simulation
        const currentData = gates[gateId];
        const prevWait = currentData ? currentData.waitTimeMinutes : baseWait;
        const prevCrowd = currentData ? currentData.crowdDelta : baseCrowd;

        let rawWait = prevWait + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2);
        let rawCrowd = prevCrowd + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4);

        // Clamp values
        const minWait = simulationMode === 'normal' ? 1 : 12;
        const maxWait = simulationMode === 'normal' ? 8 : 45;
        const minCrowd = simulationMode === 'normal' ? 3 : 25;
        const maxCrowd = simulationMode === 'normal' ? 15 : 120;

        let waitTime = Math.max(minWait, Math.min(maxWait, Math.round(rawWait * multiplier)));
        let crowdDelta = Math.max(minCrowd, Math.min(maxCrowd, Math.round(rawCrowd * multiplier)));

        // Handle specific behaviors for evac
        if (simulationMode === 'evac') {
          if (gateId === 'Gate VIP') {
            // VIP is bottlenecked
            waitTime = Math.round(35 + Math.random() * 10);
            crowdDelta = Math.round(95 + Math.random() * 15);
          } else {
            waitTime = Math.round(20 + Math.random() * 8);
            crowdDelta = Math.round(70 + Math.random() * 20);
          }
        }

        updateGate({
          gateId,
          waitTimeMinutes: waitTime,
          crowdDelta
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, simulationMode, updateGate]);

  const getGateStatus = (gateId: string) => {
    const data = gates[gateId];
    if (!data) return { color: '#10B981', label: 'Normal', glow: 'shadow-emerald-500/50' };
    
    if (data.waitTimeMinutes > 15 || data.crowdDelta > 30) {
      return { color: '#EF4444', label: 'Danger Zone / Overcrowded', glow: 'shadow-rose-500/50' };
    }
    if (data.waitTimeMinutes > 5 || data.crowdDelta > 15) {
      return { color: '#F59E0B', label: 'Warning / High Influx', glow: 'shadow-amber-500/50' };
    }
    return { color: '#10B981', label: 'Normal / Smooth flow', glow: 'shadow-emerald-500/50' };
  };

  const getGateDetails = (gateId: string) => {
    return gates[gateId] || { gateId, waitTimeMinutes: 0, crowdDelta: 0 };
  };

  // Calculate live aggregate statistics
  const gateList = Object.values(gates);
  const totalCrowd = gateList.reduce((sum, g) => sum + g.crowdDelta, 0);
  const avgWait = gateList.length > 0 ? Math.round(gateList.reduce((sum, g) => sum + g.waitTimeMinutes, 0) / gateList.length) : 0;
  
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      {/* Visual Stadium Map Area */}
      <div className="lg:col-span-2 bg-slate-900/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.55)] relative overflow-hidden flex flex-col justify-between hover:border-white/[0.08] transition-all duration-500">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Live 3D-Isometric Arena Visualizer
              </h2>
              <p className="text-xs text-slate-400">Interactive telemetry sync & sensor node aggregation</p>
            </div>
            
            {/* Live Indicator */}
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className={`w-2.5 h-2.5 rounded-full bg-emerald-400 ${isSimulating ? 'animate-ping' : ''}`}></span>
              <span className="text-xs font-bold text-emerald-400 tracking-wider">LIVE TELEMETRY</span>
            </div>
          </div>

          {/* SVG 3D Stadium map */}
          <div className="relative bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center justify-center min-h-[360px] shadow-inner">
            <svg viewBox="0 0 800 500" className="w-full h-auto max-w-[650px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <defs>
                {/* Field Gradient */}
                <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#15803d" />
                  <stop offset="100%" stopColor="#166534" />
                </radialGradient>
                {/* Outer Ring Gradient */}
                <linearGradient id="standsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                {/* Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* ISOMETRIC BASE AND OUTER STRUCTURE */}
              {/* Outer Shadow Ring */}
              <ellipse cx="400" cy="270" rx="360" ry="180" fill="rgba(0, 0, 0, 0.6)" filter="url(#glow)" />
              
              {/* Outer Concrete Wall */}
              <ellipse cx="400" cy="260" rx="340" ry="165" fill="#334155" stroke="#475569" strokeWidth="3" />
              <ellipse cx="400" cy="265" rx="340" ry="165" fill="none" stroke="#64748b" strokeWidth="1" />

              {/* Seating Stands Layer 2 (Outer Tier) */}
              <ellipse cx="400" cy="255" rx="310" ry="145" fill="url(#standsGrad)" stroke="#1e293b" strokeWidth="4" />
              <ellipse cx="400" cy="255" rx="280" ry="130" fill="#0f172a" stroke="#334155" strokeWidth="2" />

              {/* Seating Stands Layer 1 (Inner Tier) */}
              <ellipse cx="400" cy="255" rx="250" ry="112" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
              
              {/* Glowing Field Border */}
              <ellipse cx="400" cy="255" rx="210" ry="92" fill="none" stroke="#22c55e" strokeWidth="2" filter="url(#glow)" opacity="0.6"/>

              {/* The Football Pitch (Isometric field) */}
              <ellipse cx="400" cy="255" rx="200" ry="86" fill="url(#fieldGrad)" stroke="#4ade80" strokeWidth="3" />

              {/* Field Markings */}
              <ellipse cx="400" cy="255" rx="40" ry="18" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <line x1="400" y1="169" x2="400" y2="341" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              
              {/* Goal Boxes */}
              <path d="M 210,240 Q 220,255 210,270" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <path d="M 590,240 Q 580,255 590,270" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

              {/* DETAILED INTERACTIVE GATE NODES */}
              
              {/* Gate VIP (Top Entrance) */}
              <g 
                transform="translate(400, 75)" 
                className="cursor-pointer"
                onMouseEnter={() => setActiveGateHover("Gate VIP")}
                onMouseLeave={() => setActiveGateHover(null)}
              >
                {/* Pulse Ring */}
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="none" stroke={getGateStatus("Gate VIP").color} strokeWidth="2" className="animate-pulse" filter="url(#glow)"/>
                {/* Gate Body */}
                <ellipse cx="0" cy="0" rx="20" ry="10" fill={getGateStatus("Gate VIP").color} stroke="#1e293b" strokeWidth="2" />
                <ellipse cx="0" cy="-3" rx="14" ry="7" fill="#0f172a" />
                <text x="0" y="3" textAnchor="middle" fill="white" fontWeight="black" fontSize="9" letterSpacing="1">VIP</text>
              </g>

              {/* Gate A (West Entrance) */}
              <g 
                transform="translate(100, 255)" 
                className="cursor-pointer"
                onMouseEnter={() => setActiveGateHover("Gate A")}
                onMouseLeave={() => setActiveGateHover(null)}
              >
                {/* Pulse Ring */}
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="none" stroke={getGateStatus("Gate A").color} strokeWidth="2" className="animate-pulse" filter="url(#glow)"/>
                <ellipse cx="0" cy="0" rx="20" ry="10" fill={getGateStatus("Gate A").color} stroke="#1e293b" strokeWidth="2" />
                <ellipse cx="0" cy="-3" rx="14" ry="7" fill="#0f172a" />
                <text x="0" y="3" textAnchor="middle" fill="white" fontWeight="black" fontSize="10">A</text>
              </g>

              {/* Gate B (South Entrance) */}
              <g 
                transform="translate(400, 425)" 
                className="cursor-pointer"
                onMouseEnter={() => setActiveGateHover("Gate B")}
                onMouseLeave={() => setActiveGateHover(null)}
              >
                {/* Pulse Ring */}
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="none" stroke={getGateStatus("Gate B").color} strokeWidth="2" className="animate-pulse" filter="url(#glow)"/>
                <ellipse cx="0" cy="0" rx="20" ry="10" fill={getGateStatus("Gate B").color} stroke="#1e293b" strokeWidth="2" />
                <ellipse cx="0" cy="-3" rx="14" ry="7" fill="#0f172a" />
                <text x="0" y="3" textAnchor="middle" fill="white" fontWeight="black" fontSize="10">B</text>
              </g>

              {/* Gate C (East Entrance) */}
              <g 
                transform="translate(700, 255)" 
                className="cursor-pointer"
                onMouseEnter={() => setActiveGateHover("Gate C")}
                onMouseLeave={() => setActiveGateHover(null)}
              >
                {/* Pulse Ring */}
                <ellipse cx="0" cy="0" rx="30" ry="15" fill="none" stroke={getGateStatus("Gate C").color} strokeWidth="2" className="animate-pulse" filter="url(#glow)"/>
                <ellipse cx="0" cy="0" rx="20" ry="10" fill={getGateStatus("Gate C").color} stroke="#1e293b" strokeWidth="2" />
                <ellipse cx="0" cy="-3" rx="14" ry="7" fill="#0f172a" />
                <text x="0" y="3" textAnchor="middle" fill="white" fontWeight="black" fontSize="10">C</text>
              </g>
            </svg>

            {/* Hover Tooltip Overlay */}
            {activeGateHover && (
              <div 
                className="absolute bg-slate-950/90 backdrop-blur-3xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] max-w-xs transition-all duration-300 transform scale-100 z-30"
                style={{
                  top: activeGateHover === 'Gate VIP' ? '15%' : activeGateHover === 'Gate B' ? '65%' : '40%',
                  left: activeGateHover === 'Gate A' ? '18%' : activeGateHover === 'Gate C' ? '50%' : '35%'
                }}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="font-extrabold text-white text-sm">{activeGateHover}</span>
                  <span 
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: getGateStatus(activeGateHover).color + '20',
                      color: getGateStatus(activeGateHover).color,
                      border: `1px solid ${getGateStatus(activeGateHover).color}30`
                    }}
                  >
                    {getGateStatus(activeGateHover).label.split('/')[0]}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                    <p className="text-slate-400 text-[10px]">Queue Wait</p>
                    <p className="text-white font-black text-sm mt-0.5">{getGateDetails(activeGateHover).waitTimeMinutes} mins</p>
                  </div>
                  <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                    <p className="text-slate-400 text-[10px]">Crowd Delta</p>
                    <p className="text-white font-black text-sm mt-0.5">+{getGateDetails(activeGateHover).crowdDelta} / min</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 animate-pulse"></span>
            <span className="text-slate-300">Normal (&lt;5m wait)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30 animate-pulse"></span>
            <span className="text-slate-300">Warning (5-15m wait)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30 animate-pulse"></span>
            <span className="text-slate-300">Overcrowded (&gt;15m wait)</span>
          </div>
        </div>
      </div>

      {/* Control Panel Area */}
      <div className="bg-slate-900/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.55)] flex flex-col justify-between hover:border-white/[0.08] transition-all duration-500">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Telemetry Control Center
          </h2>
          <p className="text-xs text-slate-400 mb-4">Manipulate simulated IoT sensors and trigger venue incidents</p>

          {/* Aggregate Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 shadow-inner">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Venue Inflow</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-100">{totalCrowd}</span>
                <span className="text-[10px] text-emerald-400">/min</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 shadow-inner">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Avg Wait Time</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-amber-400">{avgWait}</span>
                <span className="text-[10px] text-amber-400">mins</span>
              </div>
            </div>
          </div>

          {/* Simulation Toggle */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-slate-300">Local Sensor Loop</span>
              <button 
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  isSimulating 
                  ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40' 
                  : 'bg-rose-950/80 border-rose-500/30 text-rose-400 hover:bg-rose-900/40'
                }`}
              >
                {isSimulating ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    PAUSE LOOP
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 animate-pulse" />
                    RESUME LOOP
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isSimulating 
                ? 'Generating real-time synthetic data with a moving average filter. Updates sent every 2 seconds.' 
                : 'Sensor telemetry is frozen. Slide gate values manually or resume loop to animate.'
              }
            </p>
          </div>

          {/* Venue Incidents / Mode triggers */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-slate-300 block mb-1">Select Incident/Scenario Mode</span>
            
            {/* Normal mode */}
            <button 
              onClick={() => { setSimulationMode('normal'); setIsSimulating(true); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                simulationMode === 'normal' 
                ? 'bg-slate-950 border-emerald-500/60 text-slate-100 shadow-lg shadow-emerald-500/5' 
                : 'bg-slate-950/20 border-slate-800 hover:bg-slate-950/40 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-4 h-4 ${simulationMode === 'normal' ? 'text-emerald-400' : 'text-slate-600'}`} />
                <div>
                  <p className="text-xs font-extrabold">Normal Operations</p>
                  <p className="text-[10px] text-slate-500">Wait times average &lt; 5 mins</p>
                </div>
              </div>
              <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">ACTIVE</span>
            </button>

            {/* Halftime rush */}
            <button 
              onClick={() => { setSimulationMode('halftime'); setIsSimulating(true); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                simulationMode === 'halftime' 
                ? 'bg-slate-950 border-amber-500/60 text-slate-100 shadow-lg shadow-amber-500/5' 
                : 'bg-slate-950/20 border-slate-800 hover:bg-slate-950/40 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className={`w-4 h-4 ${simulationMode === 'halftime' ? 'text-amber-400' : 'text-slate-600'}`} />
                <div>
                  <p className="text-xs font-extrabold text-slate-200">Halftime Rush Hour</p>
                  <p className="text-[10px] text-slate-500">Crowd multiplies by 5x instantly</p>
                </div>
              </div>
              {simulationMode === 'halftime' && (
                <span className="text-[9px] font-bold bg-amber-950 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded">INCIDENT</span>
              )}
            </button>

            {/* Evacuation emergency */}
            <button 
              onClick={() => { setSimulationMode('evac'); setIsSimulating(true); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                simulationMode === 'evac' 
                ? 'bg-slate-950 border-rose-500/60 text-slate-100 shadow-lg shadow-rose-500/5' 
                : 'bg-slate-950/20 border-slate-800 hover:bg-slate-950/40 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-4 h-4 ${simulationMode === 'evac' ? 'text-rose-500' : 'text-slate-600'}`} />
                <div>
                  <p className="text-xs font-extrabold text-slate-200">Emergency Evacuation</p>
                  <p className="text-[10px] text-slate-500">Critical bottlenecking at VIP Gate</p>
                </div>
              </div>
              {simulationMode === 'evac' && (
                <span className="text-[9px] font-bold bg-rose-950 border border-rose-500/30 text-rose-400 px-2 py-0.5 rounded animate-pulse">CRITICAL</span>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Warning Alert banner */}
        {simulationMode !== 'normal' && (
          <div className={`mt-6 p-3 rounded-xl border flex gap-3 items-start animate-pulse ${
            simulationMode === 'evac' 
            ? 'bg-rose-950/40 border-rose-500/30 text-rose-200' 
            : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
          }`}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <div>
              <h4 className="text-xs font-black uppercase">INCIDENT IN PROGRESS</h4>
              <p className="text-[10px] leading-relaxed mt-0.5 opacity-90">
                {simulationMode === 'evac' 
                  ? 'VIP Exit Bottleneck detected. System advises evacuees to immediately route to Gate A or B.'
                  : 'Crowd traffic surge. AI Concierge is actively advising fans to wait in seats or seek lower traffic gates.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
