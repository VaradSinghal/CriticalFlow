import { Patient, AlertEntry, WardSnapshot, AIRecommendation, BedStatus } from '@/types'

const now = () => new Date().toISOString()

function scoreToBedStatus(score: number): BedStatus {
  if (score >= 0.70) return 'Critical'
  if (score >= 0.50) return 'Risk'
  if (score >= 0.30) return 'Watch'
  return 'Stable'
}

export const mockPatients: Patient[] = [
  {
    patient_id: 'P04', bed_number: 1, name: 'James Morrison', age: 67, gender: 'M',
    hours_admitted: 18, diagnosis: 'Acute MI — STEMI',
    final_score: 0.84, status: 'Critical', action: 'Intervene now',
    recommendation: 'Escalate to senior physician · Consider arterial line · Repeat ABG',
    explanation: 'SpO2 dropped 6 points in 4h; HR elevated and rising; symptom severity high',
    predicted_crash_minutes: 87, confidence: 0.91,
    triage: { severity: 'High', confidence: 0.91, top_tokens: ['chest pain', 'short of breath'] },
    trajectory: { now: 0.72, t15m: 0.74, t30m: 0.77, t1h: 0.83, t4h: 0.89 },
    vitals_history: [
      { hour: -4, hr: 88, o2sat: 97, sbp: 130, temp: 37.1, resp: 18 },
      { hour: -3, hr: 94, o2sat: 95, sbp: 132, temp: 37.2, resp: 20 },
      { hour: -2, hr: 101, o2sat: 93, sbp: 135, temp: 37.3, resp: 22 },
      { hour: -1, hr: 108, o2sat: 92, sbp: 137, temp: 37.4, resp: 24 },
      { hour: 0, hr: 112, o2sat: 91, sbp: 138, temp: 37.5, resp: 25 },
    ],
    shap_features: [
      { name: 'BP dropping', importance: 0.35, direction: 'risk' },
      { name: 'HR rising', importance: 0.25, direction: 'risk' },
      { name: 'SpO2 falling', importance: 0.18, direction: 'risk' },
      { name: 'Lactate high', importance: 0.12, direction: 'risk' },
      { name: 'Age factor', importance: 0.05, direction: 'risk' },
      { name: 'Temperature', importance: 0.05, direction: 'protective' },
    ],
    current_hr: 112, current_sbp: 138, current_o2sat: 91, current_temp: 37.5,
    hr_trend: 'up', sbp_trend: 'up', o2sat_trend: 'down', temp_trend: 'up',
    last_updated: now(),
  },
  {
    patient_id: 'P11', bed_number: 2, name: 'Sarah Chen', age: 54, gender: 'F',
    hours_admitted: 6, diagnosis: 'Sepsis — urinary source',
    final_score: 0.76, status: 'Critical', action: 'Intervene now',
    recommendation: 'Broad-spectrum antibiotics · Fluid resuscitation · Lactate monitoring',
    explanation: 'Rising HR with falling BP pattern consistent with early septic shock',
    predicted_crash_minutes: 112, confidence: 0.87,
    triage: { severity: 'High', confidence: 0.87, top_tokens: ['fever', 'confusion', 'dysuria'] },
    trajectory: { now: 0.68, t15m: 0.70, t30m: 0.72, t1h: 0.78, t4h: 0.82 },
    vitals_history: [
      { hour: -4, hr: 92, o2sat: 96, sbp: 118, temp: 38.1, resp: 20 },
      { hour: -3, hr: 98, o2sat: 95, sbp: 112, temp: 38.4, resp: 22 },
      { hour: -2, hr: 106, o2sat: 94, sbp: 105, temp: 38.8, resp: 24 },
      { hour: -1, hr: 112, o2sat: 93, sbp: 100, temp: 39.1, resp: 26 },
      { hour: 0, hr: 118, o2sat: 93, sbp: 96, temp: 39.3, resp: 28 },
    ],
    shap_features: [
      { name: 'HR rising', importance: 0.32, direction: 'risk' },
      { name: 'BP dropping', importance: 0.28, direction: 'risk' },
      { name: 'Temperature spike', importance: 0.22, direction: 'risk' },
      { name: 'Resp rate high', importance: 0.13, direction: 'risk' },
      { name: 'SpO2 stable', importance: 0.05, direction: 'protective' },
    ],
    current_hr: 118, current_sbp: 96, current_o2sat: 93, current_temp: 39.3,
    hr_trend: 'up', sbp_trend: 'down', o2sat_trend: 'down', temp_trend: 'up',
    last_updated: now(),
  },
  {
    patient_id: 'P07', bed_number: 3, name: 'David Patel', age: 43, gender: 'M',
    hours_admitted: 12, diagnosis: 'Pneumonia — community acquired',
    final_score: 0.58, status: 'Risk', action: 'Doctor review',
    recommendation: 'Continue antibiotics · Monitor SpO2 trend · Consider chest X-ray',
    explanation: 'Moderate respiratory compromise with rising resp rate',
    predicted_crash_minutes: 240, confidence: 0.78,
    triage: { severity: 'Medium', confidence: 0.78, top_tokens: ['cough', 'fever', 'dyspnea'] },
    trajectory: { now: 0.52, t15m: 0.53, t30m: 0.55, t1h: 0.58, t4h: 0.65 },
    vitals_history: [
      { hour: -4, hr: 82, o2sat: 95, sbp: 125, temp: 37.8, resp: 19 },
      { hour: -3, hr: 84, o2sat: 94, sbp: 124, temp: 38.0, resp: 20 },
      { hour: -2, hr: 86, o2sat: 94, sbp: 123, temp: 38.1, resp: 21 },
      { hour: -1, hr: 88, o2sat: 93, sbp: 122, temp: 38.2, resp: 22 },
      { hour: 0, hr: 90, o2sat: 93, sbp: 121, temp: 38.3, resp: 23 },
    ],
    shap_features: [
      { name: 'Resp rate rising', importance: 0.30, direction: 'risk' },
      { name: 'SpO2 declining', importance: 0.25, direction: 'risk' },
      { name: 'Temperature', importance: 0.20, direction: 'risk' },
      { name: 'BP stable', importance: 0.15, direction: 'protective' },
      { name: 'HR moderate', importance: 0.10, direction: 'protective' },
    ],
    current_hr: 90, current_sbp: 121, current_o2sat: 93, current_temp: 38.3,
    hr_trend: 'up', sbp_trend: 'down', o2sat_trend: 'down', temp_trend: 'up',
    last_updated: now(),
  },
  {
    patient_id: 'P02', bed_number: 4, name: 'Margaret O\'Brien', age: 71, gender: 'F',
    hours_admitted: 24, diagnosis: 'COPD exacerbation',
    final_score: 0.43, status: 'Watch', action: 'Doctor review',
    recommendation: 'Nebulizer protocol · Monitor peak flow · Assess BiPAP need',
    explanation: 'Chronic baseline risk with moderate respiratory parameters',
    predicted_crash_minutes: null, confidence: 0.73,
    triage: { severity: 'Medium', confidence: 0.73, top_tokens: ['wheezing', 'dyspnea'] },
    trajectory: { now: 0.40, t15m: 0.41, t30m: 0.42, t1h: 0.43, t4h: 0.45 },
    vitals_history: [
      { hour: -4, hr: 78, o2sat: 92, sbp: 135, temp: 36.9, resp: 22 },
      { hour: -3, hr: 80, o2sat: 92, sbp: 134, temp: 36.9, resp: 22 },
      { hour: -2, hr: 79, o2sat: 91, sbp: 136, temp: 37.0, resp: 23 },
      { hour: -1, hr: 81, o2sat: 91, sbp: 135, temp: 37.0, resp: 23 },
      { hour: 0, hr: 82, o2sat: 91, sbp: 134, temp: 37.1, resp: 24 },
    ],
    shap_features: [
      { name: 'Chronic SpO2', importance: 0.30, direction: 'risk' },
      { name: 'Resp rate', importance: 0.25, direction: 'risk' },
      { name: 'Age factor', importance: 0.20, direction: 'risk' },
      { name: 'HR stable', importance: 0.15, direction: 'protective' },
      { name: 'BP normal', importance: 0.10, direction: 'protective' },
    ],
    current_hr: 82, current_sbp: 134, current_o2sat: 91, current_temp: 37.1,
    hr_trend: 'stable', sbp_trend: 'stable', o2sat_trend: 'down', temp_trend: 'stable',
    last_updated: now(),
  },
  {
    patient_id: 'P09', bed_number: 5, name: 'Ryan Kowalski', age: 35, gender: 'M',
    hours_admitted: 8, diagnosis: 'Post-appendectomy',
    final_score: 0.12, status: 'Stable', action: 'Monitor',
    recommendation: 'Continue routine monitoring · Pain management PRN',
    explanation: 'All vitals within normal range; post-surgical recovery on track',
    predicted_crash_minutes: null, confidence: 0.92,
    triage: { severity: 'Low', confidence: 0.92, top_tokens: ['post-op', 'abdominal pain'] },
    trajectory: { now: 0.12, t15m: 0.12, t30m: 0.11, t1h: 0.10, t4h: 0.09 },
    vitals_history: [
      { hour: -4, hr: 76, o2sat: 98, sbp: 120, temp: 37.0, resp: 16 },
      { hour: -3, hr: 74, o2sat: 98, sbp: 118, temp: 36.9, resp: 16 },
      { hour: -2, hr: 72, o2sat: 99, sbp: 119, temp: 36.8, resp: 15 },
      { hour: -1, hr: 73, o2sat: 99, sbp: 118, temp: 36.8, resp: 15 },
      { hour: 0, hr: 71, o2sat: 99, sbp: 117, temp: 36.7, resp: 15 },
    ],
    shap_features: [
      { name: 'All vitals normal', importance: 0.40, direction: 'protective' },
      { name: 'Young age', importance: 0.30, direction: 'protective' },
      { name: 'Improving trend', importance: 0.20, direction: 'protective' },
      { name: 'Post-surgical', importance: 0.10, direction: 'risk' },
    ],
    current_hr: 71, current_sbp: 117, current_o2sat: 99, current_temp: 36.7,
    hr_trend: 'down', sbp_trend: 'stable', o2sat_trend: 'stable', temp_trend: 'stable',
    last_updated: now(),
  },
  {
    patient_id: 'P15', bed_number: 6, name: 'Elena Rodriguez', age: 62, gender: 'F',
    hours_admitted: 3, diagnosis: 'Diabetic ketoacidosis',
    final_score: 0.65, status: 'Risk', action: 'Doctor review',
    recommendation: 'Insulin drip titration · Hourly glucose · Electrolyte panel',
    explanation: 'Tachycardia with Kussmaul breathing pattern; metabolic derangement',
    predicted_crash_minutes: 180, confidence: 0.85,
    triage: { severity: 'High', confidence: 0.85, top_tokens: ['nausea', 'polyuria'] },
    trajectory: { now: 0.60, t15m: 0.61, t30m: 0.63, t1h: 0.65, t4h: 0.72 },
    vitals_history: [
      { hour: -4, hr: 98, o2sat: 97, sbp: 108, temp: 36.8, resp: 24 },
      { hour: -3, hr: 102, o2sat: 97, sbp: 106, temp: 36.7, resp: 26 },
      { hour: -2, hr: 105, o2sat: 96, sbp: 104, temp: 36.6, resp: 28 },
      { hour: -1, hr: 108, o2sat: 96, sbp: 102, temp: 36.5, resp: 30 },
      { hour: 0, hr: 110, o2sat: 96, sbp: 100, temp: 36.5, resp: 32 },
    ],
    shap_features: [
      { name: 'Resp rate rising', importance: 0.35, direction: 'risk' },
      { name: 'HR elevation', importance: 0.28, direction: 'risk' },
      { name: 'BP declining', importance: 0.22, direction: 'risk' },
      { name: 'SpO2 maintained', importance: 0.15, direction: 'protective' },
    ],
    current_hr: 110, current_sbp: 100, current_o2sat: 96, current_temp: 36.5,
    hr_trend: 'up', sbp_trend: 'down', o2sat_trend: 'stable', temp_trend: 'down',
    last_updated: now(),
  },
  {
    patient_id: 'P21', bed_number: 7, name: 'Alex Nguyen', age: 28, gender: 'M',
    hours_admitted: 14, diagnosis: 'Asthma exacerbation',
    final_score: 0.38, status: 'Watch', action: 'Doctor review',
    recommendation: 'Continue bronchodilator · Reassess in 2h · Spirometry if stable',
    explanation: 'Mild respiratory distress; responding to treatment',
    predicted_crash_minutes: null, confidence: 0.81,
    triage: { severity: 'Medium', confidence: 0.81, top_tokens: ['wheezing', 'dyspnea'] },
    trajectory: { now: 0.38, t15m: 0.37, t30m: 0.36, t1h: 0.34, t4h: 0.28 },
    vitals_history: [
      { hour: -4, hr: 96, o2sat: 94, sbp: 128, temp: 37.0, resp: 26 },
      { hour: -3, hr: 92, o2sat: 95, sbp: 126, temp: 37.0, resp: 24 },
      { hour: -2, hr: 88, o2sat: 96, sbp: 124, temp: 36.9, resp: 22 },
      { hour: -1, hr: 84, o2sat: 96, sbp: 122, temp: 36.9, resp: 20 },
      { hour: 0, hr: 82, o2sat: 97, sbp: 120, temp: 36.8, resp: 19 },
    ],
    shap_features: [
      { name: 'Improving SpO2', importance: 0.30, direction: 'protective' },
      { name: 'Decreasing HR', importance: 0.25, direction: 'protective' },
      { name: 'Resp normalizing', importance: 0.25, direction: 'protective' },
      { name: 'Initial severity', importance: 0.20, direction: 'risk' },
    ],
    current_hr: 82, current_sbp: 120, current_o2sat: 97, current_temp: 36.8,
    hr_trend: 'down', sbp_trend: 'stable', o2sat_trend: 'up', temp_trend: 'stable',
    last_updated: now(),
  },
  {
    patient_id: 'P33', bed_number: 8, name: 'Dorothy Williams', age: 79, gender: 'F',
    hours_admitted: 36, diagnosis: 'Congestive heart failure',
    final_score: 0.22, status: 'Stable', action: 'Monitor',
    recommendation: 'Continue diuretic · Daily weight · Fluid restriction',
    explanation: 'Responding to diuresis; vitals stabilizing',
    predicted_crash_minutes: null, confidence: 0.76,
    triage: { severity: 'Low', confidence: 0.76, top_tokens: ['edema', 'dyspnea on exertion'] },
    trajectory: { now: 0.22, t15m: 0.21, t30m: 0.20, t1h: 0.19, t4h: 0.16 },
    vitals_history: [
      { hour: -4, hr: 72, o2sat: 96, sbp: 128, temp: 36.8, resp: 18 },
      { hour: -3, hr: 70, o2sat: 96, sbp: 126, temp: 36.8, resp: 17 },
      { hour: -2, hr: 70, o2sat: 97, sbp: 124, temp: 36.7, resp: 17 },
      { hour: -1, hr: 68, o2sat: 97, sbp: 122, temp: 36.7, resp: 16 },
      { hour: 0, hr: 68, o2sat: 97, sbp: 120, temp: 36.7, resp: 16 },
    ],
    shap_features: [
      { name: 'Vitals normalizing', importance: 0.35, direction: 'protective' },
      { name: 'Treatment response', importance: 0.30, direction: 'protective' },
      { name: 'Age factor', importance: 0.20, direction: 'risk' },
      { name: 'Chronic condition', importance: 0.15, direction: 'risk' },
    ],
    current_hr: 68, current_sbp: 120, current_o2sat: 97, current_temp: 36.7,
    hr_trend: 'down', sbp_trend: 'stable', o2sat_trend: 'up', temp_trend: 'stable',
    last_updated: now(),
  },
  {
    patient_id: 'P40', bed_number: 9, name: 'Michael Foster', age: 58, gender: 'M',
    hours_admitted: 10, diagnosis: 'GI bleed — upper',
    final_score: 0.52, status: 'Risk', action: 'Doctor review',
    recommendation: 'IV PPI · Type and crossmatch · GI consult · Monitor hemoglobin',
    explanation: 'Tachycardia with dropping BP suggestive of ongoing hemorrhage',
    predicted_crash_minutes: 195, confidence: 0.82,
    triage: { severity: 'High', confidence: 0.82, top_tokens: ['hematemesis', 'melena'] },
    trajectory: { now: 0.48, t15m: 0.50, t30m: 0.52, t1h: 0.56, t4h: 0.63 },
    vitals_history: [
      { hour: -4, hr: 88, o2sat: 97, sbp: 115, temp: 36.5, resp: 18 },
      { hour: -3, hr: 92, o2sat: 97, sbp: 112, temp: 36.5, resp: 19 },
      { hour: -2, hr: 96, o2sat: 96, sbp: 108, temp: 36.4, resp: 19 },
      { hour: -1, hr: 100, o2sat: 96, sbp: 105, temp: 36.4, resp: 20 },
      { hour: 0, hr: 104, o2sat: 96, sbp: 102, temp: 36.3, resp: 20 },
    ],
    shap_features: [
      { name: 'BP declining', importance: 0.35, direction: 'risk' },
      { name: 'HR compensating', importance: 0.28, direction: 'risk' },
      { name: 'Hemorrhage risk', importance: 0.22, direction: 'risk' },
      { name: 'SpO2 maintained', importance: 0.15, direction: 'protective' },
    ],
    current_hr: 104, current_sbp: 102, current_o2sat: 96, current_temp: 36.3,
    hr_trend: 'up', sbp_trend: 'down', o2sat_trend: 'stable', temp_trend: 'down',
    last_updated: now(),
  },
  {
    patient_id: 'P44', bed_number: 10, name: 'Linda Chang', age: 45, gender: 'F',
    hours_admitted: 20, diagnosis: 'Acute pancreatitis',
    final_score: 0.31, status: 'Watch', action: 'Doctor review',
    recommendation: 'NPO status · IV fluids · Pain management · Lipase trending',
    explanation: 'Moderate tachycardia with pain; vitals otherwise stable',
    predicted_crash_minutes: null, confidence: 0.74,
    triage: { severity: 'Medium', confidence: 0.74, top_tokens: ['epigastric pain', 'vomiting'] },
    trajectory: { now: 0.31, t15m: 0.31, t30m: 0.32, t1h: 0.33, t4h: 0.35 },
    vitals_history: [
      { hour: -4, hr: 90, o2sat: 97, sbp: 128, temp: 37.2, resp: 18 },
      { hour: -3, hr: 88, o2sat: 97, sbp: 126, temp: 37.3, resp: 18 },
      { hour: -2, hr: 86, o2sat: 98, sbp: 125, temp: 37.2, resp: 17 },
      { hour: -1, hr: 85, o2sat: 98, sbp: 124, temp: 37.1, resp: 17 },
      { hour: 0, hr: 84, o2sat: 98, sbp: 124, temp: 37.0, resp: 17 },
    ],
    shap_features: [
      { name: 'Pain response', importance: 0.28, direction: 'risk' },
      { name: 'HR normalizing', importance: 0.25, direction: 'protective' },
      { name: 'Age factor', importance: 0.22, direction: 'protective' },
      { name: 'Inflammatory', importance: 0.15, direction: 'risk' },
      { name: 'Vitals stable', importance: 0.10, direction: 'protective' },
    ],
    current_hr: 84, current_sbp: 124, current_o2sat: 98, current_temp: 37.0,
    hr_trend: 'down', sbp_trend: 'stable', o2sat_trend: 'stable', temp_trend: 'down',
    last_updated: now(),
  },
  {
    patient_id: 'P50', bed_number: 11, name: 'Thomas Weber', age: 66, gender: 'M',
    hours_admitted: 48, diagnosis: 'Post-CABG day 2',
    final_score: 0.18, status: 'Stable', action: 'Monitor',
    recommendation: 'Continue cardiac rehab protocol · Monitor chest tubes · Wound care',
    explanation: 'Post-operative course unremarkable; hemodynamically stable',
    predicted_crash_minutes: null, confidence: 0.88,
    triage: { severity: 'Low', confidence: 0.88, top_tokens: ['post-CABG', 'chest pain'] },
    trajectory: { now: 0.18, t15m: 0.17, t30m: 0.17, t1h: 0.16, t4h: 0.14 },
    vitals_history: [
      { hour: -4, hr: 74, o2sat: 97, sbp: 122, temp: 37.0, resp: 16 },
      { hour: -3, hr: 72, o2sat: 97, sbp: 120, temp: 36.9, resp: 16 },
      { hour: -2, hr: 72, o2sat: 98, sbp: 120, temp: 36.9, resp: 15 },
      { hour: -1, hr: 70, o2sat: 98, sbp: 118, temp: 36.8, resp: 15 },
      { hour: 0, hr: 70, o2sat: 98, sbp: 118, temp: 36.8, resp: 15 },
    ],
    shap_features: [
      { name: 'Stable vitals', importance: 0.35, direction: 'protective' },
      { name: 'Recovery trend', importance: 0.30, direction: 'protective' },
      { name: 'Post-surgical', importance: 0.20, direction: 'risk' },
      { name: 'Age moderated', importance: 0.15, direction: 'risk' },
    ],
    current_hr: 70, current_sbp: 118, current_o2sat: 98, current_temp: 36.8,
    hr_trend: 'stable', sbp_trend: 'stable', o2sat_trend: 'stable', temp_trend: 'stable',
    last_updated: now(),
  },
  {
    patient_id: 'P55', bed_number: 12, name: 'Aisha Patel', age: 40, gender: 'F',
    hours_admitted: 5, diagnosis: 'Pulmonary embolism',
    final_score: 0.71, status: 'Critical', action: 'Intervene now',
    recommendation: 'Anticoagulation · CTPA if not done · Consider thrombolysis · O2 therapy',
    explanation: 'Acute hypoxia with tachycardia; PE confirmed on CT',
    predicted_crash_minutes: 135, confidence: 0.89,
    triage: { severity: 'High', confidence: 0.89, top_tokens: ['pleuritic pain', 'dyspnea', 'hemoptysis'] },
    trajectory: { now: 0.65, t15m: 0.67, t30m: 0.69, t1h: 0.73, t4h: 0.78 },
    vitals_history: [
      { hour: -4, hr: 100, o2sat: 93, sbp: 118, temp: 37.1, resp: 22 },
      { hour: -3, hr: 105, o2sat: 92, sbp: 115, temp: 37.2, resp: 24 },
      { hour: -2, hr: 108, o2sat: 91, sbp: 112, temp: 37.2, resp: 26 },
      { hour: -1, hr: 112, o2sat: 90, sbp: 110, temp: 37.3, resp: 28 },
      { hour: 0, hr: 115, o2sat: 89, sbp: 108, temp: 37.3, resp: 30 },
    ],
    shap_features: [
      { name: 'SpO2 dropping', importance: 0.35, direction: 'risk' },
      { name: 'HR rising', importance: 0.28, direction: 'risk' },
      { name: 'Resp rate high', importance: 0.22, direction: 'risk' },
      { name: 'BP declining', importance: 0.15, direction: 'risk' },
    ],
    current_hr: 115, current_sbp: 108, current_o2sat: 89, current_temp: 37.3,
    hr_trend: 'up', sbp_trend: 'down', o2sat_trend: 'down', temp_trend: 'stable',
    last_updated: now(),
  },
]

export const mockAlerts: AlertEntry[] = [
  {
    id: 'a1', patient_id: 'P04', bed_number: 1, patient_name: 'James Morrison',
    risk_score: 0.84, message: 'Deterioration predicted in ~87 min — SpO2 declining, HR elevated',
    level: 'Intervene now', timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    reasons: ['SpO2 dropped 6 points in 4h', 'HR rising beyond 110 bpm', 'BP trending up'],
    predicted_crash_minutes: 87, acknowledged: false,
  },
  {
    id: 'a2', patient_id: 'P55', bed_number: 12, patient_name: 'Aisha Patel',
    risk_score: 0.71, message: 'PE confirmed — acute hypoxia worsening',
    level: 'Intervene now', timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    reasons: ['SpO2 dropped to 89%', 'Tachycardia at 115 bpm', 'Resp rate 30/min'],
    predicted_crash_minutes: 135, acknowledged: false,
  },
  {
    id: 'a3', patient_id: 'P11', bed_number: 2, patient_name: 'Sarah Chen',
    risk_score: 0.76, message: 'Sepsis risk crossed 0.70 threshold',
    level: 'Intervene now', timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    reasons: ['BP dropping below 100 mmHg', 'HR acceleration', 'Fever > 39°C'],
    predicted_crash_minutes: 112, acknowledged: true,
  },
  {
    id: 'a4', patient_id: 'P15', bed_number: 6, patient_name: 'Elena Rodriguez',
    risk_score: 0.65, message: 'Kussmaul breathing pattern — DKA review needed',
    level: 'Doctor review', timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    reasons: ['Resp rate 32/min', 'HR elevated', 'BP declining'],
    predicted_crash_minutes: 180, acknowledged: true,
  },
  {
    id: 'a5', patient_id: 'P40', bed_number: 9, patient_name: 'Michael Foster',
    risk_score: 0.52, message: 'GI bleed — hemodynamic instability developing',
    level: 'Doctor review', timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
    reasons: ['BP declining trend', 'HR compensating', 'Possible hemorrhage'],
    predicted_crash_minutes: 195, acknowledged: true,
  },
  {
    id: 'a6', patient_id: 'P21', bed_number: 7, patient_name: 'Alex Nguyen',
    risk_score: 0.38, message: 'Patient improving — bronchodilator response positive',
    level: 'Monitor', timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    reasons: ['SpO2 improving', 'HR decreasing', 'Resp normalizing'],
    predicted_crash_minutes: null, acknowledged: true,
  },
]

export const mockRecommendations: AIRecommendation[] = [
  { patient_id: 'P04', bed_number: 1, urgency: 'high', actions: ['Check vitals stat', 'Call attending physician', 'Prepare arterial line', 'Repeat ABG now'] },
  { patient_id: 'P55', bed_number: 12, urgency: 'high', actions: ['Initiate anticoagulation', 'O2 therapy escalation', 'Call interventional radiology'] },
  { patient_id: 'P11', bed_number: 2, urgency: 'high', actions: ['Start fluid bolus', 'Blood cultures stat', 'Broad-spectrum antibiotics'] },
  { patient_id: 'P15', bed_number: 6, urgency: 'medium', actions: ['Insulin drip adjustment', 'Hourly glucose check', 'Electrolyte panel'] },
]

export const mockWardSnapshot: WardSnapshot = {
  ward_id: 'ICU Ward 4B',
  timestamp: now(),
  patients: [...mockPatients].sort((a, b) => b.final_score - a.final_score),
  stats: {
    total_beds: 12,
    critical: mockPatients.filter(p => p.status === 'Critical').length,
    risk: mockPatients.filter(p => p.status === 'Risk').length,
    watch: mockPatients.filter(p => p.status === 'Watch').length,
    stable: mockPatients.filter(p => p.status === 'Stable').length,
    avg_lead_time_minutes: 87,
  },
}

// ── Simulation engine ──
export function createSimulationTick(
  patients: Patient[],
  tickIndex: number
): { patients: Patient[]; newAlert: AlertEntry | null } {
  const target = patients.find(p => p.patient_id === 'P07')
  if (!target) return { patients, newAlert: null }

  const t = Math.min(tickIndex, 12)
  const progress = t / 12
  const newScore = parseFloat((0.30 + progress * 0.56).toFixed(2))

  const updatedTarget: Patient = {
    ...target,
    final_score: newScore,
    status: scoreToBedStatus(newScore),
    action: newScore >= 0.70 ? 'Intervene now' : newScore >= 0.35 ? 'Doctor review' : 'Monitor',
    trajectory: {
      now: parseFloat((0.28 + progress * 0.52).toFixed(2)),
      t15m: parseFloat((0.30 + progress * 0.53).toFixed(2)),
      t30m: parseFloat((0.32 + progress * 0.54).toFixed(2)),
      t1h: parseFloat((0.36 + progress * 0.55).toFixed(2)),
      t4h: parseFloat((0.40 + progress * 0.52).toFixed(2)),
    },
    predicted_crash_minutes: progress >= 0.5 ? Math.max(30, Math.round(180 - progress * 150)) : null,
    current_o2sat: Math.max(85, 93 - Math.floor(progress * 8)),
    current_hr: Math.min(140, 90 + Math.floor(progress * 30)),
    o2sat_trend: 'down',
    hr_trend: 'up',
    vitals_history: target.vitals_history.map((v, i) => ({
      ...v,
      o2sat: v.o2sat !== null ? Math.max(85, v.o2sat - Math.floor(progress * 8 * ((i + 1) / 5))) : null,
      hr: v.hr !== null ? Math.min(140, v.hr + Math.floor(progress * 20 * ((i + 1) / 5))) : null,
    })),
    explanation: progress >= 0.7
      ? 'CRITICAL: Rapid SpO2 deterioration with compensatory tachycardia'
      : progress >= 0.4 ? 'SpO2 declining faster than expected; HR compensating' : target.explanation,
    last_updated: new Date().toISOString(),
  }

  let newAlert: AlertEntry | null = null
  const uniqueId = `sim-${t}-${Date.now()}`
  if (t === 4) {
    newAlert = {
      id: uniqueId, patient_id: 'P07', bed_number: 3, patient_name: 'David Patel',
      risk_score: updatedTarget.final_score,
      message: 'SpO2 declining — trend predicts breach in ~2 hours',
      level: 'Doctor review', timestamp: new Date().toISOString(),
      reasons: ['SpO2 trending down', 'HR compensating', 'Resp rate rising'],
      predicted_crash_minutes: 120, acknowledged: false,
    }
  } else if (t === 8) {
    newAlert = {
      id: uniqueId, patient_id: 'P07', bed_number: 3, patient_name: 'David Patel',
      risk_score: updatedTarget.final_score,
      message: 'Deterioration accelerating — risk score crossed 0.60',
      level: 'Doctor review', timestamp: new Date().toISOString(),
      reasons: ['Rapid SpO2 decline', 'Tachycardia developing', 'Pneumonia progression'],
      predicted_crash_minutes: 90, acknowledged: false,
    }
  } else if (t === 11) {
    newAlert = {
      id: uniqueId, patient_id: 'P07', bed_number: 3, patient_name: 'David Patel',
      risk_score: updatedTarget.final_score,
      message: 'CRITICAL — Predicted crash in ~45 min. Escalate immediately.',
      level: 'Intervene now', timestamp: new Date().toISOString(),
      reasons: ['SpO2 below 87%', 'HR above 120 bpm', 'Deterioration accelerating'],
      predicted_crash_minutes: 45, acknowledged: false,
    }
  }

  const updatedPatients = patients
    .map(p => (p.patient_id === 'P07' ? updatedTarget : p))
    .sort((a, b) => b.final_score - a.final_score)

  return { patients: updatedPatients, newAlert }
}

export const mockTriagePatients = [
  {
    id: 'T01', name: 'Robert Vance', age: 72, gender: 'M',
    arrival_time: new Date(Date.now() - 45 * 60000).toISOString(),
    chief_complaint: 'Crushing chest pain radiating to left arm, diaphoretic',
    vitals: { hr: 110, sbp: 165, o2sat: 94, temp: 37.1 },
    triage: { severity: 'High', confidence: 0.95, top_tokens: ['crushing chest pain', 'diaphoretic', 'radiating'] },
    suggested_action: 'Admit to ICU'
  },
  {
    id: 'T02', name: 'Maria Gomez', age: 29, gender: 'F',
    arrival_time: new Date(Date.now() - 110 * 60000).toISOString(),
    chief_complaint: 'Severe abdominal pain RLQ, fever, nausea',
    vitals: { hr: 115, sbp: 110, o2sat: 98, temp: 39.2 },
    triage: { severity: 'High', confidence: 0.88, top_tokens: ['rlq pain', 'fever 39.2', 'rebound tenderness'] },
    suggested_action: 'Admit to ICU'
  },
  {
    id: 'T03', name: 'John Smith', age: 45, gender: 'M',
    arrival_time: new Date(Date.now() - 15 * 60000).toISOString(),
    chief_complaint: 'Shortness of breath on exertion, mild cough',
    vitals: { hr: 88, sbp: 135, o2sat: 96, temp: 37.4 },
    triage: { severity: 'Low', confidence: 0.92, top_tokens: ['mild cough', 'exertional'] },
    suggested_action: 'ED Observation'
  },
  {
    id: 'T04', name: 'Eleanor Vance', age: 64, gender: 'F',
    arrival_time: new Date(Date.now() - 25 * 60000).toISOString(),
    chief_complaint: 'Altered mental status, slurred speech started 1h ago',
    vitals: { hr: 95, sbp: 180, o2sat: 95, temp: 36.8 },
    triage: { severity: 'High', confidence: 0.97, top_tokens: ['altered mental status', 'slurred speech', 'stroke scale'] },
    suggested_action: 'Admit to ICU'
  },
  {
    id: 'T05', name: 'William Chen', age: 52, gender: 'M',
    arrival_time: new Date(Date.now() - 80 * 60000).toISOString(),
    chief_complaint: 'Flank pain, hematuria',
    vitals: { hr: 82, sbp: 140, o2sat: 99, temp: 37.0 },
    triage: { severity: 'Medium', confidence: 0.84, top_tokens: ['flank pain', 'hematuria'] },
    suggested_action: 'Ward Transfer'
  }
]
