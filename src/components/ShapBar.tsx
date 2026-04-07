'use client'

import { motion } from 'framer-motion'
import { ShapFeature } from '@/types'

interface ShapBarProps {
  features: ShapFeature[]
}

export default function ShapBar({ features }: ShapBarProps) {
  const sorted = [...features].sort((a, b) => b.importance - a.importance)

  return (
    <div className="shap-card">
      <h3 className="chart-card__title">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="2" rx="1" fill="var(--color-watch)" opacity="0.8" />
          <rect x="2" y="7" width="9" height="2" rx="1" fill="var(--color-watch)" opacity="0.6" />
          <rect x="2" y="11" width="6" height="2" rx="1" fill="var(--color-watch)" opacity="0.4" />
        </svg>
        AI Explainability — Why This Prediction
      </h3>
      <div className="shap-card__list">
        {sorted.map((feature, i) => (
          <motion.div
            key={feature.name}
            className="shap-card__row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <div className="shap-card__label-row">
              <span className="shap-card__name">{feature.name}</span>
              <span className="shap-card__pct">{Math.round(feature.importance * 100)}%</span>
            </div>
            <div className="shap-card__track">
              <motion.div
                className={`shap-card__fill ${feature.direction === 'risk' ? 'shap-card__fill--risk' : 'shap-card__fill--safe'}`}
                initial={{ width: 0 }}
                animate={{ width: `${feature.importance * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
