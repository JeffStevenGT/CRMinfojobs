import React from "react";

export default function Sidebar({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
}) {
  const menuItems = [
    { id: "clientes-clm", label: "DIRECTORIO", icon: "📋" },
    { id: "agenda-clm", label: "AGENDA", icon: "📅" },
    { id: "reportes-clm", label: "REPORTES", icon: "📊" },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col z-[110] shadow-sm ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Cabecera Sidebar con Hamburguesa */}
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-3 animate-in fade-in duration-500">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
              J
            </div>
            <span className="text-xs font-black text-slate-800 tracking-tighter">
              JEFF CRM
            </span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-xl hover:bg-slate-50 transition-colors ${!isOpen ? "mx-auto" : ""}`}
        >
          <svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Menú Principal */}
      <nav className="flex-1 px-3 mt-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={!isOpen ? item.label : ""}
            className={`w-full flex items-center rounded-2xl transition-all duration-300 group ${
              isOpen ? "px-4 py-3.5 gap-4" : "p-4 justify-center"
            } ${
              activeTab === item.id
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && (
              <span className="text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Perfil de Usuario Jeff (Solo visible si está abierto) */}
      {isOpen && (
        <div className="p-6 animate-in fade-in duration-500">
          <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">
              Ingeniero Activo
            </p>
            <p className="text-[10px] font-black text-slate-800 text-center uppercase">
              JEFF • SENATI
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
