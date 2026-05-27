import { useState } from "react";
import { motion } from "motion/react";
import { SAFETY_SPOTS } from "../constants";
import { SafetyMapSpot } from "../types";
import { Navigation, ShieldAlert, Phone, MapPin, Compass, Play, CheckCircle } from "lucide-react";

export default function SafetyMap() {
  const [selectedSpot, setSelectedSpot] = useState<SafetyMapSpot>(SAFETY_SPOTS[0]);
  const [dispatchState, setDispatchState] = useState<"idle" | "routing" | "arrived">("idle");
  const [dispatchCarProgress, setDispatchCarProgress] = useState<{ x: number; y: number }>({ x: 10, y: 90 });

  const getSpotColor = (type: string) => {
    switch (type) {
      case "police": return "bg-red-500 shadow-red-500/50";
      case "pink_booth": return "bg-pink-500 shadow-pink-500/50";
      case "one_stop": return "bg-blue-500 shadow-blue-500/50";
      case "safe_corridor": return "bg-teal-500 shadow-teal-500/50";
      default: return "bg-teal-500 shadow-teal-500/50";
    }
  };

  const startDispatchSimulation = () => {
    if (dispatchState !== "idle") return;
    setDispatchState("routing");
    
    // Animate dispatch tracking coordinates
    setTimeout(() => {
      setDispatchCarProgress({ x: selectedSpot.lng, y: selectedSpot.lat });
      setDispatchState("arrived");
    }, 2800);
  };

  const resetSimulation = () => {
    setDispatchState("idle");
    setDispatchCarProgress({ x: 10, y: 90 });
  };

  return (
    <div id="safety-map" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Map Control Sidebar */}
      <div className="xl:col-span-1 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-teal-400 animate-spin-slow" />
            <span className="px-2 py-0.5 text-slate-400 font-mono text-[10px] uppercase tracking-wider rounded border border-slate-700">Digital Safe Map</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white font-sans">
            Interactive Safe Corridor Locator
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Click any marker on the digital grid to preview live patrol parameters, emergency contacts, or test response routing.
          </p>
        </div>

        {/* Selected Spot Cards */}
        <div className="bg-slate-950/80 rounded-xl border border-slate-855 p-4 relative shadow-inner">
          <div className="flex justify-between items-start mb-3">
            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded text-white ${
              selectedSpot.type === 'police' ? 'bg-red-500/80' : 
              selectedSpot.type === 'pink_booth' ? 'bg-pink-500/80' : 
              selectedSpot.type === 'one_stop' ? 'bg-blue-500/80' : 'bg-teal-500/80'
            }`}>
              {selectedSpot.type.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {selectedSpot.distance} away
            </span>
          </div>

          <h4 className="text-sm font-bold text-white mb-1 leading-snug">
            {selectedSpot.name}
          </h4>
          <p className="text-[11px] text-slate-400 mb-3 flex items-start gap-1">
            <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
            <span>{selectedSpot.address}</span>
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900 rounded p-2 border border-slate-800/80">
              <span className="text-[9px] text-slate-500 block font-mono">STATUS</span>
              <span className="font-bold text-emerald-400 text-[10px]">{selectedSpot.simulatedStatus}</span>
            </div>
            <a 
              href={`tel:${selectedSpot.phone.replace(/[^0-9]/g, '')}`}
              className="bg-slate-900 rounded p-2 border border-slate-800/80 hover:bg-slate-850 transition-colors flex flex-col justify-start"
            >
              <span className="text-[9px] text-slate-500 block font-mono">CONTACT</span>
              <span className="font-bold text-teal-400 text-[10px] flex items-center gap-1">
                <Phone className="w-2.5 h-2.5" /> {selectedSpot.phone}
              </span>
            </a>
          </div>
        </div>

        {/* Dispatch Simulator Controls */}
        <div className="pt-2">
          {dispatchState === "idle" && (
            <button
              id="btn-dispatch-test"
              onClick={startDispatchSimulation}
              className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(20,184,166,0.30)] flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Navigation className="w-4 h-4" /> Simulate Emergency Dispatch
            </button>
          )}

          {dispatchState === "routing" && (
            <div className="w-full py-3 px-4 bg-slate-950/80 border border-teal-500/20 text-teal-400 font-bold rounded-xl flex items-center justify-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              Emergency Dispatch Vector Routing...
            </div>
          )}

          {dispatchState === "arrived" && (
            <div className="space-y-2">
              <div className="w-full py-3 px-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl flex items-center justify-center gap-2 text-xs">
                <CheckCircle className="w-4 h-4" /> Dispatch Arrived (Simulated Time: 2s)
              </div>
              <button 
                onClick={resetSimulation} 
                className="w-full py-1 text-[11px] text-slate-400 hover:text-white transition-colors underline bg-transparent border-0 cursor-pointer"
              >
                Reset Map Simulations
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Vector Canvas Grid */}
      <div className="xl:col-span-2 relative min-h-[300px] border border-slate-800/80 rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center">
        {/* Graph background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-15"></div>
        
        {/* Visual Map Routes & Areas */}
        <svg className="absolute inset-0 w-full h-full text-slate-800 opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Main Simulated Nirbhaya Pathways */}
          <line x1="10" y1="10" x2="90" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" />
          <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" />
          <line x1="50" y1="10" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" />
          <line x1="10" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.3" fill="none" />
          
          {/* Connection pathway mapping for the dispatch */}
          {dispatchState !== "idle" && (
            <path 
              d={`M 10 90 L 50 50 L ${selectedSpot.lng} ${selectedSpot.lat}`}
              fill="none" 
              stroke="#14b8a6" 
              strokeWidth="1.2" 
              strokeDasharray="4 2"
              className="animate-[dash_10s_linear_infinite]"
            />
          )}
        </svg>

        {/* User Simulated Spot */}
        <div className="absolute left-[10%] bottom-[10%] -translate-x-1/2 translate-y-1/2 flex flex-col items-center z-12">
          <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded font-mono shadow-md mb-1.5">
            YOUR GPS (SIMULATED)
          </span>
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-teal-400/40 animate-ping"></span>
            <div className="w-5 h-5 rounded-full bg-teal-400 border-2 border-slate-900 shadow-md flex items-center justify-center text-[9px] font-bold text-slate-950">
              Me
            </div>
          </div>
        </div>

        {/* Geolocation marker spots */}
        {SAFETY_SPOTS.map((spot) => {
          const isSelected = selectedSpot.id === spot.id;
          return (
            <button
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              style={{ left: `${spot.lng}%`, top: `${spot.lat}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-12 group transition-transform hover:scale-110"
              id={`map-node-${spot.id}`}
            >
              <div className="relative flex flex-col items-center">
                {/* Micro tooltip label */}
                <span className={`text-[8.5px] scale-0 group-hover:scale-100 transition-all font-sans bg-slate-900 text-white rounded px-1.5 py-0.5 shadow-md absolute bottom-full mb-1 border whitespace-nowrap ${
                  isSelected ? "border-teal-500 scale-100" : "border-slate-800"
                }`}>
                  {spot.name.split(" - ")[0]}
                </span>
                
                {/* Pulsing ring */}
                {isSelected && (
                  <span className="absolute -inset-1 rounded-full bg-teal-400/25 animate-pulse"></span>
                )}
                
                <div className={`w-4.5 h-4.5 rounded-full border-2 border-slate-950 shadow-md flex items-center justify-center ${getSpotColor(spot.type)}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
              </div>
            </button>
          );
        })}

        {/* Animated Simulated dispatch patrol vehicle node */}
        {dispatchState !== "idle" && (
          <motion.div
            animate={{
              left: `${dispatchCarProgress.x}%`,
              top: `${dispatchCarProgress.y}%`
            }}
            transition={{
              duration: dispatchState === "routing" ? 2.8 : 0,
              ease: "easeInOut"
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-13 flex flex-col items-center"
          >
            <div className="relative bg-teal-400 text-slate-950 rounded border-2 border-slate-950 px-1.5 py-0.5 flex items-center gap-1 font-mono text-[9px] font-bold shadow-2xl animate-bounce">
              <ShieldAlert className="w-3 h-3 text-slate-950 animate-pulse" />
              <span>PATROL ACTIVE</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
