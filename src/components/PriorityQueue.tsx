'use client'

import { Patient } from '@/types'
import BedCard from './PatientCard'

interface PriorityQueueProps {
  patients: Patient[]
}

export default function ICUFloorMap({ patients }: PriorityQueueProps) {
  // Create a 12-bed grid: 4 columns x 3 rows, with nurse station in center
  const allBeds = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <section className="floor-map">
      <div className="floor-map__header">
        <h2 className="floor-map__title">ICU Floor Map</h2>
        <div className="floor-map__legend">
          <span className="floor-map__legend-item">
            <span className="floor-map__legend-dot" style={{ background: 'var(--color-stable)' }} />Stable
          </span>
          <span className="floor-map__legend-item">
            <span className="floor-map__legend-dot" style={{ background: 'var(--color-watch)' }} />Watch
          </span>
          <span className="floor-map__legend-item">
            <span className="floor-map__legend-dot" style={{ background: 'var(--color-risk)' }} />Risk
          </span>
          <span className="floor-map__legend-item">
            <span className="floor-map__legend-dot" style={{ background: 'var(--color-critical)' }} />Critical
          </span>
        </div>
      </div>

      <div className="floor-map__layout">
        {/* Top row: beds 1-4 */}
        <div className="floor-map__row">
          {allBeds.slice(0, 4).map((bedNum, i) => {
            const patient = patients.find(p => p.bed_number === bedNum)
            if (!patient) return <div key={bedNum} className="floor-map__empty-bed">Bed {bedNum}<br />Empty</div>
            return (
              <BedCard
                key={patient.patient_id}
                patient={patient}
                index={i}
              />
            )
          })}
        </div>

        {/* Center: nurse station + door markers */}
        <div className="floor-map__center">
          <div className="floor-map__corridor">
            <div className="floor-map__door">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="2" width="10" height="12" rx="1" stroke="var(--color-risk)" strokeWidth="1" opacity="0.4" />
                <circle cx="11" cy="8" r="1" fill="var(--color-risk)" opacity="0.4" />
              </svg>
              <span>Entry</span>
            </div>
            <div className="floor-map__nurse-station">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="6" width="16" height="10" rx="2" stroke="var(--color-watch)" strokeWidth="1.2" />
                <path d="M7 6V4a3 3 0 016 0v2" stroke="var(--color-watch)" strokeWidth="1.2" />
                <path d="M10 9v4M8 11h4" stroke="var(--color-watch)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span>Nurse Station</span>
            </div>
            <div className="floor-map__door">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="2" width="10" height="12" rx="1" stroke="var(--color-risk)" strokeWidth="1" opacity="0.4" />
                <circle cx="11" cy="8" r="1" fill="var(--color-risk)" opacity="0.4" />
              </svg>
              <span>Exit</span>
            </div>
          </div>
        </div>

        {/* Middle row: beds 5-8 */}
        <div className="floor-map__row">
          {allBeds.slice(4, 8).map((bedNum, i) => {
            const patient = patients.find(p => p.bed_number === bedNum)
            if (!patient) return <div key={bedNum} className="floor-map__empty-bed">Bed {bedNum}<br />Empty</div>
            return (
              <BedCard
                key={patient.patient_id}
                patient={patient}
                index={i + 4}
              />
            )
          })}
        </div>

        {/* Bottom row: beds 9-12 */}
        <div className="floor-map__row">
          {allBeds.slice(8, 12).map((bedNum, i) => {
            const patient = patients.find(p => p.bed_number === bedNum)
            if (!patient) return <div key={bedNum} className="floor-map__empty-bed">Bed {bedNum}<br />Empty</div>
            return (
              <BedCard
                key={patient.patient_id}
                patient={patient}
                index={i + 8}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
