import axios from 'axios'
import { WardSnapshot, TriageRequest, TriageResponse } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  // Get full ward state — call this on mount
  getWardSnapshot: () =>
    axios.get<WardSnapshot>(`${BASE}/api/v1/ward/snapshot`).then(r => r.data),

  // Triage form submission
  triage: (req: TriageRequest) =>
    axios.post<TriageResponse>(`${BASE}/api/v1/triage`, req).then(r => r.data),

  // Start simulation (demo mode)
  startSimulation: () =>
    axios.post(`${BASE}/api/v1/simulate/start`).then(r => r.data),

  // Health check
  health: () =>
    axios.get(`${BASE}/health`).then(r => r.data),
}
