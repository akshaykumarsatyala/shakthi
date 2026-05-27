export interface UserProfile {
  name: string;
  phone: string;
  location: string;
  emergencyContact: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IncidentDetails {
  incidentCategory: string;
  incidentDateTime: string;
  locationAddress: string;
  description: string;
  perpetratorDetails: string;
  evidenceList: string;
}

export interface ICJSStage {
  id: string;
  name: string;
  shortName: string;
  status: "pending" | "current" | "completed";
  description: string;
  timeframe: string;
  systemConnected: string;
  roleInNirbhaya: string;
}

export interface SafetyMapSpot {
  id: string;
  name: string;
  type: "police" | "pink_booth" | "one_stop" | "safe_corridor";
  address: string;
  distance: string;
  lat: number;
  lng: number; // For visualization spacing
  phone: string;
  simulatedStatus: "Operational" | "Patrolling" | "High Alert";
}
