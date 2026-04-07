'use client'

import { useState } from 'react'
import { Patient } from '@/types'
import VitalsChart from '@/components/VitalsChart'
import TrajectoryChart from '@/components/TrajectoryChart'
import ShapBar from '@/components/ShapBar'
import { motion, AnimatePresence } from 'framer-motion'

export default function PatientDetailedTabs({ patient }: { patient: Patient }) {
  const [activeTab, setActiveTab] = useState<'vitals' | 'trajectory' | 'ai'>('vitals')

  const tabs = [
    { id: 'vitals', label: 'Vitals History' },
    { id: 'trajectory', label: 'Risk Trajectory' },
    { id: 'ai', label: 'AI Diagnostics' },
  ] as const

  return (
    <div className="flex flex-col flex-1 h-full min-h-[500px]">
      {/* Tab Header Strip */}
      <div className="flex gap-1 border-b border-cyan-900/30 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-wider transition-colors relative ${
              activeTab === tab.id ? 'text-cyan-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 height-[2px] border-b-2 border-cyan-400"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="relative flex-1 bg-[rgba(2,6,23,0.2)] border border-[rgba(202,240,248,0.05)] rounded-2xl p-6 backdrop-blur-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {activeTab === 'vitals' && (
              <div className="w-full h-full min-h-[400px]">
                <VitalsChart vitals={patient.vitals_history} />
              </div>
            )}
            {activeTab === 'trajectory' && (
              <div className="w-full h-full min-h-[400px]">
                <TrajectoryChart trajectory={patient.trajectory} currentScore={patient.final_score} />
              </div>
            )}
            {activeTab === 'ai' && (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-wider mb-4">SHAP Explainability Vectors</h3>
                  <ShapBar features={patient.shap_features} />
                </div>
                <div className="w-px bg-cyan-900/30 hidden md:block" />
                <div className="flex-1">
                  <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-wider mb-4">AI Suggested Interventions</h3>
                  <div className="flex flex-col gap-3">
                    {patient.recommendation.split(' · ').map((action, i) => (
                      <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-800/50">
                        <span className="w-6 h-6 rounded-full bg-cyan-900/40 text-cyan-500 flex items-center justify-center text-xs font-black">{i + 1}</span>
                        <span className="text-white text-sm font-semibold">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
