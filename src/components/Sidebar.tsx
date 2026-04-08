'use client'

import React from 'react'

interface NavItem {
  id: string
  label: string
  icon: string
  hasAlert?: boolean
}

interface SidebarProps {
  activeView: string
  onViewChange: (id: any) => void
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'patients', label: 'Patients', icon: 'group' },
  { id: 'alerts', label: 'Alerts', icon: 'crisis_alert', hasAlert: true },
  { id: 'analytics', label: 'Analytics', icon: 'insights' },
]

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-80 h-screen flex flex-col pt-12 pb-10 bg-surface-container-low rounded-r-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.06)] border-r border-outline-variant/10 flex-shrink-0 relative z-20 overflow-hidden">
      <div className="px-10 mb-14">
        <h1 className="font-headline font-black text-4xl text-on-surface tracking-tighter mb-10 bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent">
          CriticalFlow
        </h1>
        
        <div className="p-4 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/20 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
          <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-primary overflow-hidden border-2 border-primary/5">
            <img 
              className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
              alt="Medical Officer Profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfLY6LFtMoGSOSHmmFI3vhxL3-wA_ekkc3m3eWHflzaqRb1NUeSXPgcoZiGIGrRftrLMH1hyJl5fO8H4VXQlVq6Uvvac_TW9iRQwWJwEc001B80y3q-qjB1UWrxS0kIWcqwToQkbDW3ftZqBBxEjkVV8GaRpOT6sGAYvXshaFoxn3B-_9IXj46YWri1vFOPe0qpYSK9Xe6pzWOddBRw3tWZatcEPJzmsiI7GMhQIVK94ZXR5SUeqJddtx18X1CpucRlvD8wyyop14" 
            />
          </div>
          <div className="flex flex-col">
            <p className="font-headline font-black text-[0.9rem] text-on-surface tracking-tight">Dr. Varad</p>
            <p className="text-[0.65rem] text-on-surface-variant font-black uppercase tracking-widest opacity-60">Unit 4-North Chief</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col mt-4">
        <div className="flex-1 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-4 px-8 py-4 transition-all relative group ${
                activeView === item.id 
                  ? 'bg-surface-container-lowest text-primary rounded-l-full ml-6 shadow-md font-extrabold' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-primary/5 mx-6 rounded-xl'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {item.icon}
              </span>
              <span className="font-headline font-bold text-sm tracking-tight">{item.label}</span>
              {item.hasAlert && activeView !== item.id && (
                <span className="absolute right-6 w-2 h-2 rounded-full bg-tertiary"></span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto px-8 space-y-4 pb-4">
          <button 
            onClick={() => onViewChange('triage')}
            className="w-full py-5 px-6 bg-primary text-white rounded-2xl font-headline font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] hover:shadow-2xl transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Admit Patient
          </button>
          
          <div className="pt-6 border-t border-outline-variant/20 flex flex-col gap-1">
            <button className="flex items-center gap-3 text-on-surface-variant py-2.5 px-4 hover:bg-primary/5 hover:text-primary rounded-xl transition-all text-left">
              <span className="material-symbols-outlined text-lg">contact_support</span>
              <span className="text-[0.7rem] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100">Support</span>
            </button>
            <button className="flex items-center gap-3 text-on-surface-variant py-2.5 px-4 hover:bg-primary/5 hover:text-primary rounded-xl transition-all text-left">
              <span className="material-symbols-outlined text-lg">history_edu</span>
              <span className="text-[0.7rem] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100">Audit Logs</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  )
}
