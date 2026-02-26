import React from "react";

export default function KanbanView({
  leads,
  onUpdateLead,
  onEditLead,
  onFollowUp,
  onFinalize,
}) {
  // 1. COLUMNAS MAPDEADAS EXACTAMENTE A TU EXPLICACIÓN
  const columns = [
    {
      id: "agendado",
      title: "📞 Agendados (Evaluando)",
      color: "bg-slate-50 border-slate-200 text-slate-700",
      filter: (l) => l.estado === "Agendado",
    },
    {
      id: "interesado",
      title: "📝 Interesados (Docs)",
      color: "bg-blue-50 border-blue-200 text-blue-800",
      filter: (l) => l.estado === "Interesado",
    },
    {
      id: "pendiente",
      title: "⏳ Inscrito (Pend. Inicio)",
      color: "bg-amber-50 border-amber-200 text-amber-800",
      filter: (l) => l.estado === "Inscrito" && l.status === "pendiente",
    },
    {
      id: "curso",
      title: "📚 En Curso",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800",
      filter: (l) => l.estado === "Inscrito" && l.status === "en curso",
    },
    {
      id: "finalizado",
      title: "🏆 Finalizados (Cobro)",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
      filter: (l) => l.estado === "Inscrito" && l.status === "finalizado",
    },
    {
      id: "perdido",
      title: "🛑 Bajas / Perdidos",
      color: "bg-rose-50 border-rose-200 text-rose-800",
      // Muestra a los que no les interesó, o a los inscritos que abandonaron/fueron no aptos
      filter: (l) =>
        l.estado === "No Interesado" ||
        (l.estado === "Inscrito" &&
          (l.status === "no apto" || l.status === "abandonado")),
    },
  ];

  // 2. LÓGICA INTELIGENTE DE DRAG AND DROP
  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData("leadId", leadId);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (colId === "agendado") {
      onUpdateLead(lead.id, "estado", "Agendado");
    } else if (colId === "interesado") {
      onUpdateLead(lead.id, "estado", "Interesado");
    } else if (colId === "pendiente") {
      onUpdateLead(lead.id, "estado", "Inscrito");
      onUpdateLead(lead.id, "status", "pendiente");
    } else if (colId === "curso") {
      onUpdateLead(lead.id, "estado", "Inscrito");
      onUpdateLead(lead.id, "status", "en curso");
    } else if (colId === "finalizado") {
      onFinalize(lead); // Abre el modal de fechas
    } else if (colId === "perdido") {
      // Lógica Condicional: Si ya estaba inscrito es Abandono, si no, es No Interesado
      if (lead.estado === "Inscrito") {
        onUpdateLead(lead.id, "status", "abandonado");
      } else {
        onUpdateLead(lead.id, "estado", "No Interesado");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 3. COMPONENTE DE TARJETA (CARD)
  const LeadCard = ({ lead }) => {
    const faltas = 20 - (lead.asistencia || []).filter((d) => d).length;
    const isAlerta = faltas >= 2 && lead.status === "en curso";
    const isPerdido =
      lead.estado === "No Interesado" ||
      lead.status === "no apto" ||
      lead.status === "abandonado";

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, lead.id)}
        className={`bg-white p-3 rounded-xl shadow-sm border-l-4 cursor-grab active:cursor-grabbing transition-all hover:shadow-md mb-3 relative overflow-hidden
          ${isAlerta ? "border-l-orange-500 bg-orange-50/50 ring-1 ring-orange-200 animate-pulse" : "border-l-indigo-400 border border-slate-100"}
          ${isPerdido ? "opacity-70 grayscale" : ""}
        `}
      >
        {/* ETIQUETA VISUAL PARA LA COLUMNA DE PÉRDIDAS */}
        {isPerdido && (
          <div className="absolute top-0 right-0 bg-rose-500 text-white text-[6px] font-black uppercase px-2 py-0.5 rounded-bl-lg z-10">
            {lead.estado === "No Interesado"
              ? "NO INTERESÓ"
              : lead.status === "no apto"
                ? "NO APTO (3 Faltas)"
                : "ABANDONÓ"}
          </div>
        )}

        {/* ENCABEZADO DE LA TARJETA */}
        <div className="flex justify-between items-start mb-2 mt-1">
          <div className="font-bold text-[11px] text-slate-800 leading-tight pr-4">
            {lead.nombre}
            <div className="text-[8px] text-slate-400 mt-0.5 uppercase tracking-wide">
              {lead.provincia || "S/P"}
            </div>
          </div>

          {/* FUEGUITO Y WHATSAPP RÁPIDO */}
          <div className="flex items-center gap-1 shrink-0 relative z-20">
            {(lead.estado === "Agendado" || lead.estado === "Interesado") &&
              lead.temperatura && (
                <span className="text-[10px]" title={lead.temperatura}>
                  {lead.temperatura === "Caliente"
                    ? "🔥"
                    : lead.temperatura === "Tibio"
                      ? "☀️"
                      : "❄️"}
                </span>
              )}
            <button
              onClick={() =>
                onUpdateLead(lead.id, "respondioWpp", !lead.respondioWpp)
              }
              className={`p-1 rounded-md transition-colors ${lead.respondioWpp ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400 hover:text-emerald-500"}`}
              title="Respondió WhatsApp"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* METRICAS OPERATIVAS (Solo para los Inscritos que no estén dados de baja) */}
        {lead.estado === "Inscrito" && !isPerdido && (
          <div className="flex gap-2 mb-2 relative z-20">
            {/* BOTÓN LLAVE (Credenciales) */}
            <button
              onClick={() =>
                onUpdateLead(lead.id, "tieneUsuarios", !lead.tieneUsuarios)
              }
              className={`flex-1 py-1 rounded border text-[8px] font-black flex items-center justify-center gap-1 transition-all ${lead.tieneUsuarios ? "bg-sky-50 text-sky-600 border-sky-200" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}
              title="¿Tiene credenciales?"
            >
              <svg
                className="w-2.5 h-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              {lead.tieneUsuarios ? "OK" : "PND"}
            </button>

            {/* BOTÓN ASISTENCIA (Semáforo) */}
            <button
              onClick={() => onFollowUp(lead)}
              className={`flex-1 py-1 rounded border text-[8px] font-black flex items-center justify-center gap-1 transition-all hover:brightness-95 ${
                faltas === 0
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : faltas === 1
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-orange-100 text-orange-600 border-orange-300 shadow-inner"
              }`}
            >
              <svg
                className="w-2.5 h-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              {faltas} FALTAS
            </button>
          </div>
        )}

        {/* PIE DE TARJETA: Fechas o Ver Perfil */}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50 relative z-20">
          <div className="text-[7.5px] font-bold text-slate-400 flex flex-col gap-0.5">
            {lead.inicioClase && (
              <span>
                INI:{" "}
                {new Date(lead.inicioClase).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            )}
            {lead.fechaFinClase && (
              <span className="text-emerald-500">
                FIN:{" "}
                {new Date(lead.fechaFinClase).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            )}
          </div>
          <button
            onClick={() => onEditLead(lead)}
            className="text-[8px] font-black text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 px-2 py-1 bg-indigo-50 rounded-lg transition-colors"
          >
            PERFIL
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 h-full pb-20 overflow-x-auto p-1 custom-scrollbar items-start">
      {columns.map((col) => {
        const columnLeads = leads.filter(col.filter);
        return (
          <div
            key={col.id}
            className="flex-shrink-0 w-[260px] flex flex-col max-h-full"
            onDrop={(e) => handleDrop(e, col.id)}
            onDragOver={handleDragOver}
          >
            {/* CABECERA DE COLUMNA */}
            <div
              className={`px-4 py-3 rounded-2xl border shadow-sm mb-3 flex justify-between items-center ${col.color}`}
            >
              <h3 className="text-[10px] font-black uppercase tracking-widest">
                {col.title}
              </h3>
              <span className="bg-white/60 px-2 py-0.5 rounded-lg text-[9px] font-black shadow-sm">
                {columnLeads.length}
              </span>
            </div>

            {/* ZONA DND (ZONA DE SOLTAR) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar rounded-xl border-2 border-dashed border-transparent hover:border-indigo-200 transition-colors bg-slate-50/50 p-2 min-h-[200px]">
              {columnLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
              {columnLeads.length === 0 && (
                <div className="h-full flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center px-4">
                  Arrastra leads aquí
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
