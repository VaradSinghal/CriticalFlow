'use client'

import React from 'react'
import { Patient } from '@/types'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from 'recharts'

interface PatientDetailProps {
  patient: Patient
}

export default function PatientDetail({ patient }: PatientDetailProps) {
  // Sparklines data
  const sparkHR = patient.vitals_sparkline.HR.map((v, i) => ({ t: i, v }))
  const sparkO2 = patient.vitals_sparkline.O2Sat.map((v, i) => ({ t: i, v }))
  const sparkSBP = patient.vitals_sparkline.SBP.map((v, i) => ({ t: i, v }))

  // Trajectory data
  const trajData = [
    { label: 'Now', risk: patient.trajectory.now },
    { label: '+1h', risk: patient.trajectory.t1h },
    { label: '+2h', risk: patient.trajectory.t2h },
    { label: '+4h', risk: patient.trajectory.t4h },
  ]

  const isCritical = patient.color === 'RED'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-headline font-bold text-xl text-on-surface">
            Detail: #PT-{patient.patient_id.replace('P', '')}
          </h2>
          <div className="flex gap-2">
            <span className="bg-surface-container-high px-3 py-1 rounded text-xs font-medium text-on-surface-variant">
              {patient.gender === 'M' ? 'Male' : 'Female'}
            </span>
            <span className="bg-surface-container-high px-3 py-1 rounded text-xs font-medium text-on-surface-variant">
              ICU Bed 12
            </span>
            <span className="bg-surface-container-high px-3 py-1 rounded text-xs font-medium text-on-surface-variant">
              {patient.age}y
            </span>
          </div>
        </div>
        <button className="text-primary font-bold text-sm flex items-center gap-1 hover:text-primary-container transition-colors">
          Expand Timeline <span className="material-symbols-outlined text-lg">open_in_full</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Vital Signs Chart */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-widest opacity-60">
              Vital Signs (Recent Stats)
            </h3>
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              monitor_heart
            </span>
          </div>
          
          <div className="space-y-8">
            <SparklineRow 
              label="Heart Rate" 
              value={patient.vitals_sparkline.HR.at(-1)!} 
              unit="bpm" 
              data={sparkHR} 
              color="#00478d" 
              isWarning={patient.vitals_sparkline.HR.at(-1)! > 100}
            />
            <div className="border-t border-outline-variant/10 pt-6">
              <SparklineRow 
                label="SpO2" 
                value={patient.vitals_sparkline.O2Sat.at(-1)!} 
                unit="%" 
                data={sparkO2} 
                color="#005eb8" 
                isWarning={patient.vitals_sparkline.O2Sat.at(-1)! < 92}
              />
            </div>
          </div>
        </div>

        {/* Risk Trajectory */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-widest opacity-60">
              Risk Trajectory (+4h Pred)
            </h3>
            <span className="material-symbols-outlined text-primary text-2xl">timeline</span>
          </div>
          
          <div className="relative h-64 min-h-[16rem] w-full z-10 bg-surface-container-lowest/50 rounded-lg border border-outline-variant/5">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={trajData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isCritical ? "#ba1a1a" : "#005eb8"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isCritical ? "#ba1a1a" : "#005eb8"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" hide />
                <YAxis domain={[0, 1]} hide />
                <ReferenceLine y={0.70} stroke="#ba1a1a" strokeDasharray="6 6" strokeWidth={1.5} />
                <Area 
                  type="monotone" 
                  dataKey="risk" 
                  stroke={isCritical ? "#ba1a1a" : "#005eb8"} 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRisk)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between mt-6 text-[0.7rem] font-black text-on-surface-variant uppercase relative z-10 px-4 tracking-widest">
            <span>Now</span>
            <span>+1h</span>
            <span>+2h</span>
            <span>+3h</span>
            <span>+4h</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SparklineRow({ label, value, unit, data, color, isWarning }: any) {
  return (
    <div className="flex items-end justify-between gap-6 h-32 min-h-[8rem] relative">
      <div className="flex flex-col z-10 pb-2">
        <span className="text-[0.7rem] font-black text-on-surface-variant uppercase tracking-widest mb-1">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-headline font-black tracking-tighter ${isWarning ? 'text-tertiary shadow-sm' : 'text-on-surface'}`}>
            {value}
          </span>
          <span className="text-sm text-on-surface-variant font-bold opacity-60">{unit}</span>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 w-3/4 h-full opacity-60">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="v" 
              stroke={isWarning ? "#940010" : color} 
              strokeWidth={2.5} 
              dot={false} 
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
