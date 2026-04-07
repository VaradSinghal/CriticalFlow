'use client'

import { motion } from 'framer-motion'
import { Patient } from '@/types'
import { statusColors, formatCrashTime } from '@/lib/utils'

interface BedCardProps {
  patient: Patient
  onClick: () => void
  index: number
}

function TrendArrow({ direction }: { direction: 'up' | 'down' | 'stable' }) {
  if (direction === 'up') return <span className="trend-arrow trend-arrow--up">↑</span>
  if (direction === 'down') return <span className="trend-arrow trend-arrow--down">↓</span>
  return <span className="trend-arrow trend-arrow--stable">→</span>
}

export default function BedCard({ patient, onClick, index }: BedCardProps) {
  const colors = statusColors[patient.status]
  const riskPercent = Math.round(patient.final_score * 100)
  const isCritical = patient.status === 'Critical'

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bed-card"
      style={{
        '--bed-glow': isCritical ? colors.glow : 'none',
        '--bed-border': colors.border,
        '--bed-dot': colors.dot,
      } as React.CSSProperties}
    >
      {/* Critical pulse ring */}
      {isCritical && (
        <motion.div
          className="bed-card__pulse-ring"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Header: bed number + status */}
      <div className="bed-card__header">
        <span className="bed-card__bed-number">Bed {patient.bed_number}</span>
        <span className="bed-card__status" style={{ color: colors.text, background: colors.bg, borderColor: colors.border }}>
          {patient.status}
        </span>
      </div>

      {/* Patient avatar + name */}
      <div className="bed-card__patient">
        <div className="bed-card__avatar" style={{ borderColor: colors.dot }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="4" stroke={colors.dot} strokeWidth="1.5" />
            <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={colors.dot} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span className="bed-card__name">{patient.name.split(' ')[0]}</span>
      </div>

      {/* Risk percentage */}
      <div className="bed-card__risk">
        <div className="bed-card__risk-ring">
          <svg viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(144,224,239,0.1)" strokeWidth="3" />
            <circle
              cx="22" cy="22" r="18" fill="none"
              stroke={colors.dot}
              strokeWidth="3"
              strokeDasharray={`${(riskPercent / 100) * 113.1} 113.1`}
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          </svg>
          <span className="bed-card__risk-text" style={{ color: colors.text }}>{riskPercent}%</span>
        </div>
      </div>

      {/* Crash time */}
      {patient.predicted_crash_minutes !== null && (
        <div className="bed-card__crash">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke={colors.text} strokeWidth="1" opacity="0.6" />
            <path d="M6 3v3.5l2 1" stroke={colors.text} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          </svg>
          <span style={{ color: colors.text }}>{formatCrashTime(patient.predicted_crash_minutes)}</span>
        </div>
      )}

      {/* Mini vitals */}
      <div className="bed-card__vitals">
        <span className="bed-card__vital">
          <span className="bed-card__vital-label">HR</span>
          <TrendArrow direction={patient.hr_trend} />
        </span>
        <span className="bed-card__vital">
          <span className="bed-card__vital-label">BP</span>
          <TrendArrow direction={patient.sbp_trend} />
        </span>
        <span className="bed-card__vital">
          <span className="bed-card__vital-label">O2</span>
          <TrendArrow direction={patient.o2sat_trend} />
        </span>
      </div>
    </motion.button>
  )
}
