import { mockPatients } from '@/lib/mock-data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PatientDetailedTabs from '@/components/PatientDetailedTabs'
import { statusColors, formatCrashTime } from '@/lib/utils'

export default async function PatientPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params
  const patient = mockPatients.find(p => p.patient_id === patientId)

  if (!patient) {
    notFound()
  }

  const colors = statusColors[patient.status]

  return (
    <div className="flex flex-col min-h-screen bg-[#02031a] p-6 lg:p-10 relative overflow-y-auto">
      {/* Background Mesh */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{
          background: 'radial-gradient(ellipse at 10% 0%, rgba(0, 119, 182, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 90% 100%, rgba(0, 180, 216, 0.15) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(3, 4, 94, 0.6) 0%, transparent 60%)'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col h-full flex-1 gap-8">
        
        {/* Top Header Row */}
        <header className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center justify-center w-10 h-10 rounded-full border border-cyan-500/20 hover:bg-cyan-900/30 transition text-cyan-300"
          >
            ←
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none uppercase">ICU Command Center</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Patient Analytics Drilldown</p>
          </div>
        </header>

        {/* Horizontal Bio-Bar */}
        <section className="flex flex-col md:flex-row items-center justify-between p-6 bg-[rgba(2,6,23,0.4)] border border-[rgba(202,240,248,0.1)] rounded-2xl backdrop-blur-xl shadow-xl gap-8">
          {/* Identity */}
          <div className="flex items-center gap-6 border-r border-slate-700/50 pr-8">
             <div 
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-black/40 shadow-inner"
                style={{ borderColor: colors.dot }}
              >
                <span className="text-2xl font-black leading-none" style={{ color: colors.text }}>
                  {Math.round(patient.final_score * 100)}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white leading-tight">{patient.name}</span>
                <span className="text-slate-400 text-xs font-bold uppercase mt-1">Bed {patient.bed_number} · {patient.age}y {patient.gender}</span>
              </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] mb-1">Primary Diagnosis</span>
            <span className="text-white font-bold text-base">{patient.diagnosis}</span>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-6 pl-8 border-l border-slate-700/50">
             <div className="flex flex-col items-center justify-center">
               <span className="text-2xl font-black text-white leading-none">{patient.hours_admitted}</span>
               <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 mt-1">Hours Admin</span>
             </div>
             <div className="flex flex-col items-center justify-center">
               <span className="text-sm font-bold uppercase px-3 py-1 rounded-full border" style={{ color: colors.text, background: colors.bg, borderColor: colors.border }}>
                 {patient.status}
               </span>
               <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 mt-2">Status</span>
             </div>
          </div>
        </section>

        {/* Tabbed Interactive Section */}
        <section className="flex-1 flex flex-col">
          <PatientDetailedTabs patient={patient} />
        </section>

      </div>
    </div>
  )
}
