'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertEntry, AIRecommendation } from '@/types'
import { formatTimeAgo, formatCrashTime, statusColors } from '@/lib/utils'

interface SidebarProps {
  alerts: AlertEntry[]
  recommendations: AIRecommendation[]
  highestRiskPatientName: string
  highestRiskScore: number
  highestRiskBed: number
  isSimulating: boolean
  onSimulate: () => void
  onStopSimulation: () => void
  onViewPatient: (id: string) => void
}

export default function Sidebar({
  alerts, recommendations, highestRiskPatientName, highestRiskScore, highestRiskBed,
  isSimulating, onSimulate, onStopSimulation, onViewPatient,
}: SidebarProps) {
  const unacknowledged = alerts.filter(a => !a.acknowledged).length

  return (
    <aside className="sidebar">
      {/* Active Alerts */}
      <div className="sidebar__section">
        <h3 className="sidebar__section-title">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 12H1L7 1Z" stroke="var(--color-watch)" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M7 5v3M7 10h.01" stroke="var(--color-watch)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Active Alerts
          {unacknowledged > 0 && (
            <span className="sidebar__badge">{unacknowledged}</span>
          )}
        </h3>
        <div className="sidebar__alerts">
          <AnimatePresence initial={false}>
            {alerts.slice(0, 6).map((alert) => {
              const isUrgent = alert.level === 'Intervene now'
              return (
                <motion.div
                  key={alert.id}
                  className={`sidebar__alert ${alert.acknowledged ? 'sidebar__alert--acked' : ''} ${isUrgent ? 'sidebar__alert--urgent' : ''}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  layout
                >
                  <div className="sidebar__alert-header">
                    <span className="sidebar__alert-dot" style={{ background: isUrgent ? 'var(--color-critical)' : alert.level === 'Doctor review' ? 'var(--color-watch)' : 'var(--color-stable)' }} />
                    <span className="sidebar__alert-bed">Bed {alert.bed_number}</span>
                    <span className="sidebar__alert-time">{formatTimeAgo(alert.timestamp)}</span>
                  </div>
                  <p className="sidebar__alert-msg">{alert.message}</p>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Highest Risk Patient */}
      <div className="sidebar__section">
        <h3 className="sidebar__section-title">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="var(--color-critical)" strokeWidth="1.2" />
            <path d="M7 4v3M7 9h.01" stroke="var(--color-critical)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Highest Risk
        </h3>
        <div className="sidebar__highest-risk">
          <div className="sidebar__hr-score">{Math.round(highestRiskScore * 100)}%</div>
          <div>
            <p className="sidebar__hr-name">{highestRiskPatientName}</p>
            <p className="sidebar__hr-bed">Bed {highestRiskBed}</p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="sidebar__section">
        <h3 className="sidebar__section-title">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.76 2.76l1.41 1.41M9.83 9.83l1.41 1.41M2.76 11.24l1.41-1.41M9.83 4.17l1.41-1.41" stroke="var(--color-watch)" strokeWidth="1" strokeLinecap="round" />
          </svg>
          AI Recommendations
        </h3>
        <div className="sidebar__recommendations">
          {recommendations.slice(0, 3).map((rec) => (
            <div key={rec.patient_id} className={`sidebar__rec sidebar__rec--${rec.urgency}`}>
              <div className="sidebar__rec-header">
                <span className="sidebar__rec-bed">Bed {rec.bed_number}</span>
                <span className={`sidebar__rec-urgency sidebar__rec-urgency--${rec.urgency}`}>
                  {rec.urgency}
                </span>
              </div>
              <ul className="sidebar__rec-actions">
                {rec.actions.slice(0, 3).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Simulate button */}
      <motion.button
        className={`sidebar__simulate ${isSimulating ? 'sidebar__simulate--active' : ''}`}
        onClick={isSimulating ? onStopSimulation : onSimulate}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSimulating ? (
          <>
            <motion.span
              className="sidebar__simulate-dot"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            Stop Simulation
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 1l10 6-10 6V1z" fill="currentColor" />
            </svg>
            Simulate Ward
          </>
        )}
      </motion.button>
    </aside>
  )
}
