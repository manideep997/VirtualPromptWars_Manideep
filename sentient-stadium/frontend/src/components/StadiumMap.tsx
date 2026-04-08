"use client";

import React from 'react';
import { useTelemetryStore } from '../store/useTelemetryStore';

export default function StadiumMap() {
  const gates = useTelemetryStore((state) => state.gates);

  const getGateColor = (gateId: string) => {
    const data = gates[gateId];
    if (!data) return '#4ADE80'; // Green - Normal
    
    // Condition: Turngate color to red when simulated crowd count crosses a specific threshold (e.g. 30)
    if (data.crowdDelta > 30 || data.waitTimeMinutes > 15) {
      return '#EF4444'; // Red - High traffic
    }
    if (data.crowdDelta > 15 || data.waitTimeMinutes > 5) {
        return '#FACC15'; // Yellow - Medium
    }
    return '#4ADE80';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Stadium Live Map</h2>
        <svg viewBox="0 0 800 600" className="w-full h-auto bg-slate-900 rounded-lg">
            {/* Field */}
            <rect x="200" y="150" width="400" height="300" rx="15" fill="#166534" stroke="#4ade80" strokeWidth="4"/>
            <circle cx="400" cy="300" r="50" fill="none" stroke="#4ade80" strokeWidth="4" />
            <line x1="400" y1="150" x2="400" y2="450" stroke="#4ade80" strokeWidth="4" />

            {/* Gate A */}
            <g transform="translate(100, 250)">
                <circle cx="40" cy="40" r="30" fill={getGateColor("Gate A")} className="transition-colors duration-500"/>
                <text x="40" y="45" textAnchor="middle" fill="black" fontWeight="bold" fontSize="14">Gate A</text>
            </g>

            {/* Gate B */}
            <g transform="translate(100, 350)">
                <circle cx="40" cy="40" r="30" fill={getGateColor("Gate B")} className="transition-colors duration-500"/>
                <text x="40" y="45" textAnchor="middle" fill="black" fontWeight="bold" fontSize="14">Gate B</text>
            </g>
            
            {/* Gate C */}
            <g transform="translate(620, 300)">
                <circle cx="40" cy="40" r="30" fill={getGateColor("Gate C")} className="transition-colors duration-500"/>
                <text x="40" y="45" textAnchor="middle" fill="black" fontWeight="bold" fontSize="14">Gate C</text>
            </g>

            {/* Gate VIP */}
            <g transform="translate(360, 50)">
                <circle cx="40" cy="40" r="30" fill={getGateColor("Gate VIP")} className="transition-colors duration-500"/>
                <text x="40" y="45" textAnchor="middle" fill="black" fontWeight="bold" fontSize="14">VIP</text>
            </g>

            <rect x="50" y="520" width="20" height="20" fill="#4ADE80" />
            <text x="80" y="535" fill="white" fontSize="12">Normal</text>

            <rect x="150" y="520" width="20" height="20" fill="#FACC15" />
            <text x="180" y="535" fill="white" fontSize="12">Warning</text>

            <rect x="250" y="520" width="20" height="20" fill="#EF4444" />
            <text x="280" y="535" fill="white" fontSize="12">Overcrowded</text>
        </svg>
    </div>
  );
}
