import React from "react";

export default function Header({ searchTerm, setSearchTerm }) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between shrink-0 z-[100]">
      <div className="flex-1 max-w-xl relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="BUSCAR CLIENTE O WHATSAPP..."
          className="w-full bg-slate-100/50 border-none rounded-2xl py-3 pl-12 pr-4 text-[10px] font-black text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-100 transition-all uppercase tracking-widest"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
          Terminal Operativo v2.6
        </div>
      </div>
    </header>
  );
}
