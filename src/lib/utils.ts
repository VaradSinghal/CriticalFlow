import { ActionLevel, BedStatus } from '@/types'

export const statusColors: Record<BedStatus, { bg: string; text: string; border: string; dot: string; glow: string }> = {
  'Stable':   { bg: '#0a444f40', text: '#79daee', border: '#15889f80', dot: 'var(--text-secondary)', glow: '0 0 20px rgba(121,218,238,0.25)' }, // light_cyan
  'Watch':    { bg: '#0a3a4340', text: '#4ccfe6', border: '#1dafc980', dot: '#90e0ef', glow: '0 0 20px rgba(76,207,230,0.25)' }, // frosted_blue
  'Risk':     { bg: '#00242b40', text: '#12d8ff', border: '#006b8180', dot: '#4ee1ff', glow: '0 0 20px rgba(18,216,255,0.3)' }, // turquoise_surf
  'Critical': { bg: '#02033840', text: '#3bbaff', border: '#0508ae80', dot: '#89ebff', glow: '0 0 24px rgba(59,186,255,0.4)' }, // deep_twilight + bright teal
}

export const formatTimeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export const formatCrashTime = (minutes: number | null): string => {
  if (minutes === null) return '—'
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
