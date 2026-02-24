import React, { useState } from "react";

export default function Header({ searchTerm, setSearchTerm, sugerencias }) {
  const [isFocused, setIsFocused] = useState(false);

  const SearchIcon = () => (
    <svg
      className="w-4 h-4 text-gray-400 absolute left-3 top-3"
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
  );

  // Solo mostramos sugerencias si está escribiendo, tiene focus y hay resultados
  const showSuggestions = isFocused && searchTerm.length > 0;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 z-30 sticky top-0 shadow-sm">
      <div className="flex-1"></div>

      <div className="flex items-center space-x-5">
        {/* BUSCADOR CON AUTOCOMPLETADO */}
        <div className="relative hidden sm:block">
          <SearchIcon />
          <input
            type="text"
            placeholder="Buscar por nombre, móvil o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Retraso para permitir clic en la sugerencia
            className="bg-gray-50/50 border border-gray-200 rounded-full pl-9 pr-4 py-2 text-sm w-64 focus:w-80 transition-all duration-300 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50/50"
          />

          {/* CAJA DE SUGERENCIAS FLOTANTE */}
          {showSuggestions && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top">
              {sugerencias.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                  {sugerencias.slice(0, 5).map((lead) => (
                    <li
                      key={lead.id}
                      onClick={() => setSearchTerm(lead.nombre)}
                      className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {lead.nombre}
                      </p>
                      <p className="text-xs text-gray-400">
                        {lead.whatsapp} • {lead.provincia}
                      </p>
                    </li>
                  ))}
                  {sugerencias.length > 5 && (
                    <li className="px-4 py-2 text-xs text-center text-indigo-500 font-medium bg-indigo-50/50">
                      Ver {sugerencias.length - 5} resultados más...
                    </li>
                  )}
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Sin resultados
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-medium shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          JS
        </div>
      </div>
    </header>
  );
}
