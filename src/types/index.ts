export type SeverityLevel = 'Low' | 'Medium' | 'High'
export type ActionLevel = 'Monitor' | 'Doctor review' | 'Intervene now'
export type BedStatus = 'Stable' | 'Watch' | 'Risk' | 'Critical'

export interface VitalReading {
  hour: number
  hr: number | null
  o2sat: number | null
  sbp: number | null
  temp: number | null
  resp: number | null
}

export interface RiskTrajectory {
  now: number
  t15m: number
  t30m: number
  t1h: number
  t4h: number
}

export interface ShapFeature {
  name: string
  importance: number
  direction: 'risk' | 'protective'
}

export interface TriageResult {
  severity: SeverityLevel
  confidence: number
  top_tokens: string[]
}

export interface TriagePatient {
  id: string
  name: string
  age: number
  gender: 'M' | 'F'
  arrival_time: string
  chief_complaint: string
  vitals: {
    hr: number
    sbp: number
    o2sat: number
    temp: number
  }
  triage: TriageResult
  suggested_action: 'Admit to ICU' | 'ED Observation' | 'Ward Transfer'
}

export interface Patient {
  patient_id: string
  bed_number: number
  name: string
  age: number
  gender: 'M' | 'F'
  hours_admitted: number
  diagnosis: string
  final_score: number
  status: BedStatus
  action: ActionLevel
  recommendation: string
  explanation: string
  predicted_crash_minutes: number | null
  confidence: number
  triage: TriageResult
  trajectory: RiskTrajectory
  vitals_history: VitalReading[]
  shap_features: ShapFeature[]
  last_updated: string
  // Latest vitals snapshot
  current_hr: number
  current_sbp: number
  current_o2sat: number
  current_temp: number
  hr_trend: 'up' | 'down' | 'stable'
  sbp_trend: 'up' | 'down' | 'stable'
  o2sat_trend: 'up' | 'down' | 'stable'
  temp_trend: 'up' | 'down' | 'stable'
}

export interface WardSnapshot {
  ward_id: string
  timestamp: string
  patients: Patient[]
  stats: {
    total_beds: number
    critical: number
    risk: number
    watch: number
    stable: number
    avg_lead_time_minutes: number
  }
}

export interface WardSocketMessage {
  type: 'snapshot' | 'patient_update' | 'alert'
  payload: WardSnapshot | Patient | AlertEntry
}

export interface AlertEntry {
  id: string
  patient_id: string
  bed_number: number
  patient_name: string
  risk_score: number
  message: string
  level: ActionLevel
  timestamp: string
  reasons: string[]
  predicted_crash_minutes: number | null
  acknowledged: boolean
}

export interface AIRecommendation {
  patient_id: string
  bed_number: number
  actions: string[]
  urgency: 'low' | 'medium' | 'high'
}
