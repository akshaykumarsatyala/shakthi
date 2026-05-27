import { ICJSStage, SafetyMapSpot } from "./types";

export const ICJS_STAGES: ICJSStage[] = [
  {
    id: "stage-1",
    name: "Police Dispatch & ERSS-112 Integration",
    shortName: "Police (ERSS)",
    status: "completed",
    description: "Instantaneous distress logging via ERSS 112. Coordinates automatically broadcast to closest GPS-tracked Pink Patrol PCR vehicles.",
    timeframe: "1-10 Minutes",
    systemConnected: "CCTNS (Crime & Criminal Tracking Network Systems)",
    roleInNirbhaya: "Nirbhaya Funded Command Centers with Safe City high-resolution CCTV tracking."
  },
  {
    id: "stage-2",
    name: "Evidence Lock & Digital Forensics",
    shortName: "Forensics",
    status: "current",
    description: "DNA sampling, mobile logs preservation, CCTV storage locking, and medical examiner registration at local One Stop Crisis Center.",
    timeframe: "Same Day / 24 Hours",
    systemConnected: "e-Forensics Unified Database Integration",
    roleInNirbhaya: "Nirbhaya fast-track evidence kits which prevent corruption or contamination of clinical reports."
  },
  {
    id: "stage-3",
    name: "Prosecution Drafting & Case Bundling",
    shortName: "Prosecution",
    status: "pending",
    description: "Immediate charge sheet drafting by government public prosecutor. Fast-track automated legal aid allocation if requested.",
    timeframe: "Within 60 Days",
    systemConnected: "e-Prosecution Judicial Gateway Network",
    roleInNirbhaya: "Free, guaranteed legal representation counselors designated under state judicial schemes."
  },
  {
    id: "stage-4",
    name: "Nirbhaya Fast-Track Court Trial",
    shortName: "Courts",
    status: "pending",
    description: "Trial conducted in specific Fast-Track Special Courts (FTSCs) under day-to-day hearing schedules. In-camera testimony recording.",
    timeframe: "Targeted 3-6 Months",
    systemConnected: "e-Courts National Portal Integration",
    roleInNirbhaya: "Fast-Track Special Courts established exclusively for POCSO and Rape trial expediting."
  },
  {
    id: "stage-5",
    name: "Swift Justice Delivery & Correctional Sync",
    shortName: "Correctional",
    status: "pending",
    description: "Final verdict execution and seamless synchronization with state offender registers to track parole and custodial monitoring.",
    timeframe: "Instant on Verdict",
    systemConnected: "e-Prisons Integrated Portal Gateway",
    roleInNirbhaya: "Integrated offender databases to support strict follow-up and ensure no custodial loopholes."
  }
];

export const SAFETY_SPOTS: SafetyMapSpot[] = [
  {
    id: "spot-1",
    name: "Pink Patrol Outpost - Connaught Place",
    type: "pink_booth",
    address: "Radial Road 1, Block A, Outer Circle, CP",
    distance: "120 meters",
    lat: 30,
    lng: 40,
    phone: "011-23351234",
    simulatedStatus: "Patrolling"
  },
  {
    id: "spot-2",
    name: "Nirbhaya One-Stop Crisis Center (OSC)",
    type: "one_stop",
    address: "RML Govt Hospital Complex, Baba Kharak Singh Marg",
    distance: "1.4 km",
    lat: 70,
    lng: 35,
    phone: "181 / 1091",
    simulatedStatus: "Operational"
  },
  {
    id: "spot-3",
    name: "Central Women Helpline & Safe-City Terminal",
    type: "police",
    address: "Sector 1, Police Station Headquarters, Parliament St",
    distance: "850 meters",
    lat: 45,
    lng: 80,
    phone: "112 / 011-23011211",
    simulatedStatus: "High Alert"
  },
  {
    id: "spot-4",
    name: "Janpath Neon Safe-Corridor Corridor",
    type: "safe_corridor",
    address: "Janpath Crossing to CP Radial Road 3",
    distance: "Adjacent",
    lat: 20,
    lng: 60,
    phone: "112 (Emergency Response)",
    simulatedStatus: "Operational"
  }
];

export const INDIAN_LAWS = [
  {
    title: "The Zero FIR Rule",
    code: "Section 154 CrPC",
    scope: "Procedural Right",
    shortDesc: "The legal right to register an FIR at absolute any police station in India in the event of any major assault or threat.",
    fullDetails: "If a woman is subjected to harassment or assault in a different area or travels elsewhere to find sanctuary, any police station is legally required to log the incident on the spot as a 'Zero FIR' without querying territorial boundaries, transferring it over to the respective local jurisdiction later. Failing to do so can result in prosecution of the police officer under IPC 166A."
  },
  {
    title: "Modesty Protection Clauses",
    code: "IPC Sec 354 / BNS Cl 74-78",
    scope: "Criminal Act",
    shortDesc: "Protects legal dignity and enforces rigorous punishments against verbal abuse, gestures, or stalkers.",
    fullDetails: "Covers a spectrum of offenses including active stalking (physical or electronic tracking via spyware/accounts), voyeurism (recording photos privately without assent), verbal intimidation, gestures tending to insult the virtue of a female, and criminal physical assault. Non-bailable clauses apply under several severity levels."
  },
  {
    title: "PoSH At Workplace Safeguard",
    code: "PoSH Act, 2013",
    scope: "Corporate/Institutional Safety",
    shortDesc: "Mandatory establishment of fair, internal complaint councils to monitor and address professional hostile behavior.",
    fullDetails: "The Sexual Harassment of Women at Workplace Act demands all business divisions, private or public sector, with 10 or more staff, to configure a functional Local/Internal Complaints Committee (ICC). The committee must be headed by a female, include external neutral NGOs, and report transparent investigations within 90 days of registration securely."
  },
  {
    title: "Domestic Abuse & Safeguards",
    code: "DV Act, 2005",
    scope: "Civil Law",
    shortDesc: "Provides direct, judicial protection orders, secure sanctuary housing, and monthly financial relief.",
    fullDetails: "Provides comprehensive civil protections against physical, emotional, psychological, sexual, or financial abuses within domestic households. Magistrates can pass rapid Protection Orders guaranteeing non-harassment, Residence Orders ensuring legal stay in shared homes, and immediate monetary support commands."
  }
];
