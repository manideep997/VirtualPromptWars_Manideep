"use client";

import React, { useState } from 'react';
import { useTelemetryStore, STADIUMS } from '../store/useTelemetryStore';
import { 
  User, 
  Mail, 
  FileText, 
  QrCode, 
  UploadCloud, 
  CheckCircle, 
  ArrowRight, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  CreditCard,
  RefreshCw
} from 'lucide-react';

export default function CheckInPortal() {
  const selectedStadium = useTelemetryStore((state) => state.selectedStadium);
  const gates = useTelemetryStore((state) => state.gates);
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [ticketId, setTicketId] = useState(() => `ST-${Math.floor(10000 + Math.random() * 90000)}`);
  const [stadiumId, setStadiumId] = useState(selectedStadium.id);
  const [gateId, setGateId] = useState("Gate A");
  const [idType, setIdType] = useState("passport");
  const [idFileName, setIdFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Pass Generation State
  const [generatedPass, setGeneratedPass] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 3D Tilt State for the Ticket Pass
  const [ticketTilt, setTicketTilt] = useState({ x: 0, y: 0 });

  const activeStadiumInfo = STADIUMS.find(s => s.id === stadiumId) || selectedStadium;
  const currentGateData = gates[gateId] || { waitTimeMinutes: 3, crowdDelta: 10 };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIdFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate luxury upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !idFileName) return;

    setIsGenerating(true);
    
    // Simulate biometric check / verification delays
    setTimeout(() => {
      setGeneratedPass({
        fullName,
        email,
        ticketId,
        stadium: activeStadiumInfo,
        gate: gateId,
        idType,
        idFileName,
        timestamp: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        gateWaitTime: currentGateData.waitTimeMinutes
      });
      setIsGenerating(false);
    }, 1200);
  };

  const handleTicketMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Smooth 3D tilt
    const rotateX = -(y / (box.height / 2)) * 10;
    const rotateY = (x / (box.width / 2)) * 10;
    setTicketTilt({ x: rotateX, y: rotateY });
  };

  const handleTicketMouseLeave = () => {
    setTicketTilt({ x: 0, y: 0 });
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setTicketId(`ST-${Math.floor(10000 + Math.random() * 90000)}`);
    setIdFileName(null);
    setGeneratedPass(null);
    setUploadProgress(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 animate-fade-in">
      
      {/* Column 1: Check-in Biometric Form (7 cols) */}
      <div className="lg:col-span-7 bg-slate-900/20 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.55)] relative overflow-hidden hover:border-white/[0.08] transition-all duration-500 flex flex-col justify-between">
        
        {/* Glow Ambient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-950 border border-emerald-500/30 p-2.5 rounded-xl text-emerald-400">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-100 uppercase tracking-wide">Identity Fast-Pass portal</h2>
              <p className="text-xs text-slate-400">Verify your credentials and generate your digital venue entry pass</p>
            </div>
          </div>
          
          <form onSubmit={handleGeneratePass} className="space-y-4 mt-6">
            
            {/* Input grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3 text-cyan-400" /> Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!!generatedPass}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/25 transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-cyan-400" /> Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!generatedPass}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/25 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Stadium / Gate details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stadium Venue select */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                  Select Stadium Location
                </label>
                <select
                  value={stadiumId}
                  onChange={(e) => setStadiumId(e.target.value)}
                  disabled={!!generatedPass}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none transition-all"
                >
                  {STADIUMS.map(s => (
                    <option key={s.id} value={s.id} className="bg-slate-950 text-slate-300">
                      {s.name} ({s.location.split(',')[1].trim()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Entry Gate Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                  Target Entry/Exit Gate
                </label>
                <select
                  value={gateId}
                  onChange={(e) => setGateId(e.target.value)}
                  disabled={!!generatedPass}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none transition-all"
                >
                  <option value="Gate A" className="bg-slate-950 text-slate-300">Gate A (West)</option>
                  <option value="Gate B" className="bg-slate-950 text-slate-300">Gate B (South)</option>
                  <option value="Gate C" className="bg-slate-950 text-slate-300">Gate C (East)</option>
                  <option value="Gate VIP" className="bg-slate-950 text-slate-300">Gate VIP (North)</option>
                </select>
              </div>
            </div>

            {/* Ticket Ref / Identity Type select */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ticket Ref ID */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-cyan-400" /> Ticket Reference
                </label>
                <input
                  type="text"
                  required
                  placeholder="ST-90823"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  disabled={!!generatedPass}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none transition-all font-mono"
                />
              </div>

              {/* ID Proof Type select */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3 h-3 text-cyan-400" /> ID Proof Document
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  disabled={!!generatedPass}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none transition-all"
                >
                  <option value="passport" className="bg-slate-950 text-slate-300">Government Passport</option>
                  <option value="license" className="bg-slate-950 text-slate-300">Driver's License</option>
                  <option value="national_id" className="bg-slate-950 text-slate-300">National ID Card</option>
                  <option value="fan_id" className="bg-slate-950 text-slate-300">Official Club Fan ID</option>
                </select>
              </div>
            </div>

            {/* Simulated ID Proof Upload Zone */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                Upload Identity Verification Proof (PNG, JPG or PDF)
              </label>
              
              <div className="relative border border-dashed border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 bg-slate-950/30 flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-300">
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  disabled={!!generatedPass || isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {idFileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-emerald-950/80 border border-emerald-500/30 p-2.5 rounded-full text-emerald-400">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{idFileName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {isUploading ? `Uploading... ${uploadProgress}%` : "Verification document successfully staged"}
                      </p>
                    </div>
                    {isUploading && (
                      <div className="w-32 bg-slate-850 h-1 rounded-full overflow-hidden mt-1">
                        <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 group-hover:scale-105 transition-all" />
                    <div>
                      <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Drag and drop your file or <span className="text-cyan-400 underline font-black">browse files</span></p>
                      <p className="text-[10px] text-slate-500 mt-1">Files must be less than 5 MB. Biometric verification is computed client-side.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Submit Button */}
            {!generatedPass ? (
              <button
                type="submit"
                disabled={isGenerating || isUploading || !fullName || !email || !idFileName}
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-40 text-white font-black text-xs py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 scale-100 active:scale-98"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    COMPUTING VERIFICATION MATCH...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    VERIFY IDENTITY & GENERATE FAST-PASS
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-black text-xs py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                CREATE NEW CHECK-IN / VOID PASS
              </button>
            )}

          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3 text-[10px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <p>
            Biometric credentials and identity documents are scanned locally. Under GDPR/Safe-venue directives, your files are never transmitted or stored on public databases.
          </p>
        </div>
      </div>

      {/* Column 2: Digital Entry Pass generator (5 cols) */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center">
        
        {generatedPass ? (
          /* High-Fidelity 3D-Tilt Generated Entry Pass! */
          <div 
            onMouseMove={handleTicketMouseMove}
            onMouseLeave={handleTicketMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${ticketTilt.x}deg) rotateY(${ticketTilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="w-full max-w-[320px] bg-slate-950 border border-white/10 rounded-3xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between relative hover:border-emerald-500/30 transition-all duration-300"
          >
            {/* Top Pass header with neon stadium background */}
            <div className={`p-5 relative overflow-hidden border-b border-white/[0.04] bg-gradient-to-br ${generatedPass.stadium.themeColor} text-white`}>
              {/* Vignette */}
              <div className="absolute inset-0 bg-slate-950/20 mix-blend-multiply pointer-events-none"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded border border-white/10">FAST-PASS</span>
                <span className="text-[10px] font-mono text-white/80">{generatedPass.ticketId}</span>
              </div>

              <div className="relative z-10 mt-6">
                <h3 className="text-lg font-black tracking-tight leading-tight">{generatedPass.stadium.name}</h3>
                <p className="text-[10px] text-white/80 mt-0.5">{generatedPass.stadium.location}</p>
              </div>
            </div>

            {/* Entry Pass Body */}
            <div className="p-5 space-y-4 bg-slate-950/90 relative z-10">
              {/* Attendee Details */}
              <div className="space-y-1">
                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">ATTENDEE</span>
                <span className="text-xs font-black text-slate-100 block">{generatedPass.fullName}</span>
                <span className="text-[9px] text-slate-400 block truncate">{generatedPass.email}</span>
              </div>

              {/* Gate & Telemetry Wait Time Integration */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-900">
                <div className="space-y-0.5">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">ASSIGNED GATE</span>
                  <span className="text-sm font-black text-emerald-400 block">{generatedPass.gate}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">LIVE WAIT TIME</span>
                  <span className="text-sm font-black text-cyan-400 block">
                    {generatedPass.gateWaitTime === 0 ? "1 min" : `${generatedPass.gateWaitTime} mins`}
                  </span>
                </div>
              </div>

              {/* Interactive Glowing QR Code */}
              <div className="flex flex-col items-center justify-center py-3 bg-slate-950 border border-slate-900 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                
                {/* Vector neon QR Code SVG */}
                <svg viewBox="0 0 100 100" className="w-28 h-28 text-white stroke-slate-100 stroke-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                  <path d="M 10,10 L 30,10 L 30,30 L 10,30 Z M 15,15 L 25,15 L 25,25 L 15,25 Z M 20,20 L 20,20" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M 70,10 L 90,10 L 90,30 L 70,30 Z M 75,15 L 85,15 L 85,25 L 75,25 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M 10,70 L 30,70 L 30,90 L 10,90 Z M 15,75 L 25,75 L 25,85 L 15,85 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M 45,10 L 55,10 M 45,20 L 55,20 M 45,30 L 45,45 M 55,40 L 55,50" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M 10,45 L 20,45 M 10,55 L 25,55 M 30,45 L 35,55 M 35,35 L 35,40" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M 70,45 L 90,45 M 70,55 L 75,55 M 85,55 L 90,55 M 80,60 L 80,75" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M 45,70 L 45,90 M 55,70 L 65,70 M 55,80 L 65,85 M 65,90 L 65,90" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="50" cy="50" r="5" className="fill-cyan-400 stroke-none" />
                </svg>

                <span className="text-[8px] text-slate-500 tracking-widest font-black uppercase mt-3">ID VERIFIED SCAN AT ENTRY</span>
              </div>
            </div>

            {/* Pass Footer and Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-900/60 relative z-10 flex flex-col gap-2 rounded-b-3xl">
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span>Verified: {generatedPass.idType.toUpperCase()}</span>
                <span>{generatedPass.timestamp.split(',')[0]}</span>
              </div>
              <button 
                onClick={() => alert("Simulating fast-pass print to PDF...")}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold text-[10px] py-2.5 rounded-xl border border-white/[0.04] transition-all flex items-center justify-center gap-1.5 group"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-105 transition-transform" />
                DOWNLOAD ENTRY PASS (PDF)
              </button>
            </div>

          </div>
        ) : (
          /* Holographic Blueprint Ticket Outline */
          <div className="w-full max-w-[320px] h-[480px] rounded-3xl border border-dashed border-slate-800 bg-slate-950/20 flex flex-col items-center justify-center text-center p-6 select-none relative overflow-hidden group">
            
            {/* Pulsing grid aesthetic */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="bg-slate-950 border border-slate-800 text-slate-600 p-4 rounded-full group-hover:border-cyan-500/20 group-hover:text-cyan-400/40 transition-colors duration-500">
                <QrCode className="w-12 h-12 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Fast-Pass Digital Ticket</h3>
                <p className="text-[10px] text-slate-600 leading-relaxed mt-2 max-w-[200px]">
                  Fill out the identity check-in form to unlock and generate your biometric fast-pass entry document.
                </p>
              </div>
            </div>
            
            {/* Holographic scanning laser beam line */}
            <div className="absolute left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent top-0 animate-[bounce_4s_infinite] pointer-events-none"></div>
          </div>
        )}

      </div>
    </div>
  );
}
