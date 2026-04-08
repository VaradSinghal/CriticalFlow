import { ColorLevel } from '@/types'

export const colorMap = {
  RED:   { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-300',    badge: 'bg-red-100 text-red-800'    },
  AMBER: { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-300',  badge: 'bg-amber-100 text-amber-800'  },
  GREEN: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-300',  badge: 'bg-green-100 text-green-800'  },
}

export const scoreToColor = (score: number): ColorLevel => {
  if (score >= 0.70) return 'RED'
  if (score >= 0.35) return 'AMBER'
  return 'GREEN'
}
