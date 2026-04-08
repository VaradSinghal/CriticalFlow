'use client'

import React from 'react'
import { Patient, ColorLevel } from '@/types'
import { formatTimeAgo } from '@/lib/utils'
import { AlertLogEntry } from '@/lib/mock-data'

interface WardAnalyticsProps {
  alerts: AlertLogEntry[]
  isSimulating: boolean
  onSimulate: () => void
  selectedPatient?: Patient
}

export default function WardAnalytics({ alerts, isSimulating, onSimulate, selectedPatient }: WardAnalyticsProps) {
  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Alert System */}
      <section className="flex flex-col gap-4">
        <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-widest opacity-60">
          Active Alerts
        </h3>
        <div className="space-y-3">
          {alerts.slice(0, 3).map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </section>

      {/* Explainability (SHAP) */}
      <section className="bg-surface-container-low/50 border border-outline-variant/10 rounded-xl p-6 flex-1 flex flex-col gap-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            smart_toy
          </span>
          <h3 className="font-headline font-bold text-sm text-on-surface uppercase tracking-widest">
            Model Explainability
          </h3>
        </div>

        {selectedPatient ? (
          <div className="space-y-6">
            <div>
              <p className="text-[0.6875rem] font-bold text-on-surface-variant uppercase mb-4 tracking-wider">
                Primary Risk Drivers
              </p>
              <div className="space-y-4">
                {selectedPatient.shap_features.slice(0, 4).map((feature, i) => (
                  <ShapBar key={i} name={feature.name} importance={feature.importance} />
                ))}
              </div>
            </div>

            <div className="p-4 bg-primary-fixed/20 rounded-lg border border-primary/10">
              <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lightbulb</span> 
                AI Recommendation
              </p>
              <p className="text-[0.6875rem] text-on-primary-fixed-variant leading-relaxed font-medium">
                {selectedPatient.recommendation}
              </p>
            </div>
            
            <button className="mt-auto w-full py-2.5 text-primary font-bold text-xs uppercase tracking-widest border border-primary/20 rounded-lg hover:bg-primary-fixed transition-all shadow-sm">
              Open Full Analysis
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">person_search</span>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Select a patient</p>
          </div>
        )}
      </section>

      {/* Demo Controls */}
      <div className="mt-auto pt-4 pb-2">
        <button 
          onClick={onSimulate}
          disabled={isSimulating}
          className={`
            w-full py-3.5 rounded-xl font-headline font-bold text-sm tracking-wide transition-all shadow-md active:scale-95
            ${isSimulating 
              ? 'bg-surface-container text-outline cursor-not-allowed' 
              : 'bg-gradient-to-r from-primary to-primary-container text-white hover:shadow-lg'
            }
          `}
        >
          {isSimulating ? 'SIMULATION IN PROGRESS...' : 'START RISK SIMULATION'}
        </button>
      </div>
    </div>
  )
}

function AlertCard({ alert }: { alert: AlertLogEntry }) {
  const isCritical = alert.color === 'RED'
  
  return (
    <div className={`
      ${isCritical ? 'bg-tertiary-container/30 border-l-4 border-tertiary shadow-sm' : 'bg-surface-container-lowest border-l-4 border-primary shadow-xs'} 
      rounded-lg p-4 transition-all hover:translate-x-1 cursor-pointer
    `}>
      <div className="flex gap-3">
        <span 
          className={`material-symbols-outlined text-sm ${isCritical ? 'text-tertiary' : 'text-primary'}`} 
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {isCritical ? 'warning' : 'info'}
        </span>
        <div>
          <p className={`text-xs font-extrabold ${isCritical ? 'text-on-tertiary-fixed-variant' : 'text-on-surface'}`}>
            {isCritical ? 'Critical Risk:' : 'Status Update:'} {alert.patient_id}
          </p>
          <p className={`text-[0.6875rem] mt-1 line-clamp-2 ${isCritical ? 'text-on-tertiary-fixed-variant opacity-80' : 'text-on-surface-variant'}`}>
            {alert.message}
          </p>
          <p className={`text-[0.625rem] font-bold mt-2 uppercase tracking-tighter ${isCritical ? 'text-tertiary' : 'text-on-surface-variant'}`}>
            {formatTimeAgo(alert.timestamp)}
          </p>
        </div>
      </div>
    </div>
  )
}

function ShapBar({ name, importance }: { name: string; importance: number }) {
  // Max normalization for visualization
  const width = Math.min(100, importance * 150) 
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs font-bold font-headline">
        <span className="text-on-surface/70 uppercase tracking-widest text-[0.65rem]">{name}</span>
        <span className="text-tertiary">+{importance.toFixed(2)} SHAP</span>
      </div>
      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden border border-outline-variant/10">
        <div 
          className="h-full bg-tertiary rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(148,0,16,0.3)]" 
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  )
}
