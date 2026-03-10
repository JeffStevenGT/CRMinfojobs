import React from "react";

export default function AgendaView({ leads, onUpdateLead, onEditLead }) {
  const hoy = new Date().toISOString().split("T")[0];

  // --- 1. LÓGICA DE PUNTOS Y TRAMOS DE PAGO (SOLES) ---
  const inscritos = leads.filter(
    (l) => l.estado === "Inscrito" || l.status === "finalizado",
  );

  // Suma de puntos según el proyecto
  const totalPuntos = inscritos.reduce((acc, lead) => {
    const p = lead.proyecto?.toUpperCase() || "";
    if (p === "CLM") return acc + 2;
    if (p === "MASDIGITAL") return acc + 1.5;
    return acc + 1; // Lideres, Sandetel y otros
  }, 0);

  // DETERMINACIÓN DEL VALOR DEL PUNTO SEGÚN TUS TRAMOS EXACTOS
  const obtenerValorPunto = (pts) => {
    if (pts >= 28) return 75; // Tramo 6
    if (pts >= 24) return 62.5; // Tramo 5
    if (pts >= 20) return 50; // Tramo 4
    if (pts >= 16) return 37.5; // Tramo 3
    if (pts >= 12) return 25; // Tramo 2
    if (pts >= 8) return 20; // Tramo 1
    return 0; // Menos de 8 puntos aún no comisiona o tramo base
  };

  const valorActualPunto = obtenerValorPunto(totalPuntos);
  const pagoTotalSoles = totalPuntos * valorActualPunto;

  // --- 2. FILTROS OPERATIVOS ---
  const llamadasHoy = leads.filter(
    (l) =>
      (l.estado === "Agendado" || l.estado === "Interesado") &&
      l.fechaLlamada?.startsWith(hoy),
  );

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

  // --- 3. COMPONENTE DE TARJETA ---
  const AgendaCard = ({ lead, tipo }) => {
    const proj = lead.proyecto || "CLM";
    const faltas = 20 - (lead.asistencia || []).filter((d) => d).length;

    const getProyectoColor = (proyecto) => {
      const p = proyecto?.toUpperCase();
      if (p === "CLM") return "text-indigo-500";
      if (p === "LIDERES") return "text-amber-500";
      if (p === "SANDETEL") return "text-cyan-500";
      if (p === "MASDIGITAL") return "text-fuchsia-500";
      return "text-slate-400";
    };

    return (
      <div className="bg-white/70 p-4 rounded-[2rem] border border-slate-100/50 mb-3 group hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
        <div className="flex justify-between items-start mb-2">
          <div className="min-w-0 flex-1 leading-tight">
            <h4 className="font-bold text-[11px] text-slate-700 uppercase truncate">
              {lead.nombre}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`text-[7.5px] font-black uppercase tracking-widest ${getProyectoColor(proj)}`}
              >
                {proj}
              </span>
              <span className="text-slate-300 text-[6px]">•</span>
              <span className="text-[7.5px] font-bold text-slate-400 uppercase">
                {lead.temperatura || "Frío"}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleWhatsApp(lead.whatsapp)}
            className="text-emerald-500 hover:scale-110 transition-transform p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
          {tipo === "llamada" && (
            <span className="text-[8.5px] font-black text-indigo-500 uppercase bg-indigo-50 px-2 py-1 rounded-lg tracking-widest">
              🕒 {lead.fechaLlamada?.split("T")[1]?.slice(0, 5) || "Pendiente"}
            </span>
          )}
          {tipo === "tramite" && (
            <div className="flex gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${lead.doc1 ? "bg-emerald-400" : "bg-slate-200 shadow-inner"}`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full ${lead.doc2 ? "bg-emerald-400" : "bg-slate-200 shadow-inner"}`}
              ></div>
            </div>
          )}
          {tipo === "riesgo" && (
            <span className="text-[8.5px] font-black text-rose-500 uppercase bg-rose-50 px-2 py-1 rounded-lg tracking-widest animate-pulse">
              ⚠️ {faltas} Faltas
            </span>
          )}
          <button
            onClick={() => onEditLead(lead)}
            className="text-[8.5px] font-bold text-slate-400 hover:text-slate-700 uppercase transition-colors"
          >
            Ver Perfil →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-700 pb-10">
      {/* --- DASHBOARD DE COMISIONES (SOLES) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 shrink-0">
        <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Puntos Acumulados
            </p>
            <h4 className="text-xl font-black text-slate-800">
              {totalPuntos}{" "}
              <span className="text-[10px] text-indigo-500 uppercase tracking-tighter">
                pts
              </span>
            </h4>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase italic">
              Valor del Punto
            </p>
            <p className="text-[11px] font-black text-indigo-600">
              S/ {valorActualPunto}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-[2.5rem] shadow-xl flex items-center justify-between text-white">
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Acumulado Total
            </p>
            <h4 className="text-2xl font-black text-emerald-400 tracking-tighter">
              S/ {pagoTotalSoles.toLocaleString()}
            </h4>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-xl">
            💰
          </div>
        </div>

        <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Inscritos Totales
            </p>
            <h4 className="text-xl font-black text-slate-800">
              {inscritos.length}
            </h4>
          </div>
          <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-lg">
            🎓
          </div>
        </div>
      </div>

      {/* --- COLUMNAS OPERATIVAS --- */}
      <div className="flex flex-col lg:flex-row gap-6 h-full items-start overflow-hidden">
        <div className="flex-1 min-w-[300px] bg-slate-50/50 rounded-[2.5rem] p-6 flex flex-col h-full max-h-[72vh]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-6 px-2">
            Llamadas de Hoy
          </h3>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {llamadasHoy.length > 0 ? (
              llamadasHoy.map((l) => (
                <AgendaCard key={l.id} lead={l} tipo="llamada" />
              ))
            ) : (
              <p className="text-center text-[9px] font-bold text-slate-300 uppercase mt-10 tracking-widest">
                Sin llamadas hoy
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-[300px] bg-slate-50/50 rounded-[2.5rem] p-6 flex flex-col h-full max-h-[72vh]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-2">
            Trámites de Inscripción
          </h3>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {tramitesPendientes.length > 0 ? (
              tramitesPendientes.map((l) => (
                <AgendaCard key={l.id} lead={l} tipo="tramite" />
              ))
            ) : (
              <p className="text-center text-[9px] font-bold text-slate-300 uppercase mt-10 tracking-widest">
                Todo al día
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-[300px] bg-slate-50/50 rounded-[2.5rem] p-6 flex flex-col h-full max-h-[72vh]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-6 px-2">
            Riesgo de Abandono
          </h3>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {riesgoAbandono.length > 0 ? (
              riesgoAbandono.map((l) => (
                <AgendaCard key={l.id} lead={l} tipo="riesgo" />
              ))
            ) : (
              <p className="text-center text-[9px] font-bold text-slate-300 uppercase mt-10 tracking-widest">
                Sin riesgos
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
