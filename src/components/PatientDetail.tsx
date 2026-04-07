'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Patient } from '@/types'
import { statusColors, formatCrashTime } from '@/lib/utils'
import VitalsChart from './VitalsChart'
import TrajectoryChart from './TrajectoryChart'
import ShapBar from './ShapBar'

interface PatientDrawerProps {
  patient: Patient | null
  isOpen: boolean
  onClose: () => void
}

function TrendArrow({ direction, value, unit }: { direction: 'up' | 'down' | 'stable'; value: number; unit: string }) {
  const arrowClass = direction === 'up' ? 'trend-up' : direction === 'down' ? 'trend-down' : 'trend-stable'
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→'
  return (
    <div className={`drawer-vital ${arrowClass}`}>
      <span className="drawer-vital__value">{value}</span>
      <span className="drawer-vital__unit">{unit}</span>
      <span className="drawer-vital__arrow">{arrow}</span>
    </div>
  )
}

export default function PatientDrawer({ patient, isOpen, onClose }: PatientDrawerProps) {
  if (!patient) return null
  const colors = statusColors[patient.status]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Close button */}
            <button className="drawer__close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="drawer__scroll">
              {/* ─── Top Section ─── */}
              <div className="drawer__top" style={{ borderBottomColor: colors.border }}>
                <div className="drawer__patient-header">
                  <div>
                    <h2 className="drawer__patient-name">{patient.name}</h2>
                    <p className="drawer__patient-meta">
                      Bed {patient.bed_number} · {patient.age}y {patient.gender === 'M' ? 'Male' : 'Female'} · {patient.hours_admitted}h admitted
                    </p>
                    <p className="drawer__diagnosis">{patient.diagnosis}</p>
                  </div>
                  <div className="drawer__risk-score" style={{ borderColor: colors.dot }}>
                    <span className="drawer__risk-value" style={{ color: colors.text }}>{Math.round(patient.final_score * 100)}%</span>
                    <span className="drawer__risk-label">Risk</span>
                  </div>
                </div>

                <div className="drawer__badges">
                  <span className="drawer__status-badge" style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}>
                    {patient.status}
                  </span>
                  {patient.predicted_crash_minutes !== null && (
                    <span className="drawer__crash-badge">
                      ⏱ Predicted crash: {formatCrashTime(patient.predicted_crash_minutes)}
                    </span>
                  )}
                  <span className="drawer__confidence-badge">
                    Confidence: {Math.round(patient.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* ─── Live Vitals ─── */}
              <div className="drawer__section">
                <h3 className="drawer__section-title">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 8h2l2-5 3 10 2-5h5" stroke="var(--color-watch)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Live Vitals
                </h3>
                <div className="drawer__vitals-grid">
                  <div className="drawer-vital-card">
                    <span className="drawer-vital-card__icon">❤️</span>
                    <span className="drawer-vital-card__label">Heart Rate</span>
                    <TrendArrow direction={patient.hr_trend} value={patient.current_hr} unit="bpm" />
                  </div>
                  <div className="drawer-vital-card">
                    <span className="drawer-vital-card__icon">🩸</span>
                    <span className="drawer-vital-card__label">Blood Pressure</span>
                    <TrendArrow direction={patient.sbp_trend} value={patient.current_sbp} unit="mmHg" />
                  </div>
                  <div className="drawer-vital-card">
                    <span className="drawer-vital-card__icon">🫁</span>
                    <span className="drawer-vital-card__label">SpO2</span>
                    <TrendArrow direction={patient.o2sat_trend} value={patient.current_o2sat} unit="%" />
                  </div>
                  <div className="drawer-vital-card">
                    <span className="drawer-vital-card__icon">🌡️</span>
                    <span className="drawer-vital-card__label">Temperature</span>
                    <TrendArrow direction={patient.temp_trend} value={patient.current_temp} unit="°C" />
                  </div>
                </div>
              </div>

              {/* ─── Vitals Chart ─── */}
              <div className="drawer__section">
                <VitalsChart vitals={patient.vitals_history} />
              </div>

              {/* ─── Risk Trajectory ─── */}
              <div className="drawer__section">
                <TrajectoryChart trajectory={patient.trajectory} currentScore={patient.final_score} />
              </div>

              {/* ─── Explainability ─── */}
              <div className="drawer__section">
                <ShapBar features={patient.shap_features} />
                <div className="drawer__explanation-box">
                  <p>{patient.explanation}</p>
                </div>
              </div>

              {/* ─── AI Suggested Actions ─── */}
              <div className="drawer__section">
                <h3 className="drawer__section-title">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="var(--color-watch)" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  AI Suggested Actions
                </h3>
                <div className="drawer__actions">
                  {patient.recommendation.split(' · ').map((action, i) => (
                    <button key={i} className="drawer__action-btn">
                      <span className="drawer__action-number">{i + 1}</span>
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
