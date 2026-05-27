import { useState } from "react";
import { motion } from "motion/react";
import { Zap, HelpCircle, Activity, Heart, Compass, ShieldAlert } from "lucide-react";

export default function SafetyMetrics() {
  const [activeMetric, setActiveMetric] = useState<string>("erss");

  const metrics = [
    {
      id: "erss",
      title: "ERSS-112 Response Unit",
      stat: "6.8 min",
      trend: "Faster by 18% over Q3",
      color: "from-amber-500 to-red-500",
      accent: "text-red-400",
      description: "Average dispatch time calculated for mobile police vans responding to SOS flags inside urban city corridors.",
      details: [
        { label: "Active Mobile Units", value: "1,240 PCRs" },
        { label: "SafeCity Signal Priority", value: "Automatic" },
        { label: "Dispatch Queue Delay", value: "Zero (Instant Routing)" }
      ]
    },
    {
      id: "safecity",
      title: "SafeCity Illumination Index",
      stat: "94.2%",
      trend: "Goal: 98.0% by年底",
      color: "from-emerald-500 to-teal-500",
      accent: "text-emerald-400",
      description: "High-contrast smart lights mapped with real-time solar tracking. Decreases dark street pockets across municipal routes.",
      details: [
        { label: "Smart CCTV Relay", value: "85,600 units" },
        { label: "Audio Panic Terminals", value: "4,200 points" },
        { label: "Luminous Density", value: "> 40 Lux standards" }
      ]
    },
    {
      id: "one-stop",
      title: "One-Stop Centers (OSC)",
      stat: "740 Hubs",
      trend: "Fully funded",
      color: "from-blue-500 to-indigo-500",
      accent: "text-blue-400",
      description: "Nirbhaya mandated integrated assistance cells providing simultaneous medical aid, legal counselors, and sanctuary safe housing.",
      details: [
        { label: "Crisis beds ready", value: "2,200 national" },
        { label: "Resident Counselors", value: "24/7 coverage" },
        { label: "Integrates with e-FIR", value: "Direct system link" }
      ]
    }
  ];

  return (
    <div id="safety-metrics" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-2xl relative">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="px-2 py-0.5 text-slate-400 font-mono text-[10px] uppercase tracking-wider rounded border border-slate-700">Scheme Analytics</span>
            <h3 className="text-xl font-bold tracking-tight text-white font-sans mt-1">
              Nirbhaya Operational Safe-City Metrics
            </h3>
          </div>
          <Activity className="w-5 h-5 text-teal-400 animate-pulse" />
        </div>

        <p className="text-sm text-slate-400 mb-6">
          Toggle through active Nirbhaya infrastructure programs to evaluate real-time simulated response stats and metrics.
        </p>

        {/* Dynamic 3D Bento Tab Headers */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {metrics.map((m) => {
            const isSelected = activeMetric === m.id;
            return (
              <button
                key={m.id}
                id={`stat-tab-${m.id}`}
                onClick={() => setActiveMetric(m.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected 
                    ? "bg-slate-950/80 border-teal-500/50 shadow-lg shadow-teal-500/5" 
                    : "bg-slate-950/20 border-slate-850 hover:bg-slate-950/40 hover:border-slate-800"
                }`}
              >
                {/* Visual gradient backdrop */}
                {isSelected && (
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${m.color} blur-2xl opacity-15 pointer-events-none`}></div>
                )}
                
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 line-clamp-1">
                  {m.title.split(" ")[0]}
                </span>
                
                <span className={`text-lg font-bold font-sans mt-2 tracking-tight ${isSelected ? "text-white" : "text-slate-300"}`}>
                  {m.stat}
                </span>

                {/* Progress dot */}
                {isSelected && (
                  <motion.div 
                    layoutId="metric-dot"
                    className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1.5"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Program Deep-Dive card */}
        {metrics.map((m) => {
          if (m.id !== activeMetric) return null;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-950/90 rounded-xl border border-slate-800 p-4 shadow-inner"
            >
              <div className="flex gap-2 items-center text-teal-400 text-xs font-mono mb-2">
                <Compass className="w-4 h-4" />
                <span>{m.title.toUpperCase()} PROTOCOL</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {m.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-900 space-y-2">
                {m.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-mono">{detail.label}</span>
                    <span className="font-bold text-slate-200">{detail.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>Realtime data simulator feed link</span>
        </div>
        <span className="text-emerald-400 font-mono">100% Secure</span>
      </div>
    </div>
  );
}
