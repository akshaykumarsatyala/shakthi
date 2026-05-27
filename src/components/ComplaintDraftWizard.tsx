import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, IncidentDetails } from "../types";
import { FileText, ChevronRight, ChevronLeft, CheckCircle2, Copy, Sparkles, AlertCircle } from "lucide-react";

interface ComplaintDraftWizardProps {
  userProfile: UserProfile;
}

export default function ComplaintDraftWizard({ userProfile }: ComplaintDraftWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [incident, setIncident] = useState<IncidentDetails>({
    incidentCategory: "Digital Harassment / Stalking",
    incidentDateTime: new Date().toISOString().slice(0, 16),
    locationAddress: "",
    description: "",
    perpetratorDetails: "",
    evidenceList: "Chat screenshots and call logs preserved"
  });

  const [generatedDraft, setGeneratedDraft] = useState<string>("");

  const incidentCategories = [
    "Digital Harassment / Stalking",
    "Physical Stalking / Intimidation",
    "Workplace Safety Harrassment (PoSH)",
    "Domestic Abuse / Violation",
    "Cyber Threat / Defamation"
  ];

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as any);
  };

  const handlePrev = () => {
    if (step > 1) setStep((step - 1) as any);
  };

  const handleSubmitDraft = async () => {
    setLoading(true);
    setAlertMsg(null);
    try {
      const response = await fetch("/api/draft-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          details: incident,
          userProfile: userProfile
        })
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedDraft(data.draft);
        if (data.warning) {
          setAlertMsg({ type: "success", text: "Complaint drafted via Offline Fallback. Setup Gemini API Key for complete custom analysis!" });
        } else {
          setAlertMsg({ type: "success", text: "Successfully synthesized legal-grade police complaint!" });
        }
        setStep(4);
      } else {
        throw new Error(data.error || "Failed to draft complaint");
      }
    } catch (err: any) {
      setAlertMsg({ type: "error", text: err.message || "An error occurred during draft synthesis." });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDraft);
    setAlertMsg({ type: "success", text: "Complaint draft copied to clipboard!" });
    setTimeout(() => setAlertMsg(null), 3000);
  };

  return (
    <div id="complaint-draft-wizard" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
      
      {/* Step Indicator Progress Bar */}
      <div className="lg:col-span-12 flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-400" />
          <h3 className="text-lg font-bold text-white font-sans">e-FIR Legal Complaint Drafting Wizard</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className={`px-2 py-0.5 rounded ${step === 1 ? "bg-teal-500/10 text-teal-400 border border-teal-500/30" : ""}`}>1. Category</span>
          <span className="text-slate-700">➔</span>
          <span className={`px-2 py-0.5 rounded ${step === 2 ? "bg-teal-500/10 text-teal-400 border border-teal-500/30" : ""}`}>2. Location</span>
          <span className="text-slate-700">➔</span>
          <span className={`px-2 py-0.5 rounded ${step === 3 ? "bg-teal-500/10 text-teal-400 border border-teal-500/30" : ""}`}>3. Events</span>
          <span className="text-slate-700">➔</span>
          <span className={`px-2 py-0.5 rounded ${step === 4 ? "bg-teal-500/10 text-teal-400 border border-teal-500/30" : ""}`}>4. Document</span>
        </div>
      </div>

      {/* Main interactive form card */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div className="space-y-4">
          
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <h4 className="text-sm font-bold text-slate-300 mb-2 font-mono">STEP 1: ACCUSATION CATEGORY</h4>
              <p className="text-xs text-slate-400 mb-4">
                Categorizing your incident properly matches it against target IPC/BNS statutory codes during analysis.
              </p>
              
              <div className="space-y-2">
                {incidentCategories.map((cat) => (
                  <button
                    key={cat}
                    id={`cat-btn-${cat.replace(/\s+/g, '')}`}
                    onClick={() => setIncident({ ...incident, incidentCategory: cat })}
                    className={`w-full text-left p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      incident.incidentCategory === cat 
                        ? "bg-slate-950 border-teal-500/50 text-white font-semibold" 
                        : "bg-slate-950/30 border-slate-800 text-slate-400 hover:bg-slate-950/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Location and Timestamp info */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-300 mb-1 font-mono">STEP 2: CHRONOLOGY & SPATIAL DATA</h4>
              <p className="text-xs text-slate-400">
                Enter precise times and coordinates to structure chronological timelines for official processing.
              </p>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">INCIDENT TIMELINE</label>
                <input
                  type="datetime-local"
                  id="incident-time-input"
                  value={incident.incidentDateTime}
                  onChange={(e) => setIncident({ ...incident, incidentDateTime: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">PHYSICAL OR URL SITE LOCATION</label>
                <input
                  type="text"
                  id="incident-location-input"
                  placeholder="e.g. Connaught Place Circle near Metro Gate 4, or URL Link"
                  value={incident.locationAddress}
                  onChange={(e) => setIncident({ ...incident, locationAddress: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">WITNESS OR PERPETRATOR INFORMATION</label>
                <input
                  type="text"
                  id="incident-perp-input"
                  placeholder="e.g. Stalker profile handles, vehicle marker plates, or heights"
                  value={incident.perpetratorDetails}
                  onChange={(e) => setIncident({ ...incident, perpetratorDetails: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Evidentiary timeline and descriptive facts */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-300 mb-1 font-mono">STEP 3: COMPREHENSIVE INCIDENT DESCRIPTION</h4>
              <p className="text-xs text-slate-400">
                Detail exactly what transpired. Note dates, threats, physical contact, harassment statements, or cyber stalking acts.
              </p>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">STATEMENT OF FACTS</label>
                <textarea
                  rows={4}
                  id="incident-desc-input"
                  placeholder="Draft your thoughts clearly... I was traveling back home when..."
                  value={incident.description}
                  onChange={(e) => setIncident({ ...incident, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-mono">SUPPORTING EVIDENCE INDEX</label>
                <input
                  type="text"
                  id="incident-evidence-input"
                  placeholder="e.g. CCTV recordings at Metro door, screenshot backups of instant messaging chats"
                  value={incident.evidenceList}
                  onChange={(e) => setIncident({ ...incident, evidenceList: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Finished Draft display */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
              <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-100">Draft Document Synthesized</h5>
                    <p className="text-[10px] text-slate-400">Ready to deliver to any Indian Police Precinct or e-FIR terminal.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 max-h-[220px] overflow-y-auto font-mono text-[10.5px] leading-relaxed text-slate-300 whitespace-pre-wrap">
                {generatedDraft || "No document compiled yet."}
              </div>
            </motion.div>
          )}

        </div>

        {/* Action Controls Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800/60">
          <div>
            {step > 1 ? (
              <button
                id="btn-draft-back"
                type="button"
                onClick={handlePrev}
                disabled={loading}
                className="py-2.5 px-4 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : <div />}
          </div>

          <div className="flex gap-2">
            {step < 3 ? (
              <button
                id="btn-draft-next"
                type="button"
                onClick={handleNext}
                className="py-2.5 px-5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs shadow-md"
              >
                Continue <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : step === 3 ? (
              <button
                id="btn-draft-submit"
                type="button"
                onClick={handleSubmitDraft}
                disabled={loading || !incident.description}
                className="py-2.5 px-6 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 text-xs shadow-lg shadow-teal-500/10"
              >
                {loading ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping"></span>
                    Synthesizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Generate Compliant Draft
                  </>
                )}
              </button>
            ) : (
              <button
                id="btn-draft-copy"
                type="button"
                onClick={copyToClipboard}
                className="py-2.5 px-6 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 text-xs shadow-md"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Formal Letter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3D Structural Draft document layout on Side */}
      <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-855 p-4 flex flex-col justify-between shadow-inner relative overflow-hidden min-h-[350px]">
        {/* Absolute glow design */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500/5 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-12 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 border-b border-slate-900 pb-3 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Real-Time Document Overlay
              </span>
            </div>

            {/* Document details preview */}
            <div className="space-y-3 text-[11px] font-sans">
              <div className="flex justify-between border-b border-slate-900/50 pb-1.5 text-slate-400">
                <span>Citizen Complainant:</span>
                <strong className="text-slate-200">{userProfile.name || "Anonymous Complainant"}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-900/50 pb-1.5 text-slate-400">
                <span>Assigned Sector:</span>
                <strong className="text-slate-200">{userProfile.location || "Simulated India Hub"}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-900/50 pb-1.5 text-slate-400">
                <span>Filing Class:</span>
                <span className="text-yellow-400 font-bold">{incident.incidentCategory.slice(0, 16)}...</span>
              </div>
              <div className="flex justify-between border-b border-slate-900/50 pb-1.5 text-slate-400">
                <span>Forensic Index:</span>
                <span className="text-teal-400 font-mono text-[9px]">LOCKED // EV-9021</span>
              </div>
            </div>
          </div>

          {/* Guidelines warning */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 mt-4 flex items-start gap-2 text-[10px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-300">Section 154 Code Right</p>
              <p className="mt-0.5 leading-normal">
                An e-FIR template draft generated using this portal carries fully simulated legal integrity parameters. You may carry this layout directly to nearest Pink Patrol Booths.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating alert notifier */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute bottom-4 left-4 right-4 p-3 rounded-xl text-xs z-20 font-sans border shadow-xl flex items-center justify-between ${
              alertMsg.type === "success" 
                ? "bg-slate-900/90 text-teal-400 border-teal-500/20" 
                : "bg-slate-900/90 text-red-400 border-red-500/20"
            }`}
          >
            <span>{alertMsg.text}</span>
            <button 
              onClick={() => setAlertMsg(null)}
              className="font-bold cursor-pointer hover:underline text-[10px] border-0 bg-transparent text-slate-400 ml-2"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
