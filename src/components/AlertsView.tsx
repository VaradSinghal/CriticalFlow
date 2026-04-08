'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertLogEntry } from '@/lib/mock-data'
import { formatTimeAgo } from '@/lib/utils'

interface AlertsViewProps {
  alerts: AlertLogEntry[]
}

export default function AlertsView({ alerts }: AlertsViewProps) {
  return (
    <div className="p-16 h-full overflow-y-auto custom-scrollbar flex flex-col gap-14 max-w-[1400px] mx-auto">
      <header className="mb-4">
        <h2 className="font-headline font-black text-4xl text-on-surface tracking-tighter mb-2">Clinical Alert Feed</h2>
        <p className="text-on-surface-variant font-medium opacity-60">Real-time and historical alerts across the ward.</p>
      </header>

      <div className="flex flex-col gap-4 relative">
        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-outline-variant/10"></div>
        
        {alerts.map((alert, i) => {
          const isCritical = alert.color === 'RED'
          return (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={alert.id}
              className="flex gap-10 items-start relative z-10"
            >
              <div className={`mt-6 w-5 h-5 rounded-full border-4 border-background flex-shrink-0 ${
                isCritical ? 'bg-tertiary shadow-[0_0_12px_rgba(148,0,16,0.6)] animate-pulse' : 
                alert.color === 'AMBER' ? 'bg-secondary' : 'bg-primary/50'
              }`}></div>
              
              <div className={`flex-1 p-8 rounded-[2rem] panel-shadow border transition-all ${
                isCritical 
                  ? 'bg-tertiary-container/20 border-tertiary/20' 
                  : 'bg-surface-container-lowest border-outline-variant/10'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40 block mb-2">
                       {formatTimeAgo(alert.timestamp)} — Patient {alert.patient_id}
                    </span>
                    <h3 className={`font-headline font-black text-xl leading-tight ${isCritical ? 'text-on-tertiary-fixed-variant' : 'text-on-surface'}`}>
                      {alert.message}
                    </h3>
                  </div>
                  <span className={`material-symbols-outlined text-2xl ${isCritical ? 'text-tertiary' : 'text-primary'}`}>
                    {isCritical ? 'warning' : 'notifications'}
                  </span>
                </div>
                
                <div className="flex gap-4">
                  <button className="text-[0.7rem] font-black text-primary uppercase tracking-widest hover:underline">
                    View Patient Table
                  </button>
                  <button className="text-[0.7rem] font-black text-on-surface-variant uppercase tracking-widest opacity-60 hover:underline">
                    Acknowledge
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
