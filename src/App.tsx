import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, ChatMessage } from "./types";
import { INDIAN_LAWS } from "./constants";
import ICJSVisualizer from "./components/ICJSVisualizer";
import SafetyMetrics from "./components/SafetyMetrics";
import SafetyMap from "./components/SafetyMap";
import ComplaintDraftWizard from "./components/ComplaintDraftWizard";
import AIHelpAssistant from "./components/AIHelpAssistant";

// Elegant Lucide-React icons
import { 
  ShieldAlert, 
  Map, 
  BrainCircuit, 
  FileText, 
  Users, 
  Settings, 
  Sparkles, 
  Radio, 
  Bell, 
  AlertTriangle, 
  ShieldCheck, 
  Rotate3d, 
  Volume2, 
  HelpCircle,
  Clock,
  ExternalLink,
  Phone
} from "lucide-react";

export default function App() {
  // Global Complainant / Citizen Identity
  const [profile, setProfile] = useState<UserProfile>({
    name: "Aaradhya Sharma",
    phone: "+91 98765 43210",
    location: "Connaught Place, New Delhi",
    emergencyContact: "+91 99999 88888 (Mother)"
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<"safehaven" | "corridor" | "counsel" | "efir">("safehaven");
  
  // 3D Isometric View State
  const [is3DMode, setIs3DMode] = useState(false);
  const [pitch3D, setPitch3D] = useState(15);
  const [yaw3D, setYaw3D] = useState(-15);

  // SOS Distress State Parameters
  const [sosActive, setSosActive] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [sosLogs, setSosLogs] = useState<string[]>([]);
  const [simulatedAudioActive, setSimulatedAudioActive] = useState(false);

  // UTC clocks for the telemetry display
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // SOS Progress hold trigger handler
  useEffect(() => {
    let interval: any;
    if (isHolding && !sosActive) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            triggerSOSDistress();
            clearInterval(interval);
            return 100;
          }
          return prev + 5; // Reaches 100% in 2 seconds
        });
      }, 100);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, sosActive]);

  const triggerSOSDistress = () => {
    setSosActive(true);
    setSimulatedAudioActive(true);
    setHoldProgress(0);
    
    // Seed initial high-speed telemetry notifications
    const logs = [
      `[DEBUG SYSTEM] SOS Beacon fully armed. Key structural anchors locked...`,
      `[TELEMETRY] Broadcasters sending live coordinates [Lat: 28.6139, Lng: 77.2090]`,
      `[Nirbhaya ERSS] Panic Ticket dispatched successfully to New Delhi PCR Sector-2`,
      `[ALERT REVERB] Automatic simulated secure SMS relay dispatch to: ${profile.emergencyContact}`,
      `[MEDIA SECURITY] Ambient mic recording active. Encoding 24bit evidence PCM stream...`,
      `[ICJS STAGE 1] Incident logged into Crime and Criminal Tracking Systems (CCTNS)`
    ];
    setSosLogs(logs);
  };

  const deactivateSOSDistress = () => {
    setSosActive(false);
    setSimulatedAudioActive(false);
    setSosLogs([]);
  };

  // Add more simulation lines dynamically when SOS is triggered
  useEffect(() => {
    if (!sosActive) return;
    const interval = setInterval(() => {
      const liveLogPool = [
        `[Safe-City smart CCTV] Camera CP-09 locked and focused on user geo-corridor coordinates`,
        `[Pink Patrol PCR] Vehicle CP-Beta dispatched. Estimated intercept: 180 seconds`,
        `[Nirbhaya core] Active tracking relay telemetry broadcast confirmed`,
        `[Police Station Parliament St] Desk sergeant acknowledged priority distress alert`,
        `[Database Sync] Evidentiary timestamp verification logged in e-Forensics database`
      ];
      const randomLog = liveLogPool[Math.floor(Math.random() * liveLogPool.length)];
      setSosLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${randomLog}`]);
    }, 4000);

    return () => clearInterval(interval);
  }, [sosActive]);

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden selection:bg-teal-500 selection:text-slate-950">
      
      {/* 3D Immersive ambient stars & mesh bg */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#172554_0%,transparent_50%)] pointer-events-none opacity-40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#115e59_0%,transparent_60%)] pointer-events-none opacity-20"></div>
      
      {/* Visual Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-rose-500 via-teal-400 to-indigo-500 rounded-2xl flex items-center justify-center animate-spin-slow">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-500 text-[10px] font-bold text-white px-2 py-0.5 rounded font-mono uppercase tracking-widest animate-pulse">
                  Nirbhaya SafeHaven Core
                </span>
                <span className="text-[11px] font-mono text-slate-400 border border-slate-800 rounded px-1.5 py-0.2 bg-slate-900">
                  UTC: {currentTime.toISOString().slice(11, 19)}
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white font-sans mt-0.5 sm:text-3xl">
                Sashakt SafeHaven
              </h1>
            </div>
          </div>

          {/* Interactive view modes toggler (3D Workspace vs Traditional) */}
          <div className="flex items-center gap-3">
            <button
              id="btn-toggle-3d"
              onClick={() => setIs3DMode(!is3DMode)}
              className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                is3DMode 
                  ? "bg-teal-500 text-slate-950 border-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.25)]" 
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Rotate3d className="w-4 h-4" />
              <span>3D Pivot view: {is3DMode ? "ON" : "OFF"}</span>
            </button>
            
            <a 
              href="tel:112"
              className="py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-[0_4px_14px_rgba(239,68,68,0.30)] cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" /> Call 112 ERSS
            </a>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 relative z-10">

        {/* 3D Interactive pivot sliders if active */}
        {is3DMode && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950/80 border border-teal-500/20 rounded-2xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono"
          >
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>3D Pitch Angle:</span>
                <span className="text-teal-400 font-bold">{pitch3D}°</span>
              </div>
              <input 
                type="range" 
                id="pitch-slider"
                min="0" 
                max="45" 
                value={pitch3D} 
                onChange={(e) => setPitch3D(Number(e.target.value))} 
                className="w-full accent-teal-400 h-1 rounded"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>3D Yaw Angle:</span>
                <span className="text-teal-400 font-bold">{yaw3D}°</span>
              </div>
              <input 
                type="range" 
                id="yaw-slider"
                min="-45" 
                max="45" 
                value={yaw3D} 
                onChange={(e) => setYaw3D(Number(e.target.value))} 
                className="w-full accent-teal-400 h-1 rounded"
              />
            </div>
          </motion.div>
        )}

        {/* Dynamic perspective shell container */}
        <div 
          style={is3DMode ? {
            perspective: "1000px",
            transformStyle: "preserve-3d"
          } : {}}
          className="transition-all duration-300"
        >
          <div
            style={is3DMode ? {
              transform: `rotateX(${pitch3D}deg) rotateY(${yaw3D}deg)`,
              transition: "transform 0.1s ease-out"
            } : {}}
            className="space-y-8"
          >
            
            {/* Global Quick-Action Alerts Panel (SOS and User Profile Configuration) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Massive Interactive SOS Orb Device */}
              <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl">
                
                {/* Simulated danger ambient red flash */}
                {sosActive && (
                  <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none ring-2 ring-red-500/40 rounded-2xl"></div>
                )}
                
                {/* SOS Button Area */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2">
                    Distress Core Trigger
                  </span>
                  
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    {/* Ring Concentric Waves */}
                    {isHolding && (
                      <div className="absolute inset-0 rounded-full border-2 border-teal-400 opacity-60 animate-ping"></div>
                    )}
                    {sosActive && (
                      <>
                        <div className="absolute inset-0 rounded-full border-4 border-red-500 pointer-events-none animate-[ping_1.5s_infinite]"></div>
                        <div className="absolute inset-4 rounded-full border-2 border-orange-500 pointer-events-none animate-[ping_2s_infinite]"></div>
                      </>
                    )}

                    {/* True Interactive Holding Button */}
                    <button
                      id="btn-sos-pulse"
                      onMouseDown={() => setIsHolding(true)}
                      onMouseUp={() => setIsHolding(false)}
                      onMouseLeave={() => setIsHolding(false)}
                      onTouchStart={() => setIsHolding(true)}
                      onTouchEnd={() => setIsHolding(false)}
                      onClick={sosActive ? deactivateSOSDistress : undefined}
                      className={`w-32 h-32 rounded-full font-black text-lg tracking-wider uppercase transition-all shadow-2xl active:scale-95 cursor-pointer z-10 flex flex-col items-center justify-center content-center relative ${
                        sosActive 
                          ? "bg-gradient-to-tr from-red-600 via-orange-500 to-red-600 text-white shadow-red-500/40 border-4 border-white/20" 
                          : "bg-gradient-to-tr from-slate-950 via-[#10192d] to-slate-950 text-rose-500 border border-rose-950"
                      }`}
                    >
                      {/* Physical Progress overlay block representation */}
                      {!sosActive && holdProgress > 0 && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="48" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${holdProgress * 3} 300`} />
                        </svg>
                      )}

                      <Radio className={`w-8 h-8 mb-1 block relative z-12 h-10 ${sosActive ? "animate-pulse" : ""}`} />
                      
                      <span className="text-sm font-sans relative z-12">
                        {sosActive ? "DISTRESS ON" : isHolding ? "HOLDING..." : "SOS PANIC"}
                      </span>
                      
                      <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase relative z-12">
                        {sosActive ? "Tap to Stop" : "Hold 2 Seconds"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Telemetry output log simulation */}
                <div className="flex-grow flex flex-col justify-between h-44 w-full">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Telemetry Feed Simulation
                    </span>
                    {simulatedAudioActive && (
                      <span className="text-red-400 font-mono text-[9px] uppercase animate-pulse flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-red-400" /> Auto Preserving Audio
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-950 rounded-xl border border-slate-850 p-3 h-32 overflow-y-auto font-mono text-[10px] text-slate-400 leading-normal whitespace-pre-wrap select-text scrollbar-thin">
                    {sosActive ? (
                      sosLogs.slice().reverse().map((log, idx) => (
                        <div key={idx} className={log.includes("CCTNS") || log.includes("dispatched") ? "text-emerald-400 font-bold" : "text-slate-300"}>
                          {log}
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 h-full flex flex-col items-center justify-center text-center px-4">
                        <AlertTriangle className="w-5 h-5 mb-1.5 text-slate-700" />
                        <span>System is armed. Press the SOS panic button simulation to test state security dispatch mechanisms.</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Citizen Identity and Emergency parameters panel */}
              <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Settings className="w-4 h-4 text-teal-400" />
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        Profile Config
                      </span>
                    </div>
                    <button
                      id="btn-edit-profile"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="text-teal-400 text-xs hover:underline bg-transparent border-0 cursor-pointer font-sans font-medium"
                    >
                      {isEditingProfile ? "Done" : "Change Params"}
                    </button>
                  </div>

                  {isEditingProfile ? (
                    /* Config Form */
                    <div className="space-y-3 font-sans">
                      <div>
                        <label className="text-[10px] text-slate-500 block font-mono">CITIZEN NAME</label>
                        <input
                          type="text"
                          id="profile-name-input"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 mt-0.5 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block font-mono">SIMULATED LOCATION</label>
                        <input
                          type="text"
                          id="profile-loc-input"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 mt-0.5 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block font-mono">EMERGENCY SMS CONTACT</label>
                        <input
                          type="text"
                          id="profile-contact-input"
                          value={profile.emergencyContact}
                          onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 mt-0.5 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Dynamic Text display */
                    <div className="space-y-3 font-sans text-xs">
                      <div>
                        <span className="text-slate-500 block font-mono text-[9px]">COMPLAINANT COGNOMEN</span>
                        <strong className="text-white block mt-0.5 text-sm">{profile.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-mono text-[9px]">GEOGRAPHIC SPAN</span>
                        <strong className="text-slate-300 block mt-0.5">{profile.location}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-mono text-[9px]">SMS SOS RESPONDERS</span>
                        <strong className="text-rose-400 block mt-0.5">{profile.emergencyContact}</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-855 mt-4 text-[11px] leading-relaxed text-slate-400 font-sans">
                  The data above automatically indexes into e-FIR complaints and customized server-side legal counsel questions.
                </div>
              </div>

            </div>

            {/* Dashboard Workspace Hub Navigation Tabs */}
            <div className="border-b border-slate-800 flex flex-wrap gap-2 shrink-0">
              <button
                id="tab-btn-safehaven"
                onClick={() => setActiveTab("safehaven")}
                className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer relative ${
                  activeTab === "safehaven" 
                    ? "text-teal-400 font-sans font-bold" 
                    : "text-slate-500 hover:text-slate-300 font-sans"
                }`}
              >
                ICJS Core Tracker
                {activeTab === "safehaven" && (
                  <motion.div layoutId="active-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
                )}
              </button>
              
              <button
                id="tab-btn-corridor"
                onClick={() => setActiveTab("corridor")}
                className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer relative ${
                  activeTab === "corridor" 
                    ? "text-teal-400 font-sans font-bold" 
                    : "text-slate-500 hover:text-slate-300 font-sans"
                }`}
              >
                Safe-City Map & Analytics
                {activeTab === "corridor" && (
                  <motion.div layoutId="active-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
                )}
              </button>

              <button
                id="tab-btn-counsel"
                onClick={() => setActiveTab("counsel")}
                className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer relative ${
                  activeTab === "counsel" 
                    ? "text-teal-400 font-sans font-bold" 
                    : "text-slate-500 hover:text-slate-300 font-sans"
                }`}
              >
                AI Counsel & Legal Index
                {activeTab === "counsel" && (
                  <motion.div layoutId="active-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
                )}
              </button>

              <button
                id="tab-btn-efir"
                onClick={() => setActiveTab("efir")}
                className={`pb-3 px-4 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer relative ${
                  activeTab === "efir" 
                    ? "text-teal-400 font-sans font-bold" 
                    : "text-slate-500 hover:text-slate-300 font-sans"
                }`}
              >
                e-FIR Representation Drafting
                {activeTab === "efir" && (
                  <motion.div layoutId="active-tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400" />
                )}
              </button>
            </div>

            {/* Layout Toggling Workspace Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                
                {/* TAB 1: ICJS Core Workflows */}
                {activeTab === "safehaven" && (
                  <div className="space-y-6">
                    <ICJSVisualizer />
                    
                    {/* Secondary informative pane explaining Nirbhaya Funds */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <ShieldCheck className="w-24 h-24 text-teal-500" />
                      </div>
                      
                      <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider mb-1">
                        GOVERNMENT OF INDIA CODES
                      </span>
                      <h4 className="text-lg font-bold text-white font-sans">
                        Statutory Integration of the Nirbhaya Fund Scheme
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed mt-2 max-w-3xl">
                        First introduced in 2013, the Nirbhaya Fund supports key initiatives to secure public environments. In this application, our virtual 3D platform maps the interactive integration of central command systems (ERSS), safe cities illumination parameters, and the Interoperable Criminal Justice System (ICJS). This ensures instant evidence locker security, female victim counselors, and speedy fast-track adjudication in court schedules.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: Maps and Analytics */}
                {activeTab === "corridor" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-8">
                      <SafetyMap />
                    </div>
                    <div className="lg:col-span-4">
                      <SafetyMetrics />
                    </div>
                  </div>
                )}

                {/* TAB 3: Gemini Counsel and Legal Index */}
                {activeTab === "counsel" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Chat Portal left */}
                    <div className="lg:col-span-7">
                      <AIHelpAssistant userProfile={profile} />
                    </div>

                    {/* Interactive Legal Indices right */}
                    <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto max-h-[600px] scrollbar-thin">
                      <div>
                        <div className="flex gap-1.5 items-center border-b border-slate-800 pb-3 mb-4">
                          <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                            Statutory Reference Library
                          </span>
                        </div>

                        <h3 className="text-xl font-bold tracking-tight text-white font-sans mb-1">
                          Women Protection Codes (IPC & BNS)
                        </h3>
                        <p className="text-xs text-slate-400 mb-6">
                          Read expanded legal interpretations of critical safety, stalking, and institutional protections mandates.
                        </p>

                        <div className="space-y-4">
                          {INDIAN_LAWS.map((law, lIdx) => (
                            <div key={lIdx} className="bg-slate-950/80 border border-slate-855 rounded-xl p-4 shadow-inner relative">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="text-xs font-bold text-white font-sans">
                                  {law.title}
                                </h4>
                                <span className="text-[9.5px] font-mono font-bold text-teal-400 bg-teal-950/40 border border-teal-900 px-1.5 py-0.2 rounded">
                                  {law.code}
                                </span>
                              </div>
                              <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-wide block mb-2">{law.scope}</span>
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                {law.shortDesc}
                              </p>
                              
                              <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-900 pt-2 leading-relaxed italic">
                                {law.fullDetails}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span>IPC: Indian Penal Code</span>
                        <span>BNS: Bharatiya Nyaya Sanhita</span>
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 4: e-FIR Complaint Draft Wizard */}
                {activeTab === "efir" && (
                  <div className="space-y-6">
                    <ComplaintDraftWizard userProfile={profile} />
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-6 text-xs text-slate-500 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1">
            <span>Sashakt Safety Ecosystem | Built under the</span>
            <span className="text-teal-400 border border-teal-950 px-1.5 rounded text-[10px] uppercase font-mono tracking-wider font-bold">
              Nirbhaya Scheme
            </span>
          </div>

          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All Simulated Channels Operational
            </span>
            <span className="text-slate-700">|</span>
            <span>Secure TLS Adjacency Connected</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
