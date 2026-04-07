'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ICUFloorMap from './PriorityQueue'
import Sidebar from './WardAnalytics'
import AlertPopup from './AlertPopup'
import { useWardState } from '@/hooks/useWardState'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const {
    snapshot,
    alerts,
    filteredPatients,
    searchQuery,
    setSearchQuery,
    riskFilter,
    setRiskFilter,
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

        {/* Clean Unified Stats Block */}
        <div className="flex gap-6 items-center px-6 py-2 ml-4 rounded-full border border-cyan-500/20 bg-cyan-900/10">
          <div className="flex flex-col items-center">
            <span className="text-white font-black text-lg leading-tight">{snapshot.stats.total_beds}</span>
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Total</span>
          </div>
          <div className="w-[1px] h-8 bg-cyan-500/20" />
          <div className="flex flex-col items-center">
            <span className="text-[var(--color-critical)] font-black text-lg leading-tight drop-shadow-[0_0_10px_rgba(0,119,182,0.8)]">{snapshot.stats.critical}</span>
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Critical</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[var(--color-risk)] font-black text-lg leading-tight">{snapshot.stats.risk}</span>
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Risk</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[var(--color-stable)] font-black text-lg leading-tight">{snapshot.stats.stable}</span>
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Stable</span>
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

          {/* Live indicator & Triage */}
          <div className="flex items-center gap-4">
            <Link href="/triage" className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[var(--color-critical)] text-white font-bold uppercase tracking-wider text-[10px] rounded hover:bg-[var(--glass-red)] hover:border-[var(--glass-red-border)] border border-transparent transition shadow-[var(--color-critical-glow)]">
              Triage Queue &rarr;
            </Link>
            <div className="header__live">
              <motion.span
                className="header__live-dot"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>{isSimulating ? 'Simulating' : 'Live'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <div className="main">
        {/* ICU Floor Map */}
        <div className="main__floor">
          <ICUFloorMap
            patients={filteredPatients}
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
          onViewPatient={(id) => router.push(`/patient/${id}`)}
        />
      </div>

      {/* ─── Alert Popup Modal ─── */}
      <AlertPopup
        alert={activeAlert}
        onAcknowledge={acknowledgeAlert}
        onViewPatient={(id) => { dismissAlert(); router.push(`/patient/${id}`) }}
        onDismiss={dismissAlert}
      />
    </div>
  )
}
