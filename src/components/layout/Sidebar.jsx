import React from "react";

export default function Sidebar({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  onExportClick,
  onLogout,
  isAdmin,
  userName, // <-- Este es el nombre que viene desde App -> Dashboard
}) {
  const menuItems = [
    { id: "clientes-clm", label: "DIRECTORIO", icon: "📋" },
    { id: "agenda-clm", label: "AGENDA", icon: "📅" },
    { id: "reportes-clm", label: "REPORTES", icon: "📊" },
    ...(isAdmin
      ? [{ id: "admin-usuarios", label: "USUARIOS", icon: "👥" }]
      : []),
  ];

  // Lógica ultra-segura para el nombre:
  // Si userName existe, saca la primera palabra. Si no, usa "Usuario"
  const nombreAMostrar = userName ? userName.split(" ")[0] : "Usuario";
  const letraInicial = nombreAMostrar.charAt(0).toUpperCase();

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col z-[110] shadow-2xl ${isOpen ? "w-64" : "w-20"}`}
    >
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-3 animate-in fade-in duration-500">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/40 shrink-0">
              {letraInicial}
            </div>
            <div className="flex flex-col justify-center">
              {/* AQUÍ ESTÁ EL CAMBIO: Usamos nombreAMostrar directamente */}
              <span className="text-xs font-black text-white tracking-tighter uppercase leading-none mb-1.5">
                {nombreAMostrar}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
                <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {isAdmin ? "Admin" : "Asesor"}
                </span>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-xl hover:bg-slate-800 transition-colors ${!isOpen ? "mx-auto" : ""}`}
        >
          <svg
            className="w-5 h-5 text-slate-400 hover:text-white transition-colors"
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

      <nav className="flex-1 px-3 mt-4 space-y-2 flex flex-col overflow-y-auto custom-scroll-y">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={!isOpen ? item.label : ""}
            className={`w-full flex items-center rounded-2xl transition-all duration-300 ${isOpen ? "px-4 py-3.5 gap-4" : "p-4 justify-center"} ${
              activeTab === item.id
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && (
              <span className="text-[10px] font-black uppercase tracking-widest">
                {item.label}
              </span>
            )}
          </button>
        ))}

        <div
          className={`border-t border-slate-800 my-2 transition-all ${isOpen ? "mx-4" : "mx-2 w-8 self-center"}`}
        ></div>

        <button
          onClick={onExportClick}
          title={!isOpen ? "EXPORTAR" : ""}
          className={`w-full flex items-center rounded-2xl transition-all duration-300 ${isOpen ? "px-4 py-3.5 gap-4" : "p-4 justify-center"} text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 border border-transparent`}
        >
          <span className="text-lg">📥</span>
          {isOpen && (
            <span className="text-[10px] font-black uppercase tracking-widest">
              EXPORTAR DATA
            </span>
          )}
        </button>
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={onLogout}
          title={!isOpen ? "Cerrar Sesión" : ""}
          className={`w-full flex items-center rounded-2xl transition-all duration-300 ${isOpen ? "px-4 py-3 gap-4" : "p-3 justify-center"} text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent`}
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {isOpen && (
            <span className="text-[10px] font-black uppercase tracking-widest">
              Cerrar Sesión
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
