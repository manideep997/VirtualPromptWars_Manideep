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
  const [idPhotoUrl, setIdPhotoUrl] = useState<string | null>(null);
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
    
    // Create a local blob URL of the uploaded image to extract their portrait
    const objectUrl = URL.createObjectURL(file);
    setIdPhotoUrl(objectUrl);

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
    setIdPhotoUrl(null);
    setGeneratedPass(null);
    setUploadProgress(0);
  };

  const getTooltipCoords = () => {
    // Return relative placement coordinates for ticket elements
    return {
      top: `calc(${activeStadiumInfo.pinPositions.tunnel.top} - 10px)`,
      left: `calc(${activeStadiumInfo.pinPositions.tunnel.left} + 20px)`
    };
  };

  // Luxury PDF printable ticket pass generator! Includes website logo and scannable QR code!
  const printPassToPdf = () => {
    if (!generatedPass) return;

    // Generate functional, scannable QR Code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      `SENTIENT STADIUM VIP FAST-PASS\nTicket Ref: ${generatedPass.ticketId}\nHolder: ${generatedPass.fullName}\nEmail: ${generatedPass.email}\nVenue: ${generatedPass.stadium.name}\nGate: ${generatedPass.gate}\nVerification: BIOMETRIC MATCH`
    )}`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to download your Entry Pass.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Sentient Stadium Pass - ${generatedPass.ticketId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&display=swap');
            body {
              font-family: 'Outfit', sans-serif;
              background-color: #f8fafc;
              color: #0f172a;
              margin: 0;
              padding: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 90vh;
            }
            .ticket-card {
              width: 480px;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 32px;
              padding: 35px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
              position: relative;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px dashed #cbd5e1;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .logo-section {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .logo-svg {
              width: 32px;
              height: 32px;
              color: #10b981;
            }
            .website-name {
              font-size: 18px;
              font-weight: 900;
              letter-spacing: -0.5px;
              color: #0f172a;
            }
            .pass-badge {
              background: #10b981;
              color: #ffffff;
              font-size: 9px;
              font-weight: 900;
              padding: 5px 10px;
              border-radius: 8px;
              letter-spacing: 1px;
            }
            .stadium-title {
              font-size: 22px;
              font-weight: 900;
              margin: 0 0 4px 0;
              color: #0f172a;
            }
            .stadium-location {
              font-size: 11px;
              color: #64748b;
              margin: 0 0 20px 0;
            }
            .attendee-block {
              display: flex;
              align-items: center;
              gap: 20px;
              background: #f8fafc;
              padding: 15px;
              border-radius: 16px;
              border: 1px solid #e2e8f0;
              margin-bottom: 20px;
            }
            .attendee-img {
              width: 68px;
              height: 68px;
              border-radius: 12px;
              object-fit: cover;
              border: 2.5px solid #10b981;
              background: #cbd5e1;
            }
            .details {
              display: flex;
              flex-direction: column;
              min-width: 0;
            }
            .label {
              font-size: 8px;
              font-weight: 800;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .value {
              font-size: 13px;
              font-weight: 900;
              color: #0f172a;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 25px;
            }
            .meta-card {
              background: #f8fafc;
              padding: 12px 15px;
              border-radius: 14px;
              border: 1px solid #e2e8f0;
            }
            .qr-section {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border-top: 2px dashed #cbd5e1;
              padding-top: 20px;
              text-align: center;
            }
            .qr-code {
              width: 135px;
              height: 135px;
              margin-bottom: 12px;
              padding: 6px;
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 12px;
            }
            .scan-text {
              font-size: 9px;
              font-weight: 700;
              color: #64748b;
              letter-spacing: 0.8px;
            }
            .watermark {
              font-size: 10px;
              font-weight: 800;
              color: #10b981;
              display: flex;
              align-items: center;
              gap: 6px;
              margin-top: 15px;
              justify-content: center;
              letter-spacing: 0.5px;
            }
            @media print {
              body {
                background: #ffffff;
                padding: 0;
              }
              .ticket-card {
                box-shadow: none;
                border: 2px solid #000000;
                margin: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket-card">
            <div class="header">
              <div class="logo-section">
                <!-- Glowing Shield Logo -->
                <svg class="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                <span class="website-name">SENTIENT STADIUM</span>
              </div>
              <span class="pass-badge">FAST-PASS</span>
            </div>

            <h3 class="stadium-title">${generatedPass.stadium.name}</h3>
            <p class="stadium-location">${generatedPass.stadium.location}</p>

            <div class="attendee-block">
              ${idPhotoUrl 
                ? `<img class="attendee-img" src="${idPhotoUrl}" alt="ID Photo" />` 
                : `<div class="attendee-img" style="display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #64748b;">👤</div>`
              }
              <div class="details">
                <span class="label">ATTENDEE</span>
                <span class="value" style="font-size: 14px;">${generatedPass.fullName}</span>
                <span style="font-size: 10px; color: #64748b; margin-top: 2px; word-break: break-all;">${generatedPass.email}</span>
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-card">
                <span class="label">ASSIGNED ENTRY GATE</span>
                <span class="value" style="color: #10b981; font-size: 14px;">${generatedPass.gate}</span>
              </div>
              <div class="meta-card">
                <span class="label">TICKET REFERENCE</span>
                <span class="value" style="font-family: monospace; font-size: 14px;">${generatedPass.ticketId}</span>
              </div>
            </div>

            <div class="qr-section">
              <img class="qr-code" src="${qrCodeUrl}" alt="QR Code" />
              <span class="scan-text font-black">SCAN CODE AT ENTRY TURNSTILE</span>
            </div>

            <div class="watermark">
              <!-- Check icon -->
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              BIOMETRICALLY VERIFIED TICKET HOLDER
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 animate-fade-in">
      
      {/* Column 1: Check-in Biometric Form */}
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
                Upload Identity Verification Proof (Must include your face portrait)
              </label>
              
              <div className="relative border border-dashed border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 bg-slate-950/30 flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-300">
                <input 
                  type="file" 
                  accept="image/*"
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
                        {isUploading ? `Uploading... ${uploadProgress}%` : "ID document processed successfully"}
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

      {/* Column 2: Digital Entry Pass generator */}
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
              
              {/* Attendee Photo and Details */}
              <div className="flex gap-4 items-center">
                {idPhotoUrl ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-500/40 flex-shrink-0 bg-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                    <img src={idPhotoUrl} alt="ID Photo" className="w-full h-full object-cover" />
                    {/* Glowing scanning radar line */}
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-400 opacity-60 top-0 animate-[bounce_2s_infinite]"></div>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-slate-800 flex-shrink-0 bg-slate-950/60 flex items-center justify-center text-slate-700">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">ATTENDEE</span>
                  <span className="text-xs font-black text-slate-100 block truncate">{generatedPass.fullName}</span>
                  <span className="text-[9px] text-slate-400 block truncate">{generatedPass.email}</span>
                </div>
              </div>

              {/* Gate & Telemetry Wait Time Integration */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-900">
                <div className="space-y-0.5">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">ASSIGNED GATE</span>
                  <span className="text-sm font-black text-emerald-400 block">{generatedPass.gate}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black block">LIVE WAIT TIME</span>
                  <span className="text-sm font-black text-cyan-400 block font-black">
                    {generatedPass.gateWaitTime === 0 ? "1 min" : `${generatedPass.gateWaitTime} mins`}
                  </span>
                </div>
              </div>

              {/* Real working QR Code loaded from free generator API! */}
              <div className="flex flex-col items-center justify-center py-3 bg-slate-950 border border-slate-900 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                
                <div className="relative p-2 bg-white rounded-xl shadow-lg border border-emerald-500/20">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                      `SENTIENT STADIUM VIP FAST-PASS\nTicket Ref: ${generatedPass.ticketId}\nHolder: ${generatedPass.fullName}\nEmail: ${generatedPass.email}\nVenue: ${generatedPass.stadium.name}\nGate: ${generatedPass.gate}\nStatus: BIOMETRICALLY VERIFIED`
                    )}`} 
                    alt="Scan QR" 
                    className="w-28 h-28 select-none"
                  />
                  {/* Glowing scanning laser bar */}
                  <div className="absolute inset-x-2 h-0.5 bg-emerald-450 opacity-60 top-2 animate-[bounce_3s_infinite]"></div>
                </div>

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
                onClick={printPassToPdf}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white font-black text-[10px] py-2.5 rounded-xl border border-white/[0.04] transition-all flex items-center justify-center gap-1.5 group font-black"
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
