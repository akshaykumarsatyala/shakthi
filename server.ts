import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

let genAI: any | null = null;

function getGenAI() {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return null;
    }
    genAI = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAI;
}

function simulateResponse(lastMsg: string, profile: any) {
  const query = lastMsg.toLowerCase();
  const userName = profile?.name || "Citizen";
  
  if (query.includes("sos") || query.includes("panic") || query.includes("emergency") || query.includes("danger")) {
    return `🚨 **IMMEDIATE EMERGENCY RESPONSE FOR ${userName.toUpperCase()}**:\n\n1. **Dial 112 immediately** (National Emergency Response Support System - ERSS). It is free and active 24/7 across every city and village in India.\n2. **Engage the App's SOS Distress Trigger**: Tap and hold the SOS pulse button for 3 seconds. This initiates simulated SMS dispatch and safety system broadcasting.\n3. **Flee to a Safe Corridor**: Cross-reference the Interactive Maps tab below to find nearest simulated Police Stations, Pink Patrol Booths, or Metro helpdesks.\n4. **Audio Defense**: The SOS initiates local audio recording storage as secure safety evidence.\n\n*Note: Since your Gemini API key is offline, this is an automated safety protocol response. Add a GEMINI_API_KEY to secrets to receive detailed real-time help.*`;
  }
  
  if (query.includes("law") || query.includes("ipc") || query.includes("rights") || query.includes("bns") || query.includes("posh") || query.includes("zero") || query.includes("fir")) {
    return `⚖️ **Indian Women's Safety Legal Safeguards (IPC & BNS equivalents)**:\n\n*   **Zero FIR Concept (Section 154 CrPC)**: Under law, an FIR can be filled in *any* police station in India, regardless of where the jurisdiction lies. They have to log it immediately and dispatch it later.\n*   **Right to Privacy**: Under Section 164 of the CrPC, statement recording is restricted to a private session inside local magistrate chambers, strictly handled by a female officer.\n*   **PoSH Mandate (2013)**: The Sexual Harassment of Women at Workplace Act mandates any corporation/institution with 10 or more staff to have an active Internal Complaints Committee (ICC).\n*   **Stalking/Harassment (BNS Sections 74-78, formerly IPC 354D)**: Extends severe penalties for physical/digital stalking, voyeurism, or verbal assault intended to demean dignity.\n\n*Note: To query our active legal matrix with customizable queries, consider connecting your GEMINI_API_KEY.*`;
  }

  if (query.includes("complaint") || query.includes("draft") || query.includes("report")) {
    return `📝 **How to Draft an e-FIR Complaint or Police Representation**:\n\n1. Use our step-by-step **Complaint Drafting Assistant** below. It guides you sequence-by-sequence through essential legal questions.\n2. **Include Key Particulars**:\n   - Chronological summary of timeline (Date, Time, Location boundaries).\n   - Complete profiles/descriptions of perpetrator(s) if known.\n   - Explicit details of actions taken.\n   - Forensic, chat logs, or photographic attachments listed as supporting index.\n3. Send complaint to the unified portal at **cybercrime.gov.in** for digital crimes, or file a written copy signed by you at the local precinct.\n\n*Note: Add your GEMINI_API_KEY to let Sashakt Sahayak draft a complete, customized, legally robust complaint letter automatically.*`;
  }

  return `🌸 Namaste, ${userName}! I am **Sashakt Sahayak**, your women's safety counselor.\n\nHere is how I can support you today:\n*   **Legal Protections**: Ask about domestic issues, Zero FIRs, PoSH regulations, or cyber stalking.\n*   **Emergency Help**: Learn about India's safety initiatives, Nirbhaya Safe Spaces, and ERSS.\n*   **ICJS Navigation**: Understand the path from registering high-priority complaints to forensic and court dispatch steps.\n*   **Drafting Complaints**: Use the dynamic input form below or type "Draft formal report" here for specific guidelines.\n\n*Provide a GEMINI_API_KEY in Settings > Secrets to unlock live AI-powered counsel answers!*`;
}

// API Endpoints
app.post("/api/chat", async (req, res) => {
  const { messages, userProfile } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing messages array" });
  }

  const client = getGenAI();
  if (!client) {
    const lastMsg = messages[messages.length - 1]?.content || "";
    const simulatedText = simulateResponse(lastMsg, userProfile);
    return res.json({
      text: simulatedText,
      warning: "Offline simulator mode active. Configure your GEMINI_API_KEY in the Secrets panel to activate live Gemini AI safety counsel."
    });
  }

  try {
    const systemInstruction = `You are "Sashakt Sahayak" (Empowered Assistant), an empathetic, highly knowledgeable AI legal counselor and safety guide for women in India.
Your mission is to support women accessing legal rights, safety resources, and understanding the Interoperable Criminal Justice System (ICJS), Nirbhaya schemes, and general safety protocols.
You must be compassionate, legally accurate based on Indian law (IPC/BNS), non-judgmental, and practical.
Provide clear headings, action bullet points, and reference links where appropriate. Ensure they know they are safe.
Always state that you are an AI assistant and they should contact official ERSS helpline (112) for immediate active physical danger.

Profile of user seeking help or info:
- Name: ${userProfile?.name || "Citizen"}
- Current simulated region: ${userProfile?.location || "India"}

Structure your response using clean Markdown with distinct paragraphs and bold highlights. Avoid long blocks of text. Ensure a very calming, helpful tone.`;

    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini server error:", error);
    res.status(500).json({ error: error?.message || "An error occurred during AI analysis." });
  }
});

app.post("/api/draft-complaint", async (req, res) => {
  const { details, userProfile } = req.body;
  if (!details) {
    return res.status(400).json({ error: "Details are required to draft complaint" });
  }

  const client = getGenAI();
  if (!client) {
    // Generate simulated offline draft
    const offlineDraft = `**DRAFT POLICE COMPLAINT (SIMULATED FOR PREVIEW)**

Date: ${new Date().toLocaleDateString("en-IN")}
To,
The Officer-in-Charge,
Police Station: [Insert Nearest Station]
Simulated Jurisdiction: ${userProfile?.location || "[Your City]"}, India

Subject: Formal Complaint regarding ${details.incidentCategory || "Safety Harassment"}

Sir/Madam,

I, ${userProfile?.name || "[Your Name]"}, residing at ${details.locationAddress || "[Your Address]"}, hereby submit this formal complaint regarding an incident of "${details.incidentCategory || "Harassment"}" that transpired under the following circumstances:

1. **Date & Time of Occurrence**: ${details.incidentDateTime || "[Mention Date/Time]"}
2. **Specific Location**: ${details.locationAddress || "[Specify Location]"}
3. **Summary of Facts**:
   ${details.description || "No customized facts provided."}
4. **Perpetrator Description**: ${details.perpetratorDetails || "Unknown person(s)"}
5. **Supporting Details / Digital Evidence**: ${details.evidenceList || "Available forensics, logs/snapshots to be presented upon summons"}

This incident qualifies as an offence under the provisions of the Indian Penal Code (BNS corresponding sections). I request you to register a Zero FIR / formal Complaint immediately and take swift action to prevent further distress.

Thank you.

Respectfully Submitted,

_________________
${userProfile?.name || "[Your Name]"}
Phone: ${userProfile?.phone || "[Your Phone]"}

*Note: Enable GEMINI_API_KEY in Settings > Secrets to have our live AI safety engine write a dynamic, completely customizable legal complaint based on your specific report.*`;

    return res.json({ draft: offlineDraft, warning: "Offline preview mode. Config GEMINI_API_KEY for authentic auto-crafted FIRs." });
  }

  try {
    const prompt = `Draft a formal, highly professional, and legally-worded police complaint (or e-FIR template) addressed to the Station House Officer (SHO) of a police precinct under Indian jurisdiction regarding a safety/harassment incident.

Here are the specific case details provided by the citizen:
- Citizen Name: ${userProfile?.name || "Anonymous Citizen"}
- Citizen Location: ${userProfile?.location || "India"}
- Contact Number: ${userProfile?.phone || "[Provided privately]"}
- Incident Category: ${details.incidentCategory}
- Incident Date/Time: ${details.incidentDateTime}
- Location of Incident: ${details.locationAddress}
- Description of Incident: ${details.description}
- Accused/Perpetrator Details: ${details.perpetratorDetails || "Unknown/Identified in complaint"}
- Available Witnesses / Evidence: ${details.evidenceList || "Available upon call / logs retained"}

Draft this in formal legal English following classic Indian police complaint formatting (including proper subject link, Chronological fact breakdown, IPC/BNS sections where applicable (recommend sections 354, 509 IPC where modesty is outraged, or PoSH / IT Act Section 66E/67 where applicable), request to register FIR, and citizen signature line).
Format the entire complaint as clear, readable Markdown inside a code block or with proper page breaks. Keep it very professional.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });

    res.json({ draft: response.text });
  } catch (error: any) {
    console.error("Gemini draft error:", error);
    res.status(500).json({ error: error?.message || "An error occurred during AI drafting." });
  }
});

// Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULLSTACK SERVER] active on http://localhost:${PORT}`);
  });
}

startServer();
