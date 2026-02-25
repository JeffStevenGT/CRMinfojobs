import React, { useState } from "react";
import { auth } from "../../firebase"; // Asegúrate de que la ruta sea correcta

export default function Sidebar({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
}) {
  const [openAccordion, setOpenAccordion] = useState("clientes");

  // --- ICONOS ---
  const MenuIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );

  const UsersIcon = () => (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );

  const CalendarIcon = () => (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );

  const ChartIcon = () => (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );

  const LogoutIcon = () => (
    <svg
      className="w-5 h-5 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );

  const ChevronIcon = ({ isExpanded }) => (
    <svg
      className={`w-3.5 h-3.5 ml-auto transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  const handleToggle = (section) => {
    if (!isOpen) {
      setIsOpen(true);
      setOpenAccordion(section);
    } else {
      setOpenAccordion(openAccordion === section ? null : section);
    }
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      auth.signOut();
    }
  };

  return (
    <aside
      className={`bg-[#4F46E5] text-white flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] z-20 relative shadow-xl ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* LOGO */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 flex-shrink-0">
        <div
          className={`overflow-hidden transition-all duration-500 ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}
        >
          <span className="text-lg font-bold tracking-widest uppercase">
            Infojobs
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <MenuIcon />
        </button>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 py-6 space-y-4 px-3 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {/* BLOQUE: DIRECTORIO */}
        <div>
          <button
            onClick={() => handleToggle("clientes")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab.startsWith("clientes-") ? "bg-white/15" : "hover:bg-white/5"}`}
          >
            <div className="text-indigo-100 group-hover:text-white">
              <UsersIcon />
            </div>
            <span
              className={`ml-3 text-sm font-medium transition-all duration-500 ${isOpen ? "opacity-100 flex-1 flex items-center" : "opacity-0 hidden"}`}
            >
              Directorio{" "}
              <ChevronIcon isExpanded={openAccordion === "clientes"} />
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${isOpen && openAccordion === "clientes" ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
          >
            <div className="pl-10 pr-2 space-y-1">
              <button
                onClick={() => setActiveTab("clientes-clm")}
                className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition-all ${activeTab === "clientes-clm" ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/5"}`}
              >
                CLM Turismo
              </button>
              <button
                onClick={() => setActiveTab("clientes-endesa")}
                className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition-all ${activeTab === "clientes-endesa" ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/5"}`}
              >
                ENDESA
              </button>
            </div>
          </div>
        </div>

        {/* BLOQUE: AGENDA */}
        <div>
          <button
            onClick={() => handleToggle("agenda")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab.startsWith("agenda-") ? "bg-white/15" : "hover:bg-white/5"}`}
          >
            <div className="text-indigo-100 group-hover:text-white">
              <CalendarIcon />
            </div>
            <span
              className={`ml-3 text-sm font-medium transition-all duration-500 ${isOpen ? "opacity-100 flex-1 flex items-center" : "opacity-0 hidden"}`}
            >
              Agenda <ChevronIcon isExpanded={openAccordion === "agenda"} />
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${isOpen && openAccordion === "agenda" ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
          >
            <div className="pl-10 pr-2 space-y-1">
              <button
                onClick={() => setActiveTab("agenda-clm")}
                className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition-all ${activeTab === "agenda-clm" ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/5"}`}
              >
                CLM Turismo
              </button>
              <button
                onClick={() => setActiveTab("agenda-endesa")}
                className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition-all ${activeTab === "agenda-endesa" ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/5"}`}
              >
                ENDESA
              </button>
            </div>
          </div>
        </div>

        {/* BLOQUE: REPORTES */}
        <div>
          <button
            onClick={() => handleToggle("reportes")}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab.startsWith("reportes-") ? "bg-white/15" : "hover:bg-white/5"}`}
          >
            <div className="text-indigo-100 group-hover:text-white">
              <ChartIcon />
            </div>
            <span
              className={`ml-3 text-sm font-medium transition-all duration-500 ${isOpen ? "opacity-100 flex-1 flex items-center" : "opacity-0 hidden"}`}
            >
              Reportes <ChevronIcon isExpanded={openAccordion === "reportes"} />
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${isOpen && openAccordion === "reportes" ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
          >
            <div className="pl-10 pr-2 space-y-1">
              <button
                onClick={() => setActiveTab("reportes-clm")}
                className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition-all ${activeTab === "reportes-clm" ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/5"}`}
              >
                CLM Turismo
              </button>
              <button
                onClick={() => setActiveTab("reportes-endesa")}
                className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition-all ${activeTab === "reportes-endesa" ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/5"}`}
              >
                ENDESA
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* BOTÓN CERRAR SESIÓN (AL FINAL) */}
      <div className="p-3 border-t border-white/10 mt-auto">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-rose-500/20 text-indigo-100 hover:text-white`}
        >
          <div className="group-hover:rotate-12 transition-transform">
            <LogoutIcon />
          </div>
          <span
            className={`ml-3 text-sm font-medium transition-all duration-500 ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}
          >
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
}
