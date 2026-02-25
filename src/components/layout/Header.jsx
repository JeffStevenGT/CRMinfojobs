import React from "react";

export default function Header({ searchTerm, setSearchTerm }) {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o móvil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-1.5 bg-gray-50 border-none rounded-lg text-[13px] placeholder-gray-400 focus:ring-2 focus:ring-indigo-50 focus:bg-white transition-all outline-none text-gray-600 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-[11px] font-bold text-gray-800 leading-none">
            Admin Usuario
          </span>
          <span className="text-[9px] font-medium text-emerald-500 uppercase tracking-tighter mt-1">
            Conectado
          </span>
        </div>
        <div className="h-8 w-8 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}
