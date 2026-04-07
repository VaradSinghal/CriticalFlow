'use client'

import { motion } from 'framer-motion'
import ICUFloorMap from './PriorityQueue'
import PatientDrawer from './PatientDetail'
import Sidebar from './WardAnalytics'
import AlertPopup from './AlertPopup'
import { useWardState } from '@/hooks/useWardState'

export default function Dashboard() {
  const {
    snapshot,
    alerts,
    selectedPatient,
    selectedPatientId,
    filteredPatients,
    searchQuery,
    setSearchQuery,
    riskFilter,
    setRiskFilter,
    openDrawer,
    closeDrawer,
    isSimulating,
    startSimulation,
    stopSimulation,
    activeAlert,
    dismissAlert,
    acknowledgeAlert,
    recommendations,
  } = useWardState()

  const highestRisk = snapshot.patients[0]

  return (
    <div className="dashboard">
      {/* ─── Top Header ─── */}
      <header className="header">
        <div className="header__brand">
          <div className="header__logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="url(#hdrGrad)" strokeWidth="2" />
              <path d="M9 16h3l2.5-6 4 12 2.5-6H24" stroke="url(#hdrGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="hdrGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="var(--color-watch)" />
                  <stop offset="1" stopColor="var(--color-risk)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="header__title">CriticalFlow</h1>
            <p className="header__ward">{snapshot.ward_id}</p>
          </div>
        </div>

        {/* Stats pills */}
        <div className="header__stats">
          <div className="header__pill header__pill--total">
            <span className="header__pill-value">{snapshot.stats.total_beds}</span>
            <span className="header__pill-label">Total Beds</span>
          </div>
          <div className="header__pill header__pill--critical">
            <span className="header__pill-value">{snapshot.stats.critical}</span>
            <span className="header__pill-label">Critical</span>
          </div>
          <div className="header__pill header__pill--risk">
            <span className="header__pill-value">{snapshot.stats.risk}</span>
            <span className="header__pill-label">At Risk</span>
          </div>
          <div className="header__pill header__pill--watch">
            <span className="header__pill-value">{snapshot.stats.watch}</span>
            <span className="header__pill-label">Watch</span>
          </div>
          <div className="header__pill header__pill--stable">
            <span className="header__pill-value">{snapshot.stats.stable}</span>
            <span className="header__pill-label">Stable</span>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="header__controls">
          <div className="header__search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="var(--text-muted)" strokeWidth="1.5" />
              <path d="M11 11l3.5 3.5" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search patient..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="header__search-input"
            />
          </div>
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="header__filter"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical</option>
            <option value="risk">Risk</option>
            <option value="watch">Watch</option>
            <option value="stable">Stable</option>
          </select>

          {/* Live indicator */}
          <div className="header__live">
            <motion.span
              className="header__live-dot"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>{isSimulating ? 'Simulating' : 'Live'}</span>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <div className="main">
        {/* ICU Floor Map */}
        <div className="main__floor">
          <ICUFloorMap
            patients={filteredPatients}
            onSelectBed={openDrawer}
          />
        </div>

        {/* Right Sidebar */}
        <Sidebar
          alerts={alerts}
          recommendations={recommendations}
          highestRiskPatientName={highestRisk?.name ?? '—'}
          highestRiskScore={highestRisk?.final_score ?? 0}
          highestRiskBed={highestRisk?.bed_number ?? 0}
          isSimulating={isSimulating}
          onSimulate={startSimulation}
          onStopSimulation={stopSimulation}
          onViewPatient={openDrawer}
        />
      </div>

      {/* ─── Patient Drawer (slides in from right) ─── */}
      <PatientDrawer
        patient={selectedPatient}
        isOpen={!!selectedPatientId}
        onClose={closeDrawer}
      />

      {/* ─── Alert Popup Modal ─── */}
      <AlertPopup
        alert={activeAlert}
        onAcknowledge={acknowledgeAlert}
        onViewPatient={(id) => { dismissAlert(); openDrawer(id) }}
        onDismiss={dismissAlert}
      />
    </div>
  )
}
