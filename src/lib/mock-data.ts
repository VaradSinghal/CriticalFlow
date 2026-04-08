import { Patient, WardSnapshot, ColorLevel, ActionLevel, SeverityLevel } from '@/types'
import { scoreToColor } from '@/utils/colors'

const now = () => new Date().toISOString()

// ── Alert log entry (internal, for UI display) ──
export interface AlertLogEntry {
  id: string
  patient_id: string
  message: string
  color: ColorLevel
  timestamp: string
}

// ── Mock patients ──
export const mockPatients: Patient[] = [
  {
    patient_id: 'P04', age: 67, gender: 'M', hours_admitted: 18, diagnosis: 'Pneumonia + T2DM',
    final_score: 0.84, action: 'Intervene now', color: 'RED',
    recommendation: 'Escalate to senior physician. Consider arterial line. Repeat ABG.',
    explanation: 'SpO2 declining, high HR peak.',
    triage_severity: 'High', icu_risk: 0.84,
    trajectory: { now: 0.84, t1h: 0.86, t2h: 0.88, t4h: 0.92 },
    vitals_sparkline: { HR: [88, 94, 101, 108, 112], O2Sat: [97, 95, 93, 92, 91], SBP: [130, 132, 135, 137, 138] },
    shap_features: [
      { name: 'SpO2 dropping', importance: 0.35 },
      { name: 'HR elevated', importance: 0.28 },
      { name: 'Resp rate high', importance: 0.18 },
      { name: 'Lactate high', importance: 0.12 },
      { name: 'Age factor', importance: 0.07 },
    ],
    last_updated: now(),
  },
  {
    patient_id: 'P11', age: 54, gender: 'F', hours_admitted: 6, diagnosis: 'Sepsis — urinary source',
    final_score: 0.76, action: 'Intervene now', color: 'RED',
    recommendation: 'Broad-spectrum antibiotics. Fluid resuscitation. Lactate monitoring.',
    explanation: 'Rising HR with falling BP pattern consistent with early septic shock.',
    triage_severity: 'High', icu_risk: 0.76,
    trajectory: { now: 0.76, t1h: 0.78, t2h: 0.81, t4h: 0.85 },
    vitals_sparkline: { HR: [92, 98, 106, 112, 118], O2Sat: [96, 95, 94, 93, 93], SBP: [118, 112, 105, 100, 96] },
    shap_features: [
      { name: 'HR acceleration', importance: 0.32 },
      { name: 'BP declining', importance: 0.28 },
      { name: 'Temperature spike', importance: 0.22 },
      { name: 'Resp rate rising', importance: 0.13 },
    ],
    last_updated: now(),
  },
  {
    patient_id: 'P07', age: 43, gender: 'M', hours_admitted: 12, diagnosis: 'Community acquired pneumonia',
    final_score: 0.58, action: 'Doctor review', color: 'AMBER',
    recommendation: 'Continue antibiotics. Monitor SpO2 trend. Consider chest X-ray.',
    explanation: 'Moderate respiratory compromise with rising resp rate.',
    triage_severity: 'Medium', icu_risk: 0.58,
    trajectory: { now: 0.58, t1h: 0.60, t2h: 0.63, t4h: 0.68 },
    vitals_sparkline: { HR: [82, 84, 86, 88, 90], O2Sat: [95, 94, 94, 93, 93], SBP: [125, 124, 123, 122, 121] },
    shap_features: [
      { name: 'Resp rate rising', importance: 0.30 },
      { name: 'SpO2 declining', importance: 0.25 },
      { name: 'Temperature', importance: 0.20 },
      { name: 'BP stable', importance: 0.15 },
    ],
    last_updated: now(),
  },
  {
    patient_id: 'P02', age: 71, gender: 'F', hours_admitted: 24, diagnosis: 'COPD exacerbation',
    final_score: 0.43, action: 'Doctor review', color: 'AMBER',
    recommendation: 'Nebulizer protocol. Monitor peak flow. Assess BiPAP need.',
    explanation: 'Chronic baseline risk with moderate respiratory parameters.',
    triage_severity: 'Medium', icu_risk: 0.43,
    trajectory: { now: 0.43, t1h: 0.44, t2h: 0.45, t4h: 0.47 },
    vitals_sparkline: { HR: [78, 80, 79, 81, 82], O2Sat: [92, 92, 91, 91, 91], SBP: [135, 134, 136, 135, 134] },
    shap_features: [
      { name: 'Chronic SpO2', importance: 0.30 },
      { name: 'Resp rate', importance: 0.25 },
      { name: 'Age factor', importance: 0.20 },
    ],
    last_updated: now(),
  },
  {
    patient_id: 'P09', age: 35, gender: 'M', hours_admitted: 8, diagnosis: 'Post-appendectomy',
    final_score: 0.12, action: 'Monitor', color: 'GREEN',
    recommendation: 'Continue routine monitoring. Pain management PRN.',
    explanation: 'All vitals within normal range; post-surgical recovery on track.',
    triage_severity: 'Low', icu_risk: 0.12,
    trajectory: { now: 0.12, t1h: 0.11, t2h: 0.10, t4h: 0.09 },
    vitals_sparkline: { HR: [76, 74, 72, 73, 71], O2Sat: [98, 98, 99, 99, 99], SBP: [120, 118, 119, 118, 117] },
    shap_features: [
      { name: 'All vitals normal', importance: 0.40 },
      { name: 'Young age', importance: 0.30 },
      { name: 'Improving trend', importance: 0.20 },
    ],
    last_updated: now(),
  },
]

// ── Mock alerts log ──
export const mockAlertLog: AlertLogEntry[] = [
  { id: 'al1', patient_id: 'P04', message: 'Pt 04 escalated', color: 'RED', timestamp: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: 'al2', patient_id: 'P11', message: 'Pt 11 review flag', color: 'AMBER', timestamp: new Date(Date.now() - 11 * 60000).toISOString() },
  { id: 'al3', patient_id: 'P09', message: 'Pt 09 stable', color: 'GREEN', timestamp: new Date(Date.now() - 34 * 60000).toISOString() },
]

// ── Risk heatmap data (8 rows × 6 cols, ordered by visual layout) ──
export const riskHeatmapData = [
  [0.1, 0.2, 0.35, 0.6, 0.75, 0.84],  // P04
  [0.4, 0.5, 0.6,  0.65, 0.70, 0.76], // P11
  [0.3, 0.35, 0.4, 0.45, 0.52, 0.58], // P07
  [0.38, 0.39, 0.40, 0.41, 0.42, 0.43], // P02
  [0.2, 0.18, 0.15, 0.14, 0.13, 0.12], // P09
  [0.35, 0.40, 0.48, 0.55, 0.60, 0.65], 
  [0.45, 0.42, 0.40, 0.38, 0.35, 0.30], 
  [0.25, 0.32, 0.38, 0.44, 0.48, 0.52], 
]

// ── Initial Ward snapshot ──
export const initialWardSnapshot: WardSnapshot = {
  ward_id: 'Ward 4B',
  timestamp: now(),
  patients: [...mockPatients].sort((a, b) => b.final_score - a.final_score),
  stats: {
    critical: mockPatients.filter(p => p.color === 'RED').length,
    review: mockPatients.filter(p => p.color === 'AMBER').length,
    stable: mockPatients.filter(p => p.color === 'GREEN').length,
    avg_lead_time_minutes: 87,
  },
}

// ── Simulation engine ──
// Patient P04 risk climbs from 0.25 -> 0.95 over 10 steps
export function createSimulationTick(
  patients: Patient[],
  tickIndex: number
): { patients: Patient[]; newAlert: AlertLogEntry | null } {
  const target = patients.find(p => p.patient_id === 'P04') || patients[0]
  const t = Math.min(tickIndex, 10)
  const progress = t / 10
  
  const newScore = parseFloat((0.25 + progress * 0.70).toFixed(2))
  const newColor = scoreToColor(newScore)
  const newAction: ActionLevel = newScore >= 0.70 ? 'Intervene now' : newScore >= 0.35 ? 'Doctor review' : 'Monitor'

  const updatedTarget: Patient = {
    ...target,
    final_score: newScore,
    color: newColor,
    action: newAction,
    icu_risk: newScore,
    trajectory: {
      now: newScore,
      t1h: parseFloat((newScore + 0.05).toFixed(2)),
      t2h: parseFloat((newScore + 0.10).toFixed(2)),
      t4h: parseFloat((newScore + 0.15).toFixed(2)),
    },
    vitals_sparkline: {
      HR: [88, 94, 101, 108, Math.min(140, 112 + Math.floor(progress * 28))],
      O2Sat: [97, 95, 93, 92, Math.max(82, 91 - Math.floor(progress * 9))],
      SBP: [130, 132, 135, 137, Math.max(90, 138 - Math.floor(progress * 48))],
    },
    explanation: progress >= 0.7
      ? 'CRITICAL: Rapid SpO2 deterioration with compensatory tachycardia.'
      : progress >= 0.4
        ? 'SpO2 declining faster than expected; HR compensating.'
        : target.explanation,
    last_updated: new Date().toISOString(),
  }

  let newAlert: AlertLogEntry | null = null
  if (t === 3) {
    newAlert = { id: `sim-${t}`, patient_id: 'P04', message: 'Pt 04 review flag', color: 'AMBER', timestamp: now() }
  } else if (t === 7) {
    newAlert = { id: `sim-${t}`, patient_id: 'P04', message: 'Pt 04 risk rising rapidly', color: 'AMBER', timestamp: now() }
  } else if (t === 9) {
    newAlert = { id: `sim-${t}`, patient_id: 'P04', message: 'Pt 04 escalated — RED', color: 'RED', timestamp: now() }
  }

  const updatedPatients = patients
    .map(p => (p.patient_id === target.patient_id ? updatedTarget : p))
    .sort((a, b) => b.final_score - a.final_score)

  return { patients: updatedPatients, newAlert }
}
