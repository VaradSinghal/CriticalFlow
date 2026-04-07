'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { RiskTrajectory } from '@/types'

interface TrajectoryChartProps {
  trajectory: RiskTrajectory
  currentScore: number
}

export default function TrajectoryChart({ trajectory, currentScore }: TrajectoryChartProps) {
  const data = [
    { time: 'Now', risk: trajectory.now },
    { time: '15m', risk: trajectory.t15m },
    { time: '30m', risk: trajectory.t30m },
    { time: '1h', risk: trajectory.t1h },
    { time: '4h', risk: trajectory.t4h },
  ]

  const isRising = trajectory.t4h > trajectory.now
  const gradientColor = isRising ? 'var(--color-critical)' : 'var(--color-stable)'

  return (
    <div className="chart-card">
      <h3 className="chart-card__title">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 14L6 8L10 10L14 2" stroke="var(--color-watch)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 2h4v4" stroke="var(--color-watch)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Risk Trajectory
      </h3>
      <div className="chart-card__trend-row">
        <span className={`chart-card__trend-badge ${isRising ? 'chart-card__trend-badge--rising' : 'chart-card__trend-badge--falling'}`}>
          {isRising ? '↑ Rising' : '↓ Declining'} — {Math.round(trajectory.t4h * 100)}% at T+4h
        </span>
      </div>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(144,224,239,0.08)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'rgba(144,224,239,0.15)' }} tickLine={false} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
              tickFormatter={(v: number) => `${Math.round(v * 100)}%`} />
            <Tooltip
              contentStyle={{ background: 'rgba(2,6,23,0.95)', border: '1px solid rgba(0,119,182,0.3)', borderRadius: 8, fontSize: 11, color: 'var(--text-secondary)' }}
              formatter={(value: any) => [`${Math.round(value * 100)}%`, 'Risk']}
            />
            <ReferenceLine y={0.70} stroke="var(--color-critical)" strokeDasharray="6 3" strokeOpacity={0.5} label={{ value: 'Critical', position: 'right', fill: 'var(--color-critical)', fontSize: 9 }} />
            <ReferenceLine y={0.50} stroke="var(--color-risk)" strokeDasharray="6 3" strokeOpacity={0.3} />
            <ReferenceLine y={0.30} stroke="var(--color-watch)" strokeDasharray="6 3" strokeOpacity={0.2} />
            <Area type="monotone" dataKey="risk" stroke={gradientColor} strokeWidth={2.5} fill="url(#riskGrad)"
              dot={{ r: 4, fill: gradientColor, stroke: 'var(--bg-primary)', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: gradientColor, stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
