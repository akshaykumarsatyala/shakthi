import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ICJS_STAGES } from "../constants";
import { ICJSStage } from "../types";
import { Shield, Sparkles, Network, Fingerprint, Scale, Landmark, AppWindow } from "lucide-react";

export default function ICJSVisualizer() {
  const [selectedStage, setSelectedStage] = useState<ICJSStage>(ICJS_STAGES[1]); // Forensic selected initially

  // Connect stage IDs to icons for dynamic display
  const getStageIcon = (id: string) => {
    switch (id) {
      case "stage-1": return <Shield className="w-5 h-5" />;
      case "stage-2": return <Fingerprint className="w-5 h-5" />;
      case "stage-3": return <Network className="w-5 h-5" />;
      case "stage-4": return <Scale className="w-5 h-5" />;
      case "stage-5": return <Landmark className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div id="icjs-visualizer" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 overflow-hidden relative shadow-2xl">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Sparkles className="w-24 h-24 text-emerald-400" />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 text-slate-400 font-mono text-[10px] uppercase tracking-wider rounded border border-slate-700">ICJS Integration</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-white font-sans">
          Interoperable Criminal Justice System (ICJS)
        </h3>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Observe how a registered incident is digitally dispatched and tracked across state departments in near-realtime to eliminate systemic delays.
        </p>
      </div>

      {/* 3D Flow Nodes Container */}
      <div className="relative flex flex-col lg:flex-row justify-between items-center gap-6 my-8 py-4 px-2">
        {/* Horizontal glowing connector line (hidden on small screens) */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 opacity-20 hidden lg:block rounded-full"></div>

        {ICJS_STAGES.map((stage, idx) => {
          const isSelected = selectedStage.id === stage.id;
          return (
            <div key={stage.id} className="w-full lg:w-auto relative flex flex-col items-center z-13">
              <motion.button
                id={`icjs-btn-${stage.id}`}
                onClick={() => setSelectedStage(stage)}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`w-64 lg:w-40 p-4 rounded-xl border flex lg:flex-col items-center gap-3 lg:gap-2 text-left lg:text-center transition-all cursor-pointer relative ${
                  isSelected 
                    ? "bg-slate-800 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.30)]" 
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                {/* 3D Inner shadow gradient overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                {/* Left/Top glowing active ring */}
                {isSelected && (
                  <motion.div 
                    layoutId="active-ring"
                    className="absolute inset-0 rounded-xl border-2 border-emerald-400/50 pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Node Number Badge */}
                <span className={`absolute -top-2 lg:-top-3 lg:left-1/2 lg:-translate-x-1/2 text-[9px] font-mono px-2 py-0.5 rounded-full border tracking-wide uppercase ${
                  isSelected 
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold" 
                    : "bg-slate-900 text-slate-500 border-slate-800"
                }`}>
                  Stage 0{idx + 1}
                </span>

                {/* Node Icon Wrap */}
                <div className={`p-2.5 rounded-lg border-2 ${
                  isSelected 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                    : "bg-slate-900 text-slate-400 border-slate-800"
                }`}>
                  {getStageIcon(stage.id)}
                </div>

                <div className="flex flex-col">
                  <span className={`text-xs font-bold leading-tight ${isSelected ? "text-white" : "text-slate-300"}`}>
                    {stage.shortName}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5 lg:mt-0">
                    {stage.timeframe}
                  </span>
                </div>
              </motion.button>
              
              {/* Vertical connector helper for mobile */}
              {idx < ICJS_STAGES.length - 1 && (
                <div className="h-6 w-0.5 bg-gradient-to-b from-slate-800 to-slate-900 lg:hidden"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Showcase Panel with Perspective Lift */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStage.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-5 shadow-inner"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-4 mb-4">
            <div>
              <span className="text-emerald-400 text-xs font-mono font-medium uppercase tracking-wider">
                ACTIVE PIPELINE DETAILS
              </span>
              <h4 className="text-lg font-bold text-white font-sans mt-0.5">
                {selectedStage.name}
              </h4>
            </div>
            <div className="flex gap-2 text-xs font-mono">
              <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800 text-slate-300">
                Avg. Processing: <strong className="text-teal-400">{selectedStage.timeframe}</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Functional Process Architecture</span>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {selectedStage.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Nirbhaya Special Mandate Role</span>
                <p className="text-sm text-slate-300 mt-1 italic border-l-2 border-slate-800 pl-3">
                  "{selectedStage.roleInNirbhaya}"
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">SYSTEM CONNECTIVITY GATEWAY</span>
                <span className="text-sm font-bold text-teal-400 block mt-1 font-mono">
                  {selectedStage.systemConnected}
                </span>
                <p className="text-[11px] text-slate-400 mt-2">
                  Unified national integration protocols ensure real-time biometric signatures and automatic database locks are updated for tracking.
                </p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-emerald-400">
                <span>Cryptographic Integrity</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 uppercase font-mono tracking-wider">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
