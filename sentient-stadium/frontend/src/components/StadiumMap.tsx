"use client";

import React, { useState, useEffect } from 'react';
import { useTelemetryStore, STADIUMS } from '../store/useTelemetryStore';
import { Play, Pause, AlertTriangle, Shield, CheckCircle, Zap, MapPin, Activity } from 'lucide-react';

export default function StadiumMap() {
  const gates = useTelemetryStore((state) => state.gates);
  const updateGate = useTelemetryStore((state) => state.updateGate);

  // Zustand selectors for famous stadiums
  const selectedStadium = useTelemetryStore((state) => state.selectedStadium);
  const setSelectedStadium = useTelemetryStore((state) => state.setSelectedStadium);

  const isSimulating = useTelemetryStore((state) => state.isSimulating);
  const setIsSimulating = useTelemetryStore((state) => state.setIsSimulating);
  const simulationMode = useTelemetryStore((state) => state.simulationMode);
  const setSimulationMode = useTelemetryStore((state) => state.setSimulationMode);
  const [activeGateHover, setActiveGateHover] = useState<string | null>(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'photo' | 'schematic'>('photo');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Cap rotation at 6 degrees max for premium realistic feel
    const rotateX = -(y / (box.height / 2)) * 6;
    const rotateY = (x / (box.width / 2)) * 6;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

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

  const getTooltipCoords = () => {
    if (!activeGateHover) return { top: '50%', left: '50%' };
    
    if (viewMode === 'photo') {
      if (activeGateHover === 'Player Tunnel') {
        return {
          top: `calc(${selectedStadium.pinPositions.tunnel.top} - 10px)`,
          left: `calc(${selectedStadium.pinPositions.tunnel.left} + 20px)`
        };
      }
      if (activeGateHover === 'First Aid') {
        return {
          top: `calc(${selectedStadium.pinPositions.firstAid.top} - 10px)`,
          left: `calc(${selectedStadium.pinPositions.firstAid.left} + 20px)`
        };
      }
      if (activeGateHover === 'Concessions') {
        return {
          top: `calc(${selectedStadium.pinPositions.concessions.top} - 10px)`,
          left: `calc(${selectedStadium.pinPositions.concessions.left} - 240px)`
        };
      }
      
      const gateKey = activeGateHover === 'Gate VIP' ? 'gateVip' : 
                      activeGateHover === 'Gate A' ? 'gateA' : 
                      activeGateHover === 'Gate B' ? 'gateB' : 'gateC';
      const pos = selectedStadium.pinPositions[gateKey];
      const leftVal = parseFloat(pos.left);
      const leftOffset = leftVal > 60 ? '-240px' : '20px';
      
      return {
        top: `calc(${pos.top} - 60px)`,
        left: `calc(${pos.left} + ${leftOffset})`
      };
    }

    return {
      top: activeGateHover === 'Gate VIP' ? '15%' : activeGateHover === 'Gate B' ? '65%' : activeGateHover === 'Player Tunnel' ? '48%' : '40%',
      left: activeGateHover === 'Gate A' ? '18%' : activeGateHover === 'Gate C' ? '50%' : activeGateHover === 'Player Tunnel' ? '35%' : '35%'
    };
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      
      {/* Visual Stadium Map Area */}
      <div className="lg:col-span-2 bg-slate-900/20 backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.55)] relative overflow-hidden flex flex-col justify-between hover:border-white/[0.08] transition-all duration-500">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div>
          {/* Header area with active stadium details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
                <Shield className="w-6 h-6 text-emerald-400 animate-pulse" />
                {selectedStadium.name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {selectedStadium.location} • Home of <strong className="text-slate-200 ml-1">{selectedStadium.homeTeam}</strong>
              </p>
            </div>
            
            {/* View Mode & Live Indicators */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1 shadow-lg">
                <button
                  onClick={() => setViewMode('photo')}
                  className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg transition-all ${
                    viewMode === 'photo'
                      ? 'bg-slate-850 text-emerald-400 border border-slate-700/50 shadow-md scale-102 font-black'
                      : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  LIVE PHOTO
                </button>
                <button
                  onClick={() => setViewMode('schematic')}
                  className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg transition-all ${
                    viewMode === 'schematic'
                      ? 'bg-slate-850 text-cyan-400 border border-slate-700/50 shadow-md scale-102 font-black'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  3D SCHEMATIC
                </button>
              </div>

              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-lg">
                <span className={`w-2.5 h-2.5 rounded-full bg-emerald-400 ${isSimulating ? 'animate-ping' : ''}`}></span>
                <span className="text-[10px] font-black text-emerald-400 tracking-wider">LIVE FEED</span>
              </div>
            </div>
          </div>

          {/* Stadium Location Selector bar */}
          <div className="flex flex-wrap items-center gap-2 mb-4 bg-slate-950/50 p-2 rounded-2xl border border-white/[0.02]">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 px-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Arena Location:
            </span>
            {STADIUMS.map((stadium) => (
              <button
                key={stadium.id}
                onClick={() => setSelectedStadium(stadium)}
                className={`text-[11px] font-extrabold px-3 py-1.5 rounded-xl transition-all duration-300 ${
                  selectedStadium.id === stadium.id
                  ? `bg-gradient-to-r ${stadium.themeColor} text-white shadow-lg border border-white/10 scale-105`
                  : 'bg-slate-900/60 border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900 hover:scale-102 active:scale-98'
                }`}
              >
                {stadium.name === 'Spotify Camp Nou' ? 'Camp Nou' : stadium.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Interactive Visual Stadium map container with 3D Mouse Tilt */}
          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.005, 1.005, 1.005)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="relative bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden min-h-[380px] shadow-inner flex items-center justify-center transition-all duration-300"
          >
            {viewMode === 'schematic' ? (
              <svg viewBox="0 0 800 500" className="w-full h-auto max-w-[650px] drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] p-4">
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
                
                {/* Outer Wall colored dynamically based on selected stadium theme color */}
                <ellipse cx="400" cy="260" rx="340" ry="165" fill="#1e293b" stroke={selectedStadium.styleProps.ringColor} strokeWidth="5" />
                <ellipse cx="400" cy="265" rx="340" ry="165" fill="none" stroke="#334155" strokeWidth="1.5" />

                {/* 3D-SPECIFIC STADIUM VISUAL ARCHITECTURAL OVERLAYS */}
                
                {/* Camp Nou (FC Barcelona) Blue and Red themed seating stands */}
                {selectedStadium.id === 'camp-nou' && (
                  <>
                    <ellipse cx="400" cy="255" rx="320" ry="152" fill="none" stroke="#1d4ed8" strokeWidth="7" opacity="0.85" />
                    <ellipse cx="400" cy="255" rx="300" ry="142" fill="none" stroke="#b91c1c" strokeWidth="5" opacity="0.85" />
                  </>
                )}

                {/* Wembley White Arch */}
                {selectedStadium.id === 'wembley' && (
                  <path d="M 100,260 C 100,-20 700,-20 700,260" fill="none" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" opacity="0.9" />
                )}

                {/* Santiago Bernabéu Futuristic metallic shell ribs */}
                {selectedStadium.id === 'bernabeu' && (
                  <>
                    <ellipse cx="400" cy="255" rx="330" ry="158" fill="none" stroke="#94a3b8" strokeWidth="3" opacity="0.9" />
                    <ellipse cx="400" cy="255" rx="320" ry="150" fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="30,10" opacity="0.8" />
                    <ellipse cx="400" cy="255" rx="310" ry="142" fill="none" stroke="#475569" strokeWidth="1.5" opacity="0.7" />
                  </>
                )}

                {/* San Siro Iconic circular concrete corner towers */}
                {selectedStadium.id === 'san-siro' && (
                  <>
                    {/* Corner Cylindrical Towers */}
                    <circle cx="85" cy="115" r="16" fill="#334155" stroke="#475569" strokeWidth="2" filter="url(#glow)" opacity="0.9" />
                    <circle cx="85" cy="115" r="10" fill="#1e293b" />
                    
                    <circle cx="85" cy="395" r="16" fill="#334155" stroke="#475569" strokeWidth="2" filter="url(#glow)" opacity="0.9" />
                    <circle cx="85" cy="395" r="10" fill="#1e293b" />
                    
                    <circle cx="715" cy="115" r="16" fill="#334155" stroke="#475569" strokeWidth="2" filter="url(#glow)" opacity="0.9" />
                    <circle cx="715" cy="115" r="10" fill="#1e293b" />
                    
                    <circle cx="715" cy="395" r="16" fill="#334155" stroke="#475569" strokeWidth="2" filter="url(#glow)" opacity="0.9" />
                    <circle cx="715" cy="395" r="10" fill="#1e293b" />
                    
                    {/* Red crossbeams */}
                    <line x1="100" y1="120" x2="700" y2="120" stroke="#b91c1c" strokeWidth="3" opacity="0.5" />
                    <line x1="100" y1="390" x2="700" y2="390" stroke="#b91c1c" strokeWidth="3" opacity="0.5" />
                  </>
                )}

                {/* Allianz Arena Red Diamond-patterned outer cushions */}
                {selectedStadium.id === 'allianz' && (
                  <>
                    <ellipse cx="400" cy="255" rx="335" ry="160" fill="none" stroke="#ef4444" strokeWidth="9" strokeDasharray="16,10" filter="url(#glow)" opacity="0.85" />
                    <ellipse cx="400" cy="255" rx="325" ry="152" fill="none" stroke="#b91c1c" strokeWidth="3" strokeDasharray="10,16" opacity="0.6" />
                  </>
                )}

                {/* Seating Stands Layer 2 (Outer Tier) */}
                <ellipse cx="400" cy="255" rx="310" ry="145" fill="url(#standsGrad)" stroke="#0f172a" strokeWidth="4" />
                <ellipse cx="400" cy="255" rx="280" ry="130" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

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

                {/* Left Goal Post */}
                <path d="M 195,242 L 195,268 L 203,264 L 203,246 Z" fill="rgba(255,255,255,0.15)" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 195,242 L 203,246 M 195,268 L 203,264 M 195,255 L 203,255" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeDasharray="3,3" />

                {/* Right Goal Post */}
                <path d="M 605,242 L 605,268 L 597,264 L 597,246 Z" fill="rgba(255,255,255,0.15)" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 605,242 L 597,246 M 605,268 L 597,264 M 605,255 L 597,255" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeDasharray="3,3" />

                {/* PLAYER TUNNEL ENTRANCES (Indicate from where players emerge) */}
                <g 
                  transform="translate(400, 335)" 
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveGateHover("Player Tunnel")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  {/* Ping animation ring */}
                  <ellipse cx="0" cy="0" rx="14" ry="7" fill="none" stroke="#22d3ee" strokeWidth="2.5" className="animate-pulse" filter="url(#glow)"/>
                  {/* Arched Tunnel Canopy */}
                  <path d="M -10,0 C -10,-14 10,-14 10,0" fill="#0f172a" stroke="#22d3ee" strokeWidth="2.5" />
                  <path d="M -7,-2 L 7,-2 M -5,-5 L 5,-5" stroke="#0891b2" strokeWidth="1" />
                  <text x="0" y="8" textAnchor="middle" fill="#22d3ee" fontWeight="black" fontSize="7" letterSpacing="0.5">TUNNEL</text>
                </g>

                {/* Gate VIP */}
                <g 
                  transform="translate(400, 75)" 
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveGateHover("Gate VIP")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  <ellipse cx="0" cy="0" rx="30" ry="15" fill="none" stroke={getGateStatus("Gate VIP").color} strokeWidth="2" className="animate-pulse" filter="url(#glow)"/>
                  <ellipse cx="0" cy="0" rx="20" ry="10" fill={getGateStatus("Gate VIP").color} stroke="#1e293b" strokeWidth="2" />
                  <ellipse cx="0" cy="-3" rx="14" ry="7" fill="#0f172a" />
                  <text x="0" y="3" textAnchor="middle" fill="white" fontWeight="black" fontSize="9" letterSpacing="1">VIP</text>
                </g>

                {/* Gate A */}
                <g 
                  transform="translate(100, 255)" 
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveGateHover("Gate A")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  <ellipse cx="0" cy="0" rx="30" ry="15" fill="none" stroke={getGateStatus("Gate A").color} strokeWidth="2" className="animate-pulse" filter="url(#glow)"/>
                  <ellipse cx="0" cy="0" rx="20" ry="10" fill={getGateStatus("Gate A").color} stroke="#1e293b" strokeWidth="2" />
                  <ellipse cx="0" cy="-3" rx="14" ry="7" fill="#0f172a" />
                  <text x="0" y="3" textAnchor="middle" fill="white" fontWeight="black" fontSize="10">A</text>
                </g>

                {/* Gate B */}
                <g 
                  transform="translate(400, 425)" 
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveGateHover("Gate B")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  <ellipse cx="0" cy="0" rx="30" ry="15" fill="none" stroke={getGateStatus("Gate B").color} strokeWidth="2" className="animate-pulse" filter="url(#glow)"/>
                  <ellipse cx="0" cy="0" rx="20" ry="10" fill={getGateStatus("Gate B").color} stroke="#1e293b" strokeWidth="2" />
                  <ellipse cx="0" cy="-3" rx="14" ry="7" fill="#0f172a" />
                  <text x="0" y="3" textAnchor="middle" fill="white" fontWeight="black" fontSize="10">B</text>
                </g>

                {/* Gate C */}
                <g 
                  transform="translate(700, 255)" 
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveGateHover("Gate C")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  <ellipse cx="0" cy="0" rx="30" ry="15" fill="none" stroke={getGateStatus("Gate C").color} strokeWidth="2" className="animate-pulse" filter="url(#glow)"/>
                  <ellipse cx="0" cy="0" rx="20" ry="10" fill={getGateStatus("Gate C").color} stroke="#1e293b" strokeWidth="2" />
                  <ellipse cx="0" cy="-3" rx="14" ry="7" fill="#0f172a" />
                  <text x="0" y="3" textAnchor="middle" fill="white" fontWeight="black" fontSize="10">C</text>
                </g>
              </svg>
            ) : (
              <div className="relative w-full h-[380px] md:h-[400px] overflow-hidden select-none rounded-2xl flex items-center justify-center">
                {/* High-res Real Stadium Image backdrop */}
                <img 
                  src={selectedStadium.imagePath} 
                  alt={selectedStadium.name} 
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out opacity-90 scale-102 hover:scale-105"
                />
                
                {/* Luxury Vignette and Color Grading Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-slate-950/10 mix-blend-overlay pointer-events-none"></div>

                {/* Pulsing Interactive Telemetry Nodes overlaid in 3D perspective! */}
                
                {/* Player Tunnel (Secure Pitch Entrance) */}
                <div 
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20"
                  style={{ top: selectedStadium.pinPositions.tunnel.top, left: selectedStadium.pinPositions.tunnel.left }}
                  onMouseEnter={() => setActiveGateHover("Player Tunnel")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  <span className="absolute inline-flex h-7 w-7 rounded-full bg-cyan-400 opacity-75 animate-ping -left-1 -top-1"></span>
                  <div className="bg-slate-950/95 backdrop-blur-md border border-cyan-450 text-cyan-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_8px_32px_rgba(34,211,238,0.3)] hover:scale-110 hover:border-white transition-all duration-300">
                    <span className="text-[10px]">🏃</span>
                    <span className="text-[9px] font-black tracking-widest uppercase font-black">TUNNEL</span>
                  </div>
                </div>

                {/* Gate VIP */}
                <div 
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20"
                  style={{ top: selectedStadium.pinPositions.gateVip.top, left: selectedStadium.pinPositions.gateVip.left }}
                  onMouseEnter={() => setActiveGateHover("Gate VIP")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  <span 
                    className="absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping -left-1 -top-1"
                    style={{ backgroundColor: getGateStatus("Gate VIP").color }}
                  ></span>
                  <div 
                    style={{ 
                      backgroundColor: getGateStatus("Gate VIP").color,
                      boxShadow: `0 0 15px ${getGateStatus("Gate VIP").color}50` 
                    }}
                    className="h-6 px-2.5 rounded-full border border-white/20 text-white font-black text-[9px] flex items-center justify-center hover:scale-110 hover:border-white transition-all duration-300"
                  >
                    VIP
                  </div>
                </div>

                {/* Gate A */}
                <div 
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20"
                  style={{ top: selectedStadium.pinPositions.gateA.top, left: selectedStadium.pinPositions.gateA.left }}
                  onMouseEnter={() => setActiveGateHover("Gate A")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  <span 
                    className="absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping -left-1 -top-1"
                    style={{ backgroundColor: getGateStatus("Gate A").color }}
                  ></span>
                  <div 
                    style={{ 
                      backgroundColor: getGateStatus("Gate A").color,
                      boxShadow: `0 0 15px ${getGateStatus("Gate A").color}50`
                    }}
                    className="h-6 w-6 rounded-full border border-white/20 text-white font-black text-[10px] flex items-center justify-center hover:scale-110 hover:border-white transition-all duration-300"
                  >
                    A
                  </div>
                </div>

                {/* Gate B */}
                <div 
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20"
                  style={{ top: selectedStadium.pinPositions.gateB.top, left: selectedStadium.pinPositions.gateB.left }}
                  onMouseEnter={() => setActiveGateHover("Gate B")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  <span 
                    className="absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping -left-1 -top-1"
                    style={{ backgroundColor: getGateStatus("Gate B").color }}
                  ></span>
                  <div 
                    style={{ 
                      backgroundColor: getGateStatus("Gate B").color,
                      boxShadow: `0 0 15px ${getGateStatus("Gate B").color}50`
                    }}
                    className="h-6 w-6 rounded-full border border-white/20 text-white font-black text-[10px] flex items-center justify-center hover:scale-110 hover:border-white transition-all duration-300"
                  >
                    B
                  </div>
                </div>

                {/* Gate C */}
                <div 
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20"
                  style={{ top: selectedStadium.pinPositions.gateC.top, left: selectedStadium.pinPositions.gateC.left }}
                  onMouseEnter={() => setActiveGateHover("Gate C")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  <span 
                    className="absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping -left-1 -top-1"
                    style={{ backgroundColor: getGateStatus("Gate C").color }}
                  ></span>
                  <div 
                    style={{ 
                      backgroundColor: getGateStatus("Gate C").color,
                      boxShadow: `0 0 15px ${getGateStatus("Gate C").color}50`
                    }}
                    className="h-6 w-6 rounded-full border border-white/20 text-white font-black text-[10px] flex items-center justify-center hover:scale-110 hover:border-white transition-all duration-300"
                  >
                    C
                  </div>
                </div>

                {/* First Aid (Safety indicator) */}
                <div 
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20"
                  style={{ top: selectedStadium.pinPositions.firstAid.top, left: selectedStadium.pinPositions.firstAid.left }}
                  onMouseEnter={() => setActiveGateHover("First Aid")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  <span className="absolute inline-flex h-7 w-7 rounded-full bg-rose-500 opacity-60 animate-ping -left-1 -top-1"></span>
                  <div className="bg-slate-950/95 backdrop-blur-md border border-rose-500 text-rose-500 h-6 px-2.5 rounded-full flex items-center gap-1 shadow-lg hover:scale-110 hover:border-white transition-all duration-300">
                    <span className="text-[10px]">✚</span>
                    <span className="text-[8px] font-black uppercase">MEDICAL</span>
                  </div>
                </div>

                {/* Concessions */}
                <div 
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group z-20"
                  style={{ top: selectedStadium.pinPositions.concessions.top, left: selectedStadium.pinPositions.concessions.left }}
                  onMouseEnter={() => setActiveGateHover("Concessions")}
                  onMouseLeave={() => setActiveGateHover(null)}
                >
                  <span className="absolute inline-flex h-7 w-7 rounded-full bg-amber-500 opacity-60 animate-ping -left-1 -top-1"></span>
                  <div className="bg-slate-950/95 backdrop-blur-md border border-amber-500 text-amber-500 h-6 px-2.5 rounded-full flex items-center gap-1 shadow-lg hover:scale-110 hover:border-white transition-all duration-300">
                    <span className="text-[10px]">🍔</span>
                    <span className="text-[8px] font-black uppercase">FOODS</span>
                  </div>
                </div>
              </div>
            )}

            {/* Glassmorphic Tooltip Overlay */}
            {activeGateHover && (
              <div 
                className="absolute bg-slate-950/90 backdrop-blur-3xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] max-w-xs transition-all duration-300 transform scale-100 z-30"
                style={getTooltipCoords()}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    {activeGateHover === 'Player Tunnel' && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>}
                    {activeGateHover}
                  </span>
                  {activeGateHover !== 'Player Tunnel' && activeGateHover !== 'First Aid' && activeGateHover !== 'Concessions' ? (
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
                  ) : (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      activeGateHover === 'Player Tunnel' 
                      ? 'bg-cyan-950 border-cyan-500/20 text-cyan-400' 
                      : activeGateHover === 'First Aid' 
                      ? 'bg-rose-950 border-rose-500/20 text-rose-400'
                      : 'bg-amber-950 border-amber-500/20 text-amber-400'
                    }`}>
                      {activeGateHover === 'Player Tunnel' ? 'SECURE ZONE' : activeGateHover === 'First Aid' ? 'MEDIC' : 'REFRESHMENTS'}
                    </span>
                  )}
                </div>
                
                {activeGateHover === 'Player Tunnel' ? (
                  <p className="text-[10.5px] text-slate-300 leading-relaxed">
                    Primary player entrance canopy. Tunnel connects to home/away locker rooms and security pathways. Direct pitch access for emergency personnel is actively maintained.
                  </p>
                ) : activeGateHover === 'First Aid' ? (
                  <p className="text-[10.5px] text-slate-300 leading-relaxed">
                    Fully equipped medical station and response unit. Staffed by dynamic emergency doctors and field medics. Located immediately inside Gate A.
                  </p>
                ) : activeGateHover === 'Concessions' ? (
                  <div className="text-[10.5px] text-slate-300 leading-relaxed space-y-1">
                    <p><strong>Available Food Courts:</strong></p>
                    <p>• <strong>Burger Stand</strong>: Section 102 (Cheeseburger, Fries, Cola)</p>
                    <p>• <strong>Pizza Hut</strong>: Section 205 (Pepperoni, Cheese, Water)</p>
                    <p>• <strong>Beer Garden</strong>: VIP Lounge (Craft Beer, Pretzels)</p>
                  </div>
                ) : (
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
                )}
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

          {/* Aggregate Stats Cards (Includes dynamic capacity indicator!) */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 shadow-inner">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-bold">Inflow</span>
              <div className="flex items-baseline gap-0.5 mt-0.5">
                <span className="text-lg font-black text-slate-100">{totalCrowd}</span>
                <span className="text-[9px] text-emerald-400">/m</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 shadow-inner">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-bold">Avg Wait</span>
              <div className="flex items-baseline gap-0.5 mt-0.5">
                <span className="text-lg font-black text-amber-400">{avgWait}</span>
                <span className="text-[9px] text-amber-400">m</span>
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 shadow-inner">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider font-bold">Capacity</span>
              <div className="flex items-baseline gap-0.5 mt-0.5">
                <span className="text-sm font-black text-cyan-400">{selectedStadium.capacity.toLocaleString()}</span>
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
                ? 'bg-slate-950 border-emerald-500/60 text-slate-100 shadow-lg shadow-emerald-500/5 font-black' 
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
                ? 'bg-slate-950 border-amber-500/60 text-slate-100 shadow-lg shadow-amber-500/5 font-black' 
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
                ? 'bg-slate-950 border-rose-500/60 text-slate-100 shadow-lg shadow-rose-500/5 font-black' 
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
