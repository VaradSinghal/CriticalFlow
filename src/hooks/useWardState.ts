'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Patient, AlertEntry, WardSnapshot } from '@/types'
import { mockWardSnapshot, mockAlerts, mockRecommendations, createSimulationTick } from '@/lib/mock-data'

export function useWardState() {
  const [snapshot, setSnapshot] = useState<WardSnapshot>(mockWardSnapshot)
  const [alerts, setAlerts] = useState<AlertEntry[]>(mockAlerts)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [activeAlert, setActiveAlert] = useState<AlertEntry | null>(null)
  const tickRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const selectedPatient = snapshot.patients.find(p => p.patient_id === selectedPatientId) ?? null

  const filteredPatients = snapshot.patients.filter(p => {
    const matchesSearch = searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patient_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bed_number.toString().includes(searchQuery)
    const matchesFilter = riskFilter === 'all' || p.status.toLowerCase() === riskFilter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const openDrawer = useCallback((id: string) => setSelectedPatientId(id), [])
  const closeDrawer = useCallback(() => setSelectedPatientId(null), [])

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a))
  }, [])

  const dismissAlert = useCallback(() => setActiveAlert(null), [])

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
          if (newAlert.level === 'Intervene now') {
            setActiveAlert(newAlert)
          }
        }

        const critical = updatedPatients.filter(p => p.status === 'Critical').length
        const risk = updatedPatients.filter(p => p.status === 'Risk').length
        const watch = updatedPatients.filter(p => p.status === 'Watch').length
        const stable = updatedPatients.filter(p => p.status === 'Stable').length

        return {
          ...prev,
          patients: updatedPatients,
          timestamp: new Date().toISOString(),
          stats: { ...prev.stats, critical, risk, watch, stable },
        }
      })

      if (tickRef.current >= 12) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsSimulating(false)
      }
    }, 3000)
  }, [isSimulating])

  const stopSimulation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsSimulating(false)
    tickRef.current = 0
  }, [])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return {
    snapshot,
    alerts,
    selectedPatient,
    selectedPatientId,
    filteredPatients,
    searchQuery,
    setSearchQuery,
    riskFilter,
    setRiskFilter,
    openDrawer,
    closeDrawer,
    isSimulating,
    startSimulation,
    stopSimulation,
    activeAlert,
    dismissAlert,
    acknowledgeAlert,
    recommendations: mockRecommendations,
  }
}
