'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Patient, WardSnapshot } from '@/types'
import { initialWardSnapshot, mockAlertLog, AlertLogEntry, createSimulationTick } from '@/lib/mock-data'

export function useWardState() {
  const [snapshot, setSnapshot] = useState<WardSnapshot>(initialWardSnapshot)
  const [alerts, setAlerts] = useState<AlertLogEntry[]>(mockAlertLog)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(snapshot.patients[0]?.patient_id || null)
  const [isSimulating, setIsSimulating] = useState(false)
  const tickRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false)

  const selectedPatient = snapshot.patients.find(p => p.patient_id === selectedPatientId) ?? snapshot.patients[0]

  const selectPatient = useCallback((id: string) => setSelectedPatientId(id), [])

  const admitPatient = useCallback((patient: Patient) => {
    setSnapshot(prev => {
      const updatedPatients = [patient, ...prev.patients]
      const critical = updatedPatients.filter(p => p.color === 'RED').length
      const review = updatedPatients.filter(p => p.color === 'AMBER').length
      const stable = updatedPatients.filter(p => p.color === 'GREEN').length

      return {
        ...prev,
        patients: updatedPatients,
        stats: { ...prev.stats, critical, review, stable },
      }
    })
    setSelectedPatientId(patient.patient_id)
  }, [])

  const startSimulation = useCallback(() => {
    if (isSimulating) return
    setIsSimulating(true)
    tickRef.current = 0

    intervalRef.current = setInterval(() => {
      tickRef.current += 1
      setSnapshot(prev => {
        const { patients: updatedPatients, newAlert } = createSimulationTick(prev.patients, tickRef.current)

        if (newAlert) {
          setAlerts(a => [newAlert, ...a])
        }

        const critical = updatedPatients.filter(p => p.color === 'RED').length
        const review = updatedPatients.filter(p => p.color === 'AMBER').length
        const stable = updatedPatients.filter(p => p.color === 'GREEN').length

        return {
          ...prev,
          patients: updatedPatients,
          timestamp: new Date().toISOString(),
          stats: { ...prev.stats, critical, review, stable },
        }
      })

      if (tickRef.current >= 10) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsSimulating(false)
      }
    }, 3000)
  }, [isSimulating])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return {
    snapshot,
    alerts,
    selectedPatient,
    selectPatient,
    isSimulating,
    startSimulation,
    isTriageModalOpen,
    setIsTriageModalOpen,
    admitPatient,
  }
}
