'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { VitalReading } from '@/types'

interface VitalsChartProps {
  vitals: VitalReading[]
}

const VITAL_CONFIGS = [
  { key: 'hr', label: 'HR', color: 'var(--color-critical)', unit: 'bpm' },
  { key: 'o2sat', label: 'SpO2', color: 'var(--color-risk)', unit: '%' },
  { key: 'sbp', label: 'SBP', color: 'var(--color-watch)', unit: 'mmHg' },
  { key: 'resp', label: 'Resp', color: '#90e0ef', unit: '/min' },
] as const

export default function VitalsChart({ vitals }: VitalsChartProps) {
  const data = vitals.map(v => ({
    time: v.hour >= 0 ? `T+${v.hour}h` : `T${v.hour}h`,
    hr: v.hr, o2sat: v.o2sat, sbp: v.sbp, resp: v.resp,
  }))

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 8h2l2-5 3 10 2-5h5" stroke="var(--color-watch)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Vitals Trend — 4h
      </h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(144,224,239,0.08)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'rgba(144,224,239,0.15)' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'rgba(2,6,23,0.95)', border: '1px solid rgba(0,119,182,0.3)', borderRadius: 8, fontSize: 11, color: 'var(--text-secondary)' }}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {VITAL_CONFIGS.map(({ key, label, color }) => (
              <Line key={key} type="monotone" dataKey={key} name={label} stroke={color} strokeWidth={2}
                dot={{ r: 2.5, fill: color }} activeDot={{ r: 4, fill: color, stroke: 'var(--bg-primary)' }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
