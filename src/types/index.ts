export type SeverityLevel = 'Low' | 'Medium' | 'High'
export type ActionLevel   = 'Monitor' | 'Doctor review' | 'Intervene now'
export type ColorLevel    = 'GREEN' | 'AMBER' | 'RED'

export interface ShapFeature {
  name: string
  importance: number        // 0-1, use as bar width %
}

export interface Trajectory {
  now: number               // risk score right now
  t1h: number               // predicted in 1 hour
  t2h: number               // predicted in 2 hours
  t4h: number               // predicted in 4 hours
}

export interface VitalsSparkline {
  HR: number[]              // array of last 5 readings
  O2Sat: number[]
  SBP: number[]
}

export interface Patient {
  patient_id: string
  age: number
  gender: string            // 'M' or 'F'
  hours_admitted: number
  diagnosis: string
  final_score: number       // 0-1, the main risk score
  action: ActionLevel
  color: ColorLevel
  recommendation: string    // plain English action string
  explanation: string       // plain English SHAP explanation
  triage_severity: SeverityLevel
  icu_risk: number          // 0-1
  trajectory: Trajectory
  vitals_sparkline: VitalsSparkline
  shap_features: ShapFeature[]
  last_updated: string      // ISO timestamp
}

export interface WardStats {
  critical: number
  review: number
  stable: number
  avg_lead_time_minutes: number
}

export interface WardSnapshot {
  ward_id: string
  timestamp: string
  patients: Patient[]       // already sorted by final_score DESC
  stats: WardStats
}

export interface WsMessage {
  type: 'snapshot' | 'patient_update' | 'alert'
  payload: WardSnapshot
}

// For triage form POST /api/v1/triage
export interface TriageRequest {
  patient_id: string
  text: string              // symptom description typed by user
}

export interface TriageResponse {
  patient_id: string
  severity: SeverityLevel
  confidence: number
  probabilities: {
    Low: number
    Medium: number
    High: number
  }
}
