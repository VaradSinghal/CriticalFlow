'use client'

import React, { useState } from 'react'
import { useWardState } from '@/hooks/useWardState'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import DashboardView from './DashboardView'
import PatientsView from './PatientsView'
import AlertsView from './AlertsView'
import AnalyticsView from './AnalyticsView'
import { AnimatePresence, motion } from 'framer-motion'

export type ViewType = 'dashboard' | 'patients' | 'alerts' | 'analytics'

export default function Dashboard() {
  const { 
    snapshot, 
    alerts, 
    selectedPatient, 
    selectPatient, 
    isSimulating, 
    startSimulation 
  } = useWardState()
  
  const [activeView, setActiveView] = useState<ViewType>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  if (!snapshot) return null

  // Filter patients based on search
  const filteredPatients = snapshot.patients.filter(p => 
    p.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.gender.toLowerCase().startsWith(searchQuery.toLowerCase())
  )

  const viewTitles: Record<ViewType, string> = {
    dashboard: 'Unit Dashboard Overview',
    patients: 'Patient Directory',
    alerts: 'Clinical Alert Feed',
    analytics: 'Ward Performance Analytics'
  }

  const handleSelectPatient = (id: string) => {
    selectPatient(id)
    if (activeView !== 'dashboard') {
      setActiveView('dashboard')
    }
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <TopBar title={viewTitles[activeView]} onSearch={setSearchQuery} />

        <div className="flex-1 overflow-auto custom-scrollbar relative px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full w-full"
            >
              {activeView === 'dashboard' && (
                <DashboardView 
                  patients={filteredPatients}
                  selectedPatient={selectedPatient}
                  selectPatient={selectPatient}
                  alerts={alerts}
                  isSimulating={isSimulating}
                  startSimulation={startSimulation}
                />
              )}

              {activeView === 'patients' && (
                <PatientsView 
                  patients={filteredPatients}
                  onSelect={handleSelectPatient}
                />
              )}

              {activeView === 'alerts' && (
                <AlertsView alerts={alerts} />
              )}

              {activeView === 'analytics' && (
                <AnalyticsView snapshot={snapshot} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
