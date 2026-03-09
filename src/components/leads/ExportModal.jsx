import React, { useState } from "react";

export default function ExportModal({ onClose, leads }) {
  const [filtroProyecto, setFiltroProyecto] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const leadsAExportar = leads.filter((lead) => {
    const matchProyecto =
      filtroProyecto === "Todos" || lead.proyecto === filtroProyecto;
    const matchEstado =
      filtroEstado === "Todos" || lead.estado === filtroEstado;
    return matchProyecto && matchEstado;
  });

  const handleExport = () => {
    if (leadsAExportar.length === 0)
      return alert("No hay datos para exportar con estos filtros.");

    const headers = [
      "Fecha Registro",
      "Nombre",
      "WhatsApp",
      "Email",
      "Provincia",
      "Campaña",
      "Estado",
      "Estatus",
      "Faltas",
      "Situación Laboral",
      "Comentarios",
    ];

    const rows = leadsAExportar.map((l) => {
      const fecha = l.fechaCreacion
        ? new Date(l.fechaCreacion).toLocaleDateString("es-ES")
        : "---";
      const faltas = l.asistencia
        ? (20 - l.asistencia.filter(Boolean).length).toString()
        : "0";
      const comentarios = (l.comentarios || "").replace(/\n/g, " ");

      return [
        fecha,
        l.nombre || "---",
        l.whatsapp || "---",
        l.email || "---",
        l.provincia || "---",
        l.proyecto || "CLM",
        l.estado || "---",
        l.status || "---",
        faltas,
        l.situacion || "---",
        comentarios,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      headers.join(",") +
      "\n" +
      rows
        .map((e) =>
          e
            .map((cell) => `"${(cell || "").toString().replace(/"/g, '""')}"`)
            .join(","),
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Reporte_${filtroProyecto}_${filtroEstado}_${new Date().getTime()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onClose();
  };

  const inputClass =
    "w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-shadow cursor-pointer";
  const labelClass =
    "text-[9px] font-black text-slate-400 uppercase ml-1 mb-1 block tracking-widest";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">
              Exportar Base de Datos
            </h2>
            <p className="text-[9px] text-emerald-500 font-bold uppercase mt-1">
              Formato CSV / Excel
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-xl border border-slate-100 transition-colors"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className={labelClass}>Selecciona la Campaña</label>
            <select
              value={filtroProyecto}
              onChange={(e) => setFiltroProyecto(e.target.value)}
              className={inputClass}
            >
              <option value="Todos">Todas las Campañas</option>
              <option value="CLM">CLM</option>
              <option value="Lideres">Líderes</option>
              <option value="Sandetel">Sandetel</option>
              <option value="MasDigital">MasDigital</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Selecciona el Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className={inputClass}
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Agendado">📞 Agendados</option>
              <option value="Interesado">📝 Interesados</option>
              <option value="Registrado">🪪 Registrados</option>
              <option value="Inscrito">⏳ Matriculados (Inscritos)</option>
              <option value="No Interesado">🛑 No Interesados</option>
            </select>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3">
            <div className="bg-white text-indigo-500 w-10 h-10 rounded-lg flex items-center justify-center font-black shadow-sm shrink-0">
              {leadsAExportar.length}
            </div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
              Clientes listos para exportar con los filtros seleccionados.
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={leadsAExportar.length === 0}
            className="bg-emerald-500 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Descargar Excel
          </button>
        </div>
      </div>
    </div>
  );
}
