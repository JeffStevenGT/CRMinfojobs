import React from "react";

export default function ReportsView({ leads }) {
  // --- LÓGICA DE CÁLCULO TOTAL ---
  const total = leads.length || 0;
  const inscritos = leads.filter((l) => l.estado === "Inscrito").length;
  const finalizados = leads.filter((l) => l.status === "finalizado").length;
  const agendados = leads.filter((l) => l.estado === "Agendado").length;
  const buzos = leads.filter((l) => l.agendaStatus === "buzo").length;

  // KPIs de Riesgo y Operaciones
  const enRiesgo = leads.filter(
    (l) => l.estado === "Inscrito" && parseInt(l.faltas) >= 3,
  ).length;
  const sinDocs = leads.filter(
    (l) => l.estado === "Inscrito" && (!l.doc1 || !l.doc2),
  ).length;
  const sinUser = leads.filter(
    (l) => l.estado === "Inscrito" && !l.tieneUsuarios,
  ).length;

  // KPIs de Origen y Calidad
  const referidos = leads.filter((l) => l.esReferido === "si").length;
  const tasaConversion = total > 0 ? ((inscritos / total) * 100).toFixed(1) : 0;
  const efectividadLlamadas =
    agendados > 0 ? (((agendados - buzos) / agendados) * 100).toFixed(1) : 0;

  // --- FINANZAS (Ajusta tu comisión aquí) ---
  const COMISION_VALOR = 50;
  const comisionesAcumuladas = inscritos * COMISION_VALOR;

  // Distribución por Provincia (Castilla-La Mancha)
  const provincias = [
    "Toledo",
    "Albacete",
    "Ciudad Real",
    "Cuenca",
    "Guadalajara",
  ];
  const statsProvincias = provincias
    .map((p) => ({
      name: p,
      count: leads.filter((l) => l.provincia === p).length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-10">
      {/* 1. LOS "BIG TWO" + COMISIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TARJETA DINERO (EL REY) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">
                Comisiones Estimadas
              </h3>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-6xl font-black text-white">
                  €{comisionesAcumuladas}
                </span>
                <span className="text-sm font-bold text-slate-400">
                  Total Acumulado
                </span>
              </div>
            </div>
            <div className="mt-8 flex gap-8 border-t border-white/10 pt-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                  Inscritos Reales
                </p>
                <p className="text-2xl font-black text-emerald-400">
                  {inscritos}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                  Tasa de Cierre
                </p>
                <p className="text-2xl font-black text-indigo-400">
                  {tasaConversion}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ÉXITO ACADÉMICO */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-4">
            🏆
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Cursos Finalizados
          </h3>
          <span className="text-5xl font-black text-slate-800 mt-2">
            {finalizados}
          </span>
          <p className="text-[9px] text-slate-400 font-bold mt-4 uppercase">
            Meta de Calidad Lograda
          </p>
        </div>
      </div>

      {/* 2. OPERATIVIDAD Y RIESGOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Leads en Riesgo
          </p>
          <div className="flex items-end justify-between mt-2">
            <span
              className={`text-2xl font-black ${enRiesgo > 0 ? "text-rose-500" : "text-slate-300"}`}
            >
              {enRiesgo}
            </span>
            <span className="text-[8px] font-bold text-rose-400 bg-rose-50 px-2 py-0.5 rounded-full">
              +3 Faltas
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Docs Pendientes
          </p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-black text-amber-500">
              {sinDocs}
            </span>
            <span className="text-[8px] font-bold text-amber-400 bg-amber-50 px-2 py-0.5 rounded-full">
              Incompletos
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Sin Usuarios
          </p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-black text-sky-500">{sinUser}</span>
            <span className="text-[8px] font-bold text-sky-400 bg-sky-50 px-2 py-0.5 rounded-full">
              Accesos Pend.
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Fidelidad (Referidos)
          </p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-black text-indigo-500">
              {referidos}
            </span>
            <span className="text-[8px] font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full">
              Boca a Boca
            </span>
          </div>
        </div>
      </div>

      {/* 3. MÉTRICAS ESTRATÉGICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RANKING PROVINCIAS */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
            Penetración en Castilla-La Mancha
          </h3>
          <div className="space-y-4">
            {statsProvincias.map((prov) => (
              <div key={prov.name} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-slate-600">{prov.name}</span>
                  <span className="text-slate-400">{prov.count} Leads</span>
                </div>
                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{
                      width: `${total > 0 ? (prov.count / total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EFICIENCIA DE LLAMADAS */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
              Salud de la Agenda
            </h3>
            <p className="text-[9px] text-slate-300 font-medium uppercase">
              Relación Contacto vs Buzos
            </p>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-50"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={314}
                  strokeDashoffset={314 - (314 * efectividadLlamadas) / 100}
                  className="text-sky-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-800">
                  {efectividadLlamadas}%
                </span>
                <span className="text-[7px] font-black uppercase text-slate-400">
                  Éxito
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                <span className="text-[10px] font-bold text-slate-600">
                  Contactados: {agendados - buzos}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span className="text-[10px] font-bold text-slate-600">
                  Buzos: {buzos}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 italic leading-tight">
                Tu efectividad al teléfono es vital para las comisiones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
