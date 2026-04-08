'use client'

import React from 'react'

interface TopBarProps {
  title: string
  onSearch: (val: string) => void
}

export default function TopBar({ title, onSearch }: TopBarProps) {
  return (
    <header className="flex justify-between items-center w-full px-10 py-6 h-24 bg-surface/95 backdrop-blur-xl sticky top-0 z-40 border-b border-outline-variant/20 shadow-sm flex-shrink-0">
      <div className="flex items-center gap-6">
        <span className="font-headline font-black text-3xl tracking-tighter text-primary">{title}</span>
        <div className="flex items-center gap-3 bg-surface-container-high/60 px-5 py-2 rounded-full border border-outline-variant/20 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
          <span className="text-[0.8rem] font-black text-on-surface-variant uppercase tracking-widest">
            Ward 4B · Live
          </span>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="relative flex items-center group">
          <span className="material-symbols-outlined absolute left-4 text-on-surface-variant group-focus-within:text-primary transition-colors text-lg">
            search
          </span>
          <input 
            className="pl-12 pr-6 py-3 bg-surface-container-low border border-outline-variant/10 rounded-2xl text-sm w-96 focus:ring-4 focus:ring-primary/10 hover:bg-surface-container outline-none transition-all shadow-xs border-transparent" 
            placeholder="Search Patient ID, diagnosis, or bed..." 
            type="text"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 text-on-surface-variant">
          <button className="material-symbols-outlined cursor-pointer hover:bg-surface-container-low p-2 rounded-full transition-colors relative">
            notifications
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-tertiary rounded-full"></span>
          </button>
          <button className="material-symbols-outlined cursor-pointer hover:bg-surface-container-low p-2 rounded-full transition-colors">
            settings
          </button>
          <button className="material-symbols-outlined cursor-pointer hover:bg-surface-container-low p-2 rounded-full transition-colors">
            help_outline
          </button>
        </div>
      </div>
    </header>
  )
}
