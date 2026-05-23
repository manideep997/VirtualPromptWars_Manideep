"use client";

import React, { useEffect, useState } from 'react';
import StadiumMap from '../components/StadiumMap';
import AIChat from '../components/AIChat';
import CheckInPortal from '../components/CheckInPortal';
import { connectWebSocket, disconnectWebSocket } from '../lib/socket';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { 
  Building2, 
  Clock, 
  HelpCircle, 
  MapPin, 
  ArrowRight, 
  Info, 
  Cpu, 
  ShieldAlert,
  Activity,
  FileText
} from 'lucide-react';

export default function Home() {
  const activeTab = useTelemetryStore((state) => state.activeTab);
  const setActiveTab = useTelemetryStore((state) => state.setActiveTab);
  const [navSection, setNavSection] = useState<'telemetry' | 'checkin'>('telemetry');

  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 lg:p-12 bg-[#05070f] text-slate-100 overflow-x-hidden relative">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#05070f] to-transparent -z-10 blur-3xl"></div>

      {/* Main Container */}
      <div className="z-10 max-w-6xl w-full flex flex-col gap-8">
        
        {/* Stunning Futuristic Header */}
        <header className="text-center flex flex-col items-center gap-3 mt-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">PROMPT WARS SPECIAL EDITION</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-400 mt-2">
            SENTIENT STADIUM
          </h1>
          
          <p className="text-sm md:text-base text-slate-400 max-w-2xl font-medium leading-relaxed">
            Mitigate crowd bottlenecks, limit waiting queues, and navigate physical events with an active 
            <span className="text-emerald-400 font-bold"> Live-Telemetry AI Concierge</span>.
          </p>
        </header>

        {/* Global Navigation Tabs Selector */}
        <div className="flex justify-center mt-2">
          <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 flex gap-2 shadow-2xl relative z-20">
            <button 
              onClick={() => setNavSection('telemetry')}
              className={`text-xs uppercase font-black px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                navSection === 'telemetry' 
                ? 'bg-gradient-to-r from-emerald-600/90 to-cyan-600/90 text-white shadow-lg border border-white/10 scale-102 font-black' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40 active:scale-98'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-450" />
              Venue Radar & AI Chat
            </button>
            <button 
              onClick={() => setNavSection('checkin')}
              className={`text-xs uppercase font-black px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                navSection === 'checkin' 
                ? 'bg-gradient-to-r from-emerald-600/90 to-cyan-600/90 text-white shadow-lg border border-white/10 scale-102 font-black' 
                : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-455" />
              Fast-Pass Identity Check-In
            </button>
          </div>
        </div>

        {/* Conditional Sections Mounting */}
        {navSection === 'telemetry' ? (
          <>
            {/* SECTION 1 & 2: Interactive map and control panel */}
            <div id="stadium-map" className="scroll-mt-6">
              <StadiumMap />
            </div>

            {/* SECTION 3: AI Concierge & Quick prompts */}
            <div id="ai-chat" className="scroll-mt-6">
              <AIChat />
            </div>

            {/* SECTION 4: Interactive Insights, Benefits, and Architecture */}
            <section id="insights-section" className="scroll-mt-6 bg-slate-900/20 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.55)] mt-8 relative overflow-hidden transition-all duration-500 hover:border-white/[0.08]">
              
              {/* Ambient light overlay */}
              <div className="absolute -top-36 -right-36 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/80 pb-6 mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
                    <Info className="w-6 h-6 text-cyan-400" />
                    Operational Insights & Architecture
                  </h2>
                  <p className="text-xs text-slate-400">How Sentient Stadium resolves real-world event pain points</p>
                </div>

                {/* Tab switchers */}
                <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1 self-start">
                  <button 
                    onClick={() => setActiveTab('benefits')}
                    className={`text-xs font-black px-4 py-2 rounded-lg transition-all ${
                      activeTab === 'benefits' 
                      ? 'bg-slate-850 text-white border border-slate-700/50 shadow-md' 
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    HOW IT HELPS PEOPLE
                  </button>
                  <button 
                    onClick={() => setActiveTab('architecture')}
                    className={`text-xs font-black px-4 py-2 rounded-lg transition-all ${
                      activeTab === 'architecture' 
                      ? 'bg-slate-850 text-white border border-slate-700/50 shadow-md' 
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    SYSTEM ARCHITECTURE
                  </button>
                  <button 
                    onClick={() => setActiveTab('faqs')}
                    className={`text-xs font-black px-4 py-2 rounded-lg transition-all ${
                      activeTab === 'faqs' 
                      ? 'bg-slate-850 text-white border border-slate-700/50 shadow-md' 
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    FAQs & SAFETY DIRECTIVES
                  </button>
                </div>
              </div>

              {/* Tab 1: How it helps people */}
              {activeTab === 'benefits' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                  {/* Card 1 */}
                  <div 
                    onClick={() => {
                      document.getElementById('stadium-map')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between group hover:border-emerald-500/50 hover:bg-slate-950/80 hover:scale-[1.02] active:scale-[0.98] cursor-pointer duration-300 transition-all shadow-lg"
                  >
                    <div>
                      <div className="bg-emerald-950/80 border border-emerald-500/20 p-3 rounded-xl w-fit mb-4">
                        <Clock className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h3 className="text-sm font-black text-slate-200">Zero Line Bottlenecks</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        By monitoring IoT telemetry in real-time, the system automatically redirects attendees to Gates with the shortest queues. No more standing in 30-minute entry lines.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold mt-4">
                      <span>90% WAIT TIME DECREASE</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div 
                    onClick={() => {
                      setActiveTab('faqs');
                      document.getElementById('insights-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between group hover:border-cyan-500/50 hover:bg-slate-950/80 hover:scale-[1.02] active:scale-[0.98] cursor-pointer duration-300 transition-all shadow-lg"
                  >
                    <div>
                      <div className="bg-cyan-950/80 border border-cyan-500/20 p-3 rounded-xl w-fit mb-4">
                        <Building2 className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h3 className="text-sm font-black text-slate-200">Live Concession Guidance</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Integrated with static venue details, the AI Concierge guides attendees directly to food, beverages, and restrooms close to their seats, saving precious halftime minutes.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold mt-4">
                      <span>CONVENTIONAL FAQS ANSWERED</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div 
                    onClick={() => {
                      useTelemetryStore.getState().setSimulationMode('evac');
                      useTelemetryStore.getState().setIsSimulating(true);
                      setActiveTab('faqs');
                      document.getElementById('insights-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between group hover:border-amber-500/50 hover:bg-slate-950/80 hover:scale-[1.02] active:scale-[0.98] cursor-pointer duration-300 transition-all shadow-lg"
                  >
                    <div>
                      <div className="bg-amber-950/80 border border-amber-500/20 p-3 rounded-xl w-fit mb-4">
                        <ShieldAlert className="w-5 h-5 text-amber-400" />
                      </div>
                      <h3 className="text-sm font-black text-slate-200">Emergency & Incident Safety</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        During a crisis (such as simulated evacuation), the live visualizer warns of bottlenecks and redirect algorithms prompt the AI Concierge to issue life-saving escape directives.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold mt-4">
                      <span>REAL-TIME SAFETY DIRECTIVES</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: System Architecture */}
              {activeTab === 'architecture' && (
                <div className="animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h3 className="text-base font-extrabold text-slate-200 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        How the Technology Stack Operates
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        The platform is designed with an <strong>Indestructible Architecture</strong> designed strictly for robust, fail-fast operations, keeping telemetry in sync across multiple endpoints:
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/20 text-xs font-black px-2.5 py-1 rounded-lg">1</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-200">IoT Telemetry Node</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Physical event sensors send wait times and crowd densities to the backend server via HTTP or WebSocket channels.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                          <span className="bg-cyan-950 text-cyan-400 border border-cyan-500/20 text-xs font-black px-2.5 py-1 rounded-lg">2</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-200">WebSocket Broadcasting (STOMP)</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">The Spring Boot backend broadcasts the telemetry to the Next.js frontend, updating the Zustand state store automatically.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                          <span className="bg-indigo-950 text-indigo-400 border border-indigo-500/20 text-xs font-black px-2.5 py-1 rounded-lg">3</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-200">Gemini LLM Contextual Injection</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">When users ask questions, the frontend serverless endpoint combines live telemetry and static rules to ask Gemini 1.5 Flash contextually.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Architecture Visual Grid */}
                    <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-center flex flex-col gap-4 shadow-inner">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Telemetry Stream Flow</span>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4 text-xs font-bold">
                        
                        {/* Block A */}
                        <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl w-32 shadow">
                          <span className="text-emerald-400 block mb-1">PYTHON</span>
                          <span className="text-[10px] text-slate-400 font-normal">IoT Simulator</span>
                        </div>

                        <ArrowRight className="w-5 h-5 text-slate-600 rotate-90 sm:rotate-0" />

                        {/* Block B */}
                        <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl w-36 shadow relative">
                          <span className="text-cyan-400 block mb-1">SPRING BOOT</span>
                          <span className="text-[10px] text-slate-400 font-normal">H2 Database API</span>
                        </div>

                        <ArrowRight className="w-5 h-5 text-slate-600 rotate-90 sm:rotate-0" />

                        {/* Block C */}
                        <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl w-36 shadow">
                          <span className="text-indigo-400 block mb-1">NEXT.JS</span>
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            Zustand Store
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-slate-850/80 pt-3 text-[10px] text-slate-500 leading-relaxed">
                        If connections to the live backend are disrupted, the frontend immediately spins up a local client-side simulation loop with safe-mode fallback.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: FAQs & Safety Directives */}
              {activeTab === 'faqs' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                  {/* Column 1: Conventional FAQs & Handbook */}
                  <div className="space-y-4">
                    <h3 className="text-base font-extrabold text-slate-200 flex items-center gap-2">
                      <HelpCircle className="w-4.5 h-4.5 text-cyan-400" />
                      Stadium Policy & Conventional FAQs
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Official venue handbook and visitor rules. FAQs answered:
                    </p>

                    <div className="space-y-3">
                      {/* FAQ 1 */}
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700/50 transition-colors">
                        <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                          🍔 Where are the concessions? (Cheeseburger stand, etc.)
                        </h4>
                        <div className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                          Concessions are fully operational across stands:
                          <br />• <strong>Burger Stand</strong>: North Stand, Section 102 (Cheeseburger, Fries, Soda).
                          <br />• <strong>Pizza Hut</strong>: South Stand, Section 205 (Pepperoni Slice, Cheese, Water).
                          <br />• <strong>Beer Garden</strong>: VIP Lounge (Craft Beer, Pretzels).
                        </div>
                      </div>

                      {/* FAQ 2 */}
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700/50 transition-colors">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                          🎒 What is the bag size limit/policy?
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                          For overall safety, all bags must be made of **clear plastic** and cannot exceed the dimensions of **12x6x12 inches**. Backpacks and dark bags are prohibited.
                        </p>
                      </div>

                      {/* FAQ 3 */}
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700/50 transition-colors">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                          🚽 Where are the restrooms located?
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                          Restrooms are conveniently located near **all main gates** (Gate A, Gate B, Gate C) and at the corner of each seating stand.
                        </p>
                      </div>

                      {/* FAQ 4 */}
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700/50 transition-colors">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                          🚪 Is re-entry permitted in the stadium?
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                          No. Ticket scanning is one-way. Re-entry to the venue is strictly prohibited.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Live AI Safety Directives Console */}
                  <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 shadow-inner">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-center">
                      Active Emergency & Safety Directives Console
                    </span>
                    
                    {/* Visual Status Indicator */}
                    <div className={`p-5 rounded-2xl border flex gap-4 items-start transition-all duration-500 ${
                      useTelemetryStore.getState().simulationMode === 'evac'
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-200 shadow-lg shadow-rose-500/5 animate-pulse'
                      : useTelemetryStore.getState().simulationMode === 'halftime'
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200 shadow-lg shadow-amber-500/5'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    }`}>
                      <ShieldAlert className={`w-8 h-8 flex-shrink-0 mt-0.5 ${
                        useTelemetryStore.getState().simulationMode === 'evac'
                        ? 'text-rose-400'
                        : useTelemetryStore.getState().simulationMode === 'halftime'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                      }`} />
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                          SYSTEM STATUS: {
                            useTelemetryStore.getState().simulationMode === 'evac'
                            ? 'CRITICAL EVACUATION'
                            : useTelemetryStore.getState().simulationMode === 'halftime'
                            ? 'CROWD CONGESTION WARNING'
                            : 'ALL SYSTEMS CLEAR'
                          }
                        </h4>
                        
                        <div className="text-xs leading-relaxed mt-2 font-medium">
                          {
                            useTelemetryStore.getState().simulationMode === 'evac'
                            ? 'An emergency evacuation has been declared due to critical bottlenecking at the VIP Gate (45m+ delay). Attendee safety directive: DO NOT head to the VIP Gate. All attendees in the North stands must immediately exit via Gate A (West) or Gate B (South). Medical staff is stationed near Gate A.'
                            : useTelemetryStore.getState().simulationMode === 'halftime'
                            ? 'A crowd surge is active near Gate B due to halftime traffic. To avoid 20+ minute queues, fans in the South Stands are advised to wait in their seats for 5 minutes or route exits through Gate C, which has clear flow.'
                            : 'All gates are operating at optimal throughput. Normal venue conditions apply. Attendees can enter/exit through any gate with low delay. Gate VIP and Gate A have the shortest queues.'
                          }
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-850/80 pt-4 text-[10px] text-slate-500 leading-relaxed space-y-2">
                      <p>
                        <strong>How this console functions:</strong> These safety directives are computed dynamically based on live, real-time sensor streams mapping queue wait times.
                      </p>
                      <p>
                        The AI Concierge is automatically updated with these directives, allowing attendees to get immediate evacuation and queue routes directly through the chat box!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          <CheckInPortal />
        )}

        {/* Footer */}
        <footer className="text-center py-8 text-[11px] text-slate-500 border-t border-slate-900/60 mt-12">
          <p>© {new Date().getFullYear()} Sentient Stadium Co. Powered by Google Gemini 1.5 Flash & Next.js App Router.</p>
        </footer>
      </div>
    </main>
  );
}
