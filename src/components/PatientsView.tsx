'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Patient } from '@/types'

interface PatientsViewProps {
  patients: Patient[]
  onSelect: (id: string) => void
}

export default function PatientsView({ patients, onSelect }: PatientsViewProps) {
  const [filter, setFilter] = useState('All')

  const filtered = patients.filter(p => 
    filter === 'All' || p.action === filter
  )

  return (
    <div className="p-16 h-full overflow-y-auto custom-scrollbar flex flex-col gap-14 max-w-[1800px] mx-auto">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h2 className="font-headline font-black text-4xl text-on-surface tracking-tighter mb-2">Ward Census</h2>
          <p className="text-on-surface-variant font-medium opacity-60">Directory of all admitted patients and current status.</p>
        </div>
        <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/20">
          {['All', 'Monitor', 'Review', 'Intervene now'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === tab ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((patient) => (
          <motion.div
            layout
            key={patient.patient_id}
            onClick={() => onSelect(patient.patient_id)}
            className="bg-surface-container-lowest p-8 rounded-[2rem] panel-shadow border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline font-black text-xl text-on-surface leading-tight">#PT-{patient.patient_id.replace('P', '')}</h3>
                <p className="text-xs font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">{patient.gender}, {patient.age}y</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[0.6rem] font-black tracking-widest ${
                patient.color === 'RED' ? 'bg-tertiary-container text-on-tertiary-container' : 
                patient.color === 'AMBER' ? 'bg-secondary-container text-on-secondary-container' : 
                'bg-primary-fixed/50 text-on-primary-fixed'
              }`}>
                {patient.action.toUpperCase()}
              </span>
            </div>

            <p className="text-sm font-medium text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">
              {patient.diagnosis} — {patient.explanation.split('.')[0]}.
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-outline-variant/5">
              <div className="flex flex-col">
                <span className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-1">Risk Score</span>
                <span className={`text-xl font-headline font-black ${patient.color === 'RED' ? 'text-tertiary' : 'text-primary'}`}>
                  {patient.final_score.toFixed(2)}
                </span>
              </div>
              <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                arrow_forward
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
