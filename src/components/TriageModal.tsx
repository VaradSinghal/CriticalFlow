'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/api'
import { TriageResponse, Patient } from '@/types'

interface TriageModalProps {
  isOpen: boolean
  onClose: () => void
  onAdmit: (patient: Patient) => void
}

export default function TriageModal({ isOpen, onClose, onAdmit }: TriageModalProps) {
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<TriageResponse | null>(null)

  const handleTriage = async () => {
    if (!text) return
    setIsAnalyzing(true)
    try {
      const resp = await api.triage({ patient_id: `P-${Math.floor(Math.random() * 900) + 100}`, text })
      setResult(resp)
    } catch (e) {
      console.error(e)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleConfirmAdmission = () => {
    if (!result) return
    
    // Create a new patient object from triage results
    const newPatient: Patient = {
      patient_id: result.patient_id,
      age: Math.floor(Math.random() * 50) + 30, // Random age for demo
      gender: Math.random() > 0.5 ? 'M' : 'F',
      hours_admitted: 0,
      diagnosis: text.slice(0, 40) + '...',
      final_score: result.confidence,
      action: result.severity === 'High' ? 'Intervene now' : result.severity === 'Medium' ? 'Doctor review' : 'Monitor',
      color: result.severity === 'High' ? 'RED' : result.severity === 'Medium' ? 'AMBER' : 'GREEN',
      recommendation: result.severity === 'High' ? 'Immediate ICU stabilization required.' : 'Prepare for specialist review.',
      explanation: `Triage model predicted ${result.severity} severity with ${Math.round(result.confidence * 100)}% confidence based on symptom analysis.`,
      triage_severity: result.severity,
      icu_risk: result.confidence,
      trajectory: {
        now: result.confidence,
        t1h: result.confidence + 0.05,
        t2h: result.confidence + 0.1,
        t4h: result.confidence + 0.15,
      },
      vitals_sparkline: {
        HR: [80, 85, 90, 88, 92],
        O2Sat: [98, 97, 96, 95, 94],
        SBP: [120, 118, 115, 110, 108],
      },
      shap_features: [
        { name: 'Symptom Severity', importance: 0.45 },
        { name: 'Admission Lag', importance: 0.22 },
        { name: 'Age Factor', importance: 0.15 },
      ],
      last_updated: new Date().toISOString(),
    }

    onAdmit(newPatient)
    onClose()
    setResult(null)
    setText('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-on-surface/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-surface-container-lowest w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-outline-variant/10"
          >
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="font-headline font-black text-3xl text-on-surface tracking-tighter mb-2">Patient Admission</h2>
                  <p className="text-on-surface-variant font-medium opacity-60 italic text-sm">BIO-BERT Clinical Triage Analysis</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant">close</span>
                </button>
              </div>

              {!result ? (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-2">Symptom Description</label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="e.g. 64yo female with sudden onset dyspnea and pleuritic chest pain. SpO2 88% on room air..."
                      className="w-full h-48 p-6 bg-surface-container-low border-2 border-outline-variant/20 rounded-3xl outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={handleTriage}
                    disabled={isAnalyzing || !text}
                    className={`
                      w-full py-4 rounded-2xl font-headline font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95
                      ${isAnalyzing || !text 
                        ? 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed' 
                        : 'bg-primary text-white hover:bg-primary-container shadow-primary/20'
                      }
                    `}
                  >
                    {isAnalyzing ? 'Analyzing Clinical Tokens...' : 'Analyze Triage Result'}
                  </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className={`p-8 rounded-3xl border ${
                    result.severity === 'High' ? 'bg-tertiary-container/20 border-tertiary/20' : 
                    result.severity === 'Medium' ? 'bg-secondary-container/20 border-secondary/20' : 
                    'bg-primary-fixed/20 border-primary/20'
                  }`}>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[0.65rem] font-black uppercase tracking-widest opacity-60">Predicted Severity</span>
                      <span className={`px-4 py-1.5 rounded-full text-[0.7rem] font-black tracking-widest ${
                        result.severity === 'High' ? 'bg-tertiary text-white' : 
                        result.severity === 'Medium' ? 'bg-secondary text-white' : 
                        'bg-primary text-white'
                      }`}>
                        {result.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-5xl font-headline font-black ${
                         result.severity === 'High' ? 'text-tertiary' : 
                         result.severity === 'Medium' ? 'text-secondary' : 
                         'text-primary'
                      }`}>
                        {Math.round(result.confidence * 100)}%
                      </span>
                      <span className="text-sm font-bold opacity-60">AI Confidence</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(result.probabilities).map(([key, val]) => (
                      <div key={key} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10">
                        <p className="text-[0.6rem] font-black uppercase tracking-widest opacity-40 mb-1">{key}</p>
                        <p className="text-lg font-headline font-black text-on-surface">{Math.round(val * 100)}%</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setResult(null)}
                      className="flex-1 py-4 border-2 border-outline-variant/20 rounded-2xl font-headline font-black text-xs uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-all"
                    >
                      Wait, Re-Edit
                    </button>
                    <button 
                      onClick={handleConfirmAdmission}
                      className="flex-[2] py-4 bg-primary text-white rounded-2xl font-headline font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Confirm Admission to Ward
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
