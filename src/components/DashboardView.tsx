'use client'

import React from 'react'
import { motion } from 'framer-motion'
import PatientPriorityTable from './PatientPriorityTable'
import PatientDetail from './PatientDetail'
import WardAnalytics from './WardAnalytics'
import { Patient } from '@/types'
import { AlertLogEntry } from '@/lib/mock-data'

interface DashboardViewProps {
  patients: Patient[]
  selectedPatient: Patient | null
  selectPatient: (id: string) => void
  alerts: AlertLogEntry[]
  isSimulating: boolean
  startSimulation: () => void
}

export default function DashboardView({
  patients,
  selectedPatient,
  selectPatient,
  alerts,
  isSimulating,
  startSimulation
}: DashboardViewProps) {
  return (
    <div className="flex gap-16 p-16 h-fit min-h-full max-w-[1800px] mx-auto">
      {/* Left Column: Priority Table (Main Content) - Give it a strong min-width */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-[4] min-w-[800px] flex flex-col gap-16"
      >
        <section className="bg-surface-container-lowest rounded-[3.5rem] p-14 panel-shadow border border-outline-variant/10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-headline font-black text-2xl text-on-surface tracking-tight">
              Patient Priority Queue
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-1">Sorted By</span>
                <span className="text-sm font-bold text-primary flex items-center gap-1 cursor-pointer hover:text-primary-container transition-colors">
                  Risk Level <span className="material-symbols-outlined text-lg">expand_more</span>
                </span>
              </div>
            </div>
          </div>
          
          <PatientPriorityTable 
            patients={patients} 
            selectedId={selectedPatient?.patient_id} 
            onSelect={selectPatient} 
          />
        </section>

        {/* Selected Patient Detail */}
        {selectedPatient && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background"
          >
            <PatientDetail patient={selectedPatient} />
          </motion.section>
        )}
      </motion.div>

      {/* Right Column: Ward Context & Alerts - Also give it a stable min-width */}
      <motion.aside 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 min-w-[360px] flex flex-col gap-12 h-fit"
      >
        <WardAnalytics 
          alerts={alerts} 
          isSimulating={isSimulating} 
          onSimulate={startSimulation}
          selectedPatient={selectedPatient || undefined}
        />
      </motion.aside>
    </div>
  )
}
