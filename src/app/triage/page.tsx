import { mockTriagePatients } from '@/lib/mock-data'
import { TriagePatient } from '@/types'
import Link from 'next/link'
import { formatTimeAgo } from '@/lib/utils'

function SeverityBadge({ severity }: { severity: 'High' | 'Medium' | 'Low' }) {
  if (severity === 'High') return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 flex items-center justify-center rounded text-xs font-bold uppercase tracking-wider">High Risk</span>
  if (severity === 'Medium') return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 flex items-center justify-center rounded text-xs font-bold uppercase tracking-wider">Med Risk</span>
  return <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 flex items-center justify-center rounded text-xs font-bold uppercase tracking-wider">Low Risk</span>
}

export default function TriagePage() {
  const sortedPatients = ([...mockTriagePatients] as TriagePatient[]).sort((a, b) => {
    const sevMap = { High: 3, Medium: 2, Low: 1 }
    return sevMap[b.triage.severity as keyof typeof sevMap] - sevMap[a.triage.severity as keyof typeof sevMap]
  })

  return (
    <div className="flex flex-col h-screen bg-[#02031a] relative overflow-hidden text-cyan-50">
      {/* Background Mesh (shared with Dashboard) */}
      <div 
        className="absolute inset-0 z-0 opacity-50 pointer-events-none" 
        style={{
          background: 'radial-gradient(ellipse at 10% 0%, rgba(0, 119, 182, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 90% 100%, rgba(0, 180, 216, 0.15) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(3, 4, 94, 0.6) 0%, transparent 60%)'
        }}
      />

      <header className="header flex items-center justify-between w-full relative z-10 px-8 py-5">
        <div className="flex items-center gap-6">
          <Link href="/" className="px-4 py-2 rounded-full border border-cyan-500/30 text-cyan-300 font-bold hover:bg-cyan-500/10 transition uppercase text-xs tracking-wider">
            &larr; Back to ICU Floor
          </Link>
          <div>
            <h1 className="header__title tracking-tight m-0 leading-tight">BioBERT Triage Queue</h1>
            <p className="text-cyan-400/60 text-xs font-bold uppercase tracking-widest mt-1">Incoming ER & Ward Transfers</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="header__pill header__pill--critical">
            <span className="header__pill-value">{sortedPatients.filter(p => p.triage.severity === 'High').length}</span>
            <span className="header__pill-label">Critical</span>
          </div>
          <div className="header__pill header__pill--total">
            <span className="header__pill-value">{sortedPatients.length}</span>
            <span className="header__pill-label">Pending</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          {sortedPatients.map((patient: TriagePatient) => (
            <div 
              key={patient.id} 
              className="group flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-[rgba(144,224,239,0.15)] bg-[rgba(2,6,23,0.4)] backdrop-blur-xl hover:border-[rgba(0,180,216,0.4)] hover:bg-[rgba(0,119,182,0.15)] transition-all duration-300 shadow-xl"
            >
              {/* Patient Info */}
              <div className="flex flex-col min-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <SeverityBadge severity={patient.triage.severity as any} />
                  <span className="text-slate-400 text-xs font-bold uppercase">{formatTimeAgo(patient.arrival_time)}</span>
                </div>
                <h2 className="text-xl font-bold text-white leading-tight">{patient.name}</h2>
                <p className="text-slate-400 text-sm mt-1">{patient.age}y {patient.gender}</p>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-cyan-500/70 font-bold">HR</span>
                    <span className="text-white font-semibold text-sm">{patient.vitals.hr} <span className="text-slate-500 text-[10px]">bpm</span></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-cyan-500/70 font-bold">BP</span>
                    <span className="text-white font-semibold text-sm">{patient.vitals.sbp}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-cyan-500/70 font-bold">O2</span>
                    <span className="text-white font-semibold text-sm">{patient.vitals.o2sat}%</span>
                  </div>
                </div>
              </div>

              {/* Triage Data */}
              <div className="flex-1 flex flex-col justify-center pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-[rgba(144,224,239,0.1)] pt-4 md:pt-0">
                <p className="text-sm text-cyan-100/80 italic mb-4">"{patient.chief_complaint}"</p>
                
                <div>
                  <span className="text-xs uppercase text-cyan-500 font-bold tracking-wider mb-2 block">Extracted Risk Tokens</span>
                  <div className="flex flex-wrap gap-2">
                    {patient.triage.top_tokens.map((token, i) => (
                      <span key={i} className="bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold">
                        {token}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Column */}
              <div className="flex flex-col justify-center items-end min-w-[150px]">
                <span className="text-xs text-slate-400 uppercase font-bold mb-2">Recommendation</span>
                <span className={`text-sm font-bold block mb-4 text-right ${patient.suggested_action === 'Admit to ICU' ? 'text-red-400' : 'text-cyan-400'}`}>
                  {patient.suggested_action}
                </span>
                
                <button className="bg-transparent hover:bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40 rounded-lg px-4 py-2 text-sm transition-all w-full">
                  Process
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
