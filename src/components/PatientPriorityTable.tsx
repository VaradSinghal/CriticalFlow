'use client'

import React from 'react'
import { Patient } from '@/types'

interface PatientPriorityTableProps {
  patients: Patient[]
  selectedId?: string
  onSelect: (id: string) => void
}

export default function PatientPriorityTable({ patients, selectedId, onSelect }: PatientPriorityTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[0.75rem] text-on-surface-variant/60 uppercase tracking-widest font-extrabold border-b border-outline-variant/10">
            <th className="pb-5 px-4 font-headline">Patient ID</th>
            <th className="pb-5 px-4 font-headline text-center">Age</th>
            <th className="pb-5 px-4 font-headline">Triage Level</th>
            <th className="pb-5 px-4 font-headline">ICU Risk Score</th>
            <th className="pb-5 px-4 font-headline">Final Status</th>
            <th className="pb-5 px-4 font-headline text-right">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {patients.map((patient) => {
            const isSelected = selectedId === patient.patient_id
            const isCritical = patient.color === 'RED'
            
            return (
              <tr 
                key={patient.patient_id}
                onClick={() => onSelect(patient.patient_id)}
                className={`group transition-all duration-200 cursor-pointer border-b border-outline-variant/5 ${
                  isSelected ? 'bg-primary/5' : 'hover:bg-surface-container-low/50'
                }`}
              >
                <td className="py-5 px-4 font-bold text-on-surface">#PT-{patient.patient_id.replace('P', '')}</td>
                <td className="py-5 px-4 text-on-surface-variant font-medium text-center">{patient.age}</td>
                <td className="py-5 px-4">
                  <span className={`px-4 py-1.5 rounded-lg text-[0.7rem] font-black tracking-tight ${
                    patient.triage_severity === 'High' 
                      ? 'bg-tertiary-container text-on-tertiary-container shadow-sm' 
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {patient.triage_severity.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${isCritical ? 'bg-tertiary' : 'bg-primary'}`} 
                        style={{ width: `${patient.final_score * 100}%` }}
                      ></div>
                    </div>
                    <span className={`font-bold ${isCritical ? 'text-tertiary' : ''}`}>
                      {patient.final_score.toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span className={`${isCritical ? 'text-tertiary' : 'text-primary'} font-bold flex items-center gap-1`}>
                    <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-tertiary animate-pulse' : 'bg-primary'}`}></span>
                    {patient.action}
                  </span>
                </td>
                <td className="py-4 px-2 text-primary font-bold text-xs uppercase tracking-tighter text-right">
                  {isSelected ? 'Selected' : <span className="opacity-0 group-hover:opacity-100 transition-opacity">View Detail</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
