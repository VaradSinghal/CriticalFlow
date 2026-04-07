'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertEntry } from '@/types'
import { statusColors, formatTimeAgo, formatCrashTime } from '@/lib/utils'

interface AlertPopupProps {
  alert: AlertEntry | null
  onAcknowledge: (id: string) => void
  onViewPatient: (id: string) => void
  onDismiss: () => void
}

export default function AlertPopup({ alert, onAcknowledge, onViewPatient, onDismiss }: AlertPopupProps) {
  return (
    <AnimatePresence>
      {alert && !alert.acknowledged && (
        <motion.div
          className="alert-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="alert-popup"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Pulse border */}
            <motion.div
              className="alert-popup__pulse-border"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Header */}
            <div className="alert-popup__header">
              <div className="alert-popup__icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 3L25 24H3L14 3Z" stroke="var(--color-critical)" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M14 10v6M14 20h.01" stroke="var(--color-critical)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="alert-popup__title">Critical Alert</h3>
                <p className="alert-popup__subtitle">
                  Bed {alert.bed_number} · {alert.patient_name}
                </p>
              </div>
              <div className="alert-popup__score">
                {Math.round(alert.risk_score * 100)}%
              </div>
            </div>

            {/* Message */}
            <p className="alert-popup__message">{alert.message}</p>

            {/* Crash time */}
            {alert.predicted_crash_minutes !== null && (
              <div className="alert-popup__crash">
                ⏱ Predicted deterioration in <strong>{formatCrashTime(alert.predicted_crash_minutes)}</strong>
              </div>
            )}

            {/* Reasons */}
            <div className="alert-popup__reasons">
              <span className="alert-popup__reasons-title">Top Contributing Factors:</span>
              <ol className="alert-popup__reasons-list">
                {alert.reasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="alert-popup__actions">
              <button
                className="alert-popup__btn alert-popup__btn--primary"
                onClick={() => { onAcknowledge(alert.id); onViewPatient(alert.patient_id) }}
              >
                View Patient
              </button>
              <button
                className="alert-popup__btn alert-popup__btn--secondary"
                onClick={() => onAcknowledge(alert.id)}
              >
                Acknowledge
              </button>
              <button
                className="alert-popup__btn alert-popup__btn--ghost"
                onClick={onDismiss}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
