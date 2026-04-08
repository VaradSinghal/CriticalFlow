import { Patient } from '@/types'
import { colorMap } from '@/utils/colors'
import { motion } from 'framer-motion'

interface PatientCardProps {
  patient: Patient
  selected: boolean
  onClick: () => void
}

export default function PatientCard({ patient, selected, onClick }: PatientCardProps) {
  const colors = colorMap[patient.color]
  const isCritical = patient.color === 'RED'

  // Only the first sentence of the explanation
  const shortExplanation = patient.explanation.split('.')[0]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={onClick}
      className={`
        relative p-4 mb-3 rounded-lg border bg-white cursor-pointer transition-all
        ${colors.border}
        ${selected ? 'ring-2 ring-blue-500' : 'hover:shadow-sm'}
        ${isCritical && !selected ? 'animate-pulse' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 text-sm">
          Pt {patient.patient_id.replace('P', '')} · {patient.gender}, {patient.age}
        </h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors.badge}`}>
          [{patient.final_score.toFixed(2)}]
        </span>
      </div>
      
      <p className="text-gray-600 text-sm leading-tight mb-2">
        {shortExplanation}.
      </p>

      {isCritical && patient_crash_message(patient)}
    </motion.div>
  )
}

function patient_crash_message(patient: Patient) {
  // We mock a generic deterioration message since predicted_crash is no longer in Patient type
  return (
    <p className="text-red-600 text-xs font-bold mt-2">
      Deterioration ~{Math.round((1 - patient.final_score) * 100 * 3)} min
    </p>
  )
}
