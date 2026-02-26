import React from "react";

export default function KanbanView({
  leads,
  onUpdateLead,
  onEditLead,
  onFollowUp,
  onFinalize,
}) {
  const columns = [
    {
      id: "agendado",
      title: "📞 Agendados",
      color: "bg-slate-50 border-slate-200 text-slate-700",
      filter: (l) => l.estado === "Agendado",
    },
    {
      id: "interesado",
      title: "📝 Interesados",
      color: "bg-blue-50 border-blue-200 text-blue-800",
      filter: (l) => l.estado === "Interesado",
    },
    {
      id: "registrado",
      title: "🪪 Registrados",
      color: "bg-purple-50 border-purple-200 text-purple-800",
      filter: (l) => l.estado === "Registrado",
    },
    {
      id: "pendiente",
      title: "⏳ Matriculados",
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
      title: "🏆 Finalizados",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
      filter: (l) => l.estado === "Inscrito" && l.status === "finalizado",
    },
    {
      id: "perdido",
      title: "🛑 Bajas / No Int.",
      color: "bg-rose-50 border-rose-200 text-rose-800",
      filter: (l) =>
        l.estado === "No Interesado" ||
        (l.estado === "Inscrito" &&
          (l.status === "no apto" || l.status === "abandonado")),
    },
  ];

  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData("leadId", leadId);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (colId === "agendado") onUpdateLead(lead.id, "estado", "Agendado");
    else if (colId === "interesado")
      onUpdateLead(lead.id, "estado", "Interesado");
    else if (colId === "registrado")
      onUpdateLead(lead.id, "estado", "Registrado");
    else if (colId === "pendiente") {
      onUpdateLead(lead.id, "estado", "Inscrito");
      onUpdateLead(lead.id, "status", "pendiente");
    } else if (colId === "curso") {
      onUpdateLead(lead.id, "estado", "Inscrito");
      onUpdateLead(lead.id, "status", "en curso");
    } else if (colId === "finalizado") onFinalize(lead);
    else if (colId === "perdido") {
      if (lead.estado === "Inscrito")
        onUpdateLead(lead.id, "status", "abandonado");
      else onUpdateLead(lead.id, "estado", "No Interesado");
    }
  };

  const LeadCard = ({ lead }) => {
    const proj = lead.proyecto || "CLM";
    const projectColor =
      proj === "Lideres"
        ? "bg-amber-400"
        : proj === "Sandetel"
          ? "bg-cyan-500"
          : "bg-indigo-500";

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, lead.id)}
        className="bg-white p-3 pt-3.5 rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border-l-4 border-l-slate-300 mb-2.5 relative overflow-hidden group hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
      >
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${projectColor}`}
        ></div>

        <div className="flex justify-between items-start mb-1.5">
          <div className="min-w-0 flex-1">
            <h4 className="font-black text-[10.5px] text-slate-800 uppercase truncate leading-tight">
              {lead.nombre}
            </h4>
            <p className="text-[7px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
              {proj} • {lead.provincia || "S/P"}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {["Agendado", "Interesado"].includes(lead.estado) && (
              <span className="text-[10px]">
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
              className={`p-1 rounded-md transition-colors ${lead.respondioWpp ? "text-emerald-500 bg-emerald-50" : "text-slate-200 hover:text-emerald-400"}`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-1.5">
          {["Interesado", "Registrado"].includes(lead.estado) && (
            <>
              <button
                onClick={() => onUpdateLead(lead.id, "doc1", !lead.doc1)}
                className={`flex-1 py-1 rounded-lg border text-[7px] font-black ${lead.doc1 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-100"}`}
              >
                {lead.situacion === "Autonomo" ? "REC" : "NOM"}
              </button>
              <button
                onClick={() => onUpdateLead(lead.id, "doc2", !lead.doc2)}
                className={`flex-1 py-1 rounded-lg border text-[7px] font-black ${lead.doc2 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-100"}`}
              >
                {lead.situacion === "Autonomo" ? "IAE" : "CON"}
              </button>
            </>
          )}

          {/* AQUÍ ESTÁ LA LÓGICA CORREGIDA: Solo aparece si está En Curso */}
          {lead.estado === "Inscrito" && lead.status === "en curso" && (
            <button
              onClick={() => onFollowUp(lead)}
              className="flex-1 py-1 rounded-lg border text-[7px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-500 hover:text-white transition-all"
            >
              Panel Alumno
            </button>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-50">
          <button
            onClick={() => onEditLead(lead)}
            className="text-[7.5px] font-black text-indigo-500 uppercase tracking-widest hover:underline"
          >
            Perfil ¬
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 h-full items-start pb-6">
      {columns.map((col) => {
        const columnLeads = leads.filter(col.filter);
        return (
          <div
            key={col.id}
            className="flex-shrink-0 w-[240px] flex flex-col h-full"
            onDrop={(e) => handleDrop(e, col.id)}
            onDragOver={handleDragOver}
          >
            <div
              className={`px-4 py-2.5 rounded-2xl border shadow-sm mb-3 flex justify-between items-center ${col.color}`}
            >
              <h3 className="text-[9px] font-black uppercase tracking-widest">
                {col.title}
              </h3>
              <span className="bg-white/60 px-2 py-0.5 rounded-lg text-[8px] font-black">
                {columnLeads.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar rounded-2xl bg-slate-50/40 p-2 border border-slate-100/50">
              {columnLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
