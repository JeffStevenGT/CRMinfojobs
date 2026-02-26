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
    { id: "comisiones", label: "COMISIONES", icon: "💰" },
  ];

  return (
    <>
      {/* Overlay para móviles cuando el sidebar está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-[110] w-64 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:-ml-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo / Branding */}
          <div className="p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <span className="text-xl font-black">L</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-800 tracking-tighter">
                  LUIS CRM
                </span>
                <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                  Engineering
                </span>
              </div>
            </div>
          </div>

          {/* Menú Principal */}
          <nav className="flex-1 px-4 space-y-1.5">
            <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Gestión Principal
            </p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  // En móviles, cerramos el sidebar al elegir una opción
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {item.label}
                </span>
                {activeTab === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                )}
              </button>
            ))}
          </nav>

          {/* Pie del Sidebar */}
          <div className="p-6 mt-auto">
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">
                Usuario Activo
              </p>
              <p className="text-[10px] font-black text-slate-800 text-center">
                LUIS • SENATI
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
