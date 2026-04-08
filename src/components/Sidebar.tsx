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
    <aside className="w-80 h-screen flex flex-col py-10 bg-surface-container-low rounded-r-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.06)] border-r border-outline-variant/10 flex-shrink-0 relative z-20 overflow-hidden">
      <div className="px-10 mb-12">
        <h1 className="font-headline font-extrabold text-on-surface text-3xl tracking-tighter mb-8 bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent">
          CriticalFlow
        </h1>
        <div className="flex items-center gap-4 p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary overflow-hidden border-2 border-primary/10">
            <img 
              className="w-full h-full object-cover" 
              alt="Medical Officer Profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfLY6LFtMoGSOSHmmFI3vhxL3-wA_ekkc3m3eWHflzaqRb1NUeSXPgcoZiGIGrRftrLMH1hyJl5fO8H4VXQlVq6Uvvac_TW9iRQwWJwEc001B80y3q-qjB1UWrxS0kIWcqwToQkbDW3ftZqBBxEjkVV8GaRpOT6sGAYvXshaFoxn3B-_9IXj46YWri1vFOPe0qpYSK9Xe6pzWOddBRw3tWZatcEPJzmsiI7GMhQIVK94ZXR5SUeqJddtx18X1CpucRlvD8wyyop14" 
            />
          </div>
          <div>
            <p className="font-headline font-bold text-sm text-on-surface">ICU Central</p>
            <p className="text-[0.6875rem] text-on-surface-variant font-medium">Unit 4-North</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col mt-4">
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

        <div className="mt-auto px-6 space-y-2">
          <button className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-lg font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow">
            <span className="material-symbols-outlined text-sm">add</span>
            Admit Patient
          </button>
          
          <div className="pt-6 border-t border-outline-variant/20 flex flex-col gap-1">
            <button className="flex items-center gap-3 text-on-surface-variant py-2 hover:text-primary transition-all text-left">
              <span className="material-symbols-outlined text-sm">contact_support</span>
              <span className="text-xs">Support</span>
            </button>
            <button className="flex items-center gap-3 text-on-surface-variant py-2 hover:text-primary transition-all text-left">
              <span className="material-symbols-outlined text-sm">history_edu</span>
              <span className="text-xs">Logs</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  )
}
