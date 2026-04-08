'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { WardSnapshot } from '@/types'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { riskHeatmapData } from '@/lib/mock-data'

interface AnalyticsViewProps {
  snapshot: WardSnapshot
}

export default function AnalyticsView({ snapshot }: AnalyticsViewProps) {
  const statsData = [
    { name: 'Critical', value: snapshot.stats.critical, color: '#ba1a1a' },
    { name: 'Review', value: snapshot.stats.review, color: '#F5A524' },
    { name: 'Stable', value: snapshot.stats.stable, color: '#00478d' },
  ]

  return (
    <div className="p-16 h-full overflow-y-auto custom-scrollbar flex flex-col gap-16 max-w-[1800px] mx-auto">
      <header className="mb-4">
        <h2 className="font-headline font-black text-4xl text-on-surface tracking-tighter mb-2">Ward Performance Analytics</h2>
        <p className="text-on-surface-variant font-medium opacity-60">High-level statistics and predictive risk trends for Unit 4B.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Ward Distribution Chart */}
        <section className="bg-surface-container-lowest p-10 rounded-[2.5rem] panel-shadow border border-outline-variant/10 flex flex-col items-center">
          <h3 className="font-headline font-black text-sm uppercase tracking-[0.2em] opacity-40 mb-8 self-start">Patient Distribution</h3>
          <div className="w-full h-64 chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4">
            {statsData.map(s => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                <span className="text-sm font-bold text-on-surface-variant tracking-tight">{s.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Lead Time Statistics */}
        <section className="bg-surface-container-lowest p-10 rounded-[2.5rem] panel-shadow border border-outline-variant/10 flex flex-col xl:col-span-2">
          <h3 className="font-headline font-black text-sm uppercase tracking-[0.2em] opacity-40 mb-8">Deterioration Lead Time (Min)</h3>
          <div className="w-full h-64 chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snapshot.patients.slice(0, 8)}>
                <XAxis dataKey="patient_id" hide />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="final_score" radius={[8, 8, 0, 0]}>
                  {snapshot.patients.map((p, i) => (
                    <Cell key={i} fill={p.color === 'RED' ? '#ba1a1a' : '#00478d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-surface-container rounded-2xl border border-outline-variant/10 flex justify-between items-center">
             <div>
               <p className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-1">Average Lead Time</p>
               <span className="text-3xl font-headline font-black text-primary">{snapshot.stats.avg_lead_time_minutes} min</span>
             </div>
             <div className="text-right">
               <p className="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-1">Total Admissions</p>
               <span className="text-3xl font-headline font-black text-on-surface">{snapshot.patients.length}</span>
             </div>
          </div>
        </section>
      </div>

      {/* Expanded Risk Heatmap */}
      <section className="bg-surface-container-lowest p-10 rounded-[2.5rem] panel-shadow border border-outline-variant/10 mb-12">
        <h3 className="font-headline font-black text-sm uppercase tracking-[0.2em] opacity-40 mb-10">Predictive Risk Heatmap (All Beds × 6 Hours)</h3>
        <div className="flex flex-col gap-3">
          {riskHeatmapData.map((row, i) => (
            <div key={i} className="flex gap-3 items-center">
              <span className="w-12 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-wider opacity-40">Bed {i+1}</span>
              <div className="flex-1 flex gap-2 h-10">
                {row.map((val, j) => {
                   const bg = val >= 0.70 ? 'bg-tertiary' : val >= 0.35 ? 'bg-secondary' : 'bg-primary/20'
                   return (
                     <motion.div 
                       key={j}
                       whileHover={{ scale: 1.05, zIndex: 1 }}
                       className={`flex-1 rounded-xl shadow-sm cursor-pointer border border-outline-variant/5 ${bg} transition-colors`}
                       style={{ opacity: Math.max(0.3, val) }}
                     />
                   )
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6 px-14 text-[0.65rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">
           <span>-1h</span>
           <span>Now</span>
           <span>+1h</span>
           <span>+2h</span>
           <span>+3h</span>
           <span>+4h</span>
        </div>
      </section>
    </div>
  )
}
