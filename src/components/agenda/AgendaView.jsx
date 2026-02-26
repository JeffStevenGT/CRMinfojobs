import React from "react";

export default function AgendaView({ leads, onUpdateLead, onEditLead }) {
  const hoy = new Date().toISOString().split("T")[0];

  const llamadasHoy = leads.filter(
    (l) =>
      (l.estado === "Agendado" || l.estado === "Interesado") &&
      l.fechaLlamada &&
      l.fechaLlamada.startsWith(hoy),
  );

  // LÓGICA CORREGIDA: Solo avisa de documentos faltantes. No avisa de accesos.
  const tramitesPendientes = leads.filter(
    (l) => l.estado === "Registrado" && (!l.doc1 || !l.doc2),
  );

  const riesgoAbandono = leads.filter((l) => {
    if (l.estado !== "Inscrito" || l.status !== "en curso") return false;
    const faltas = 20 - (l.asistencia || []).filter((d) => d).length;
    return faltas >= 2;
  });

  const handleWhatsApp = (phone) => {
    if (phone)
      window.open(`https://wa.me/34${phone.replace(/\D/g, "")}`, "_blank");
  };

  const AgendaCard = ({ lead, tipo }) => {
    const proj = lead.proyecto || "CLM";
    const faltas = 20 - (lead.asistencia || []).filter((d) => d).length;

    return (
      <div className="bg-white p-3 rounded-xl shadow-sm border-l-[3px] border-l-slate-300 mb-2.5 relative overflow-hidden group hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-2">
          <div className="min-w-0 flex-1 leading-tight">
            <h4 className="font-black text-[10.5px] text-slate-800 uppercase truncate">
              {lead.nombre}
            </h4>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">
                {proj}
              </span>
              <span className="text-slate-300 text-[6px]">•</span>
              <span className="text-[7px] font-bold text-slate-400 uppercase">
                {lead.temperatura || "Frío"}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleWhatsApp(lead.whatsapp)}
            className="text-slate-300 hover:text-emerald-500 transition-colors p-0.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
          {tipo === "llamada" && (
            <>
              <span className="text-[8px] font-black text-indigo-600 uppercase bg-indigo-50 px-1.5 py-0.5 rounded tracking-widest">
                🕒{" "}
                {lead.fechaLlamada?.split("T")[1]?.slice(0, 5) || "PENDIENTE"}
              </span>
              <button
                onClick={() => onEditLead(lead)}
                className="text-[7.5px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
              >
                Perfil →
              </button>
            </>
          )}

          {tipo === "tramite" && (
            <div className="flex gap-1.5 w-full">
              <button
                onClick={() => onUpdateLead(lead.id, "doc1", !lead.doc1)}
                className={`flex-1 py-1 rounded text-[7px] font-black uppercase transition-all border ${lead.doc1 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300"}`}
              >
                {lead.situacion === "Autonomo" ? "RECIBO" : "NÓMINA"}
              </button>
              <button
                onClick={() => onUpdateLead(lead.id, "doc2", !lead.doc2)}
                className={`flex-1 py-1 rounded text-[7px] font-black uppercase transition-all border ${lead.doc2 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300"}`}
              >
                {lead.situacion === "Autonomo" ? "IAE" : "CONTRATO"}
              </button>
            </div>
          )}

          {tipo === "riesgo" && (
            <div className="flex justify-between items-center w-full">
              <span className="text-[8px] font-black text-rose-600 uppercase bg-rose-50 px-1.5 py-0.5 rounded tracking-widest animate-pulse">
                ⚠️ {faltas} Faltas
              </span>
              <button
                onClick={() => onEditLead(lead)}
                className="text-[7.5px] font-black text-slate-400 hover:text-rose-600 uppercase tracking-widest transition-colors"
              >
                Gestionar →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 h-full items-start pb-6 animate-in fade-in duration-300">
      <div className="flex-shrink-0 w-[260px] flex flex-col h-full">
        <div className="px-3 py-2 rounded-xl border shadow-sm mb-3 flex justify-between items-center bg-indigo-50 border-indigo-100 text-indigo-800 shrink-0">
          <h3 className="text-[8.5px] font-black uppercase tracking-widest">
            📞 Llamadas del Día
          </h3>
          <span className="bg-white/60 px-2 py-0.5 rounded-lg text-[8px] font-black">
            {llamadasHoy.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar rounded-xl bg-slate-50/40 p-1.5 border border-slate-100/50">
          {llamadasHoy.map((l) => (
            <AgendaCard key={l.id} lead={l} tipo="llamada" />
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 w-[260px] flex flex-col h-full">
        <div className="px-3 py-2 rounded-xl border shadow-sm mb-3 flex justify-between items-center bg-purple-50 border-purple-100 text-purple-800 shrink-0">
          <h3 className="text-[8.5px] font-black uppercase tracking-widest">
            ⏳ Trámites Pendientes
          </h3>
          <span className="bg-white/60 px-2 py-0.5 rounded-lg text-[8px] font-black">
            {tramitesPendientes.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar rounded-xl bg-slate-50/40 p-1.5 border border-slate-100/50">
          {tramitesPendientes.map((l) => (
            <AgendaCard key={l.id} lead={l} tipo="tramite" />
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 w-[260px] flex flex-col h-full">
        <div className="px-3 py-2 rounded-xl border shadow-sm mb-3 flex justify-between items-center bg-rose-50 border-rose-100 text-rose-800 shrink-0">
          <h3 className="text-[8.5px] font-black uppercase tracking-widest">
            🚨 Riesgo de Abandono
          </h3>
          <span className="bg-white/60 px-2 py-0.5 rounded-lg text-[8px] font-black">
            {riesgoAbandono.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar rounded-xl bg-slate-50/40 p-1.5 border border-slate-100/50">
          {riesgoAbandono.map((l) => (
            <AgendaCard key={l.id} lead={l} tipo="riesgo" />
          ))}
        </div>
      </div>
    </div>
  );
}
