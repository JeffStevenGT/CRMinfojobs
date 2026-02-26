import React, { useState, useEffect } from "react";

export default function AgendaView({ leads, onUpdateLead, onEditLead }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hoyInicio = new Date();
  hoyInicio.setHours(0, 0, 0, 0);
  const hoyFin = new Date();
  hoyFin.setHours(23, 59, 59, 999);

  // 1. LLAMADAS (Ventas)
  const llamadas = leads.filter(
    (l) => l.estado === "Agendado" && l.fechaLlamada,
  );
  const llamadasVencidas = llamadas
    .filter((l) => new Date(l.fechaLlamada) < hoyInicio)
    .sort((a, b) => new Date(a.fechaLlamada) - new Date(b.fechaLlamada));
  const llamadasHoy = llamadas
    .filter(
      (l) =>
        new Date(l.fechaLlamada) >= hoyInicio &&
        new Date(l.fechaLlamada) <= hoyFin,
    )
    .sort((a, b) => new Date(a.fechaLlamada) - new Date(b.fechaLlamada));
  const llamadasFuturas = llamadas
    .filter((l) => new Date(l.fechaLlamada) > hoyFin)
    .sort((a, b) => new Date(a.fechaLlamada) - new Date(b.fechaLlamada));

  // 2. RIESGO COMERCIAL (Retención)
  const alertasRiesgo = leads.filter((l) => {
    if (l.estado !== "Inscrito" || l.status !== "en curso") return false;
    const faltas = 20 - (l.asistencia || []).filter((d) => d).length;
    return faltas === 2;
  });

  // 3. CUELLOS DE BOTELLA OPERATIVOS (NUEVA LÓGICA REFINADA)
  const matriculasBloqueadas = leads.filter((l) => {
    // Caso A: Está Registrado pero le faltan los papeles
    if (l.estado === "Registrado") return !l.doc1 || !l.doc2;
    // Caso B: Está Matriculado (Pendiente) pero no tiene accesos creados
    if (l.estado === "Inscrito" && l.status === "pendiente")
      return !l.tieneUsuarios;
    return false;
  });

  const handleWhatsApp = (phone) => {
    window.open(`https://wa.me/34${phone.replace(/\s+/g, "")}`, "_blank");
  };
  const formatHora = (fechaString) => {
    return new Date(fechaString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatFechaCorta = (fechaString) => {
    return new Date(fechaString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  };

  const TaskCard = ({ lead, type }) => {
    return (
      <div className="bg-white p-3.5 rounded-[1.2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group">
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 ${
            type === "urgente"
              ? "bg-rose-500"
              : type === "hoy"
                ? "bg-emerald-500"
                : type === "riesgo"
                  ? "bg-orange-500"
                  : type === "tramite"
                    ? "bg-purple-500"
                    : "bg-slate-300"
          }`}
        ></div>

        <div className="flex justify-between items-start pl-1.5">
          <div className="min-w-0 flex-1">
            <h4 className="font-black text-[11px] text-slate-800 leading-tight uppercase truncate">
              {lead.nombre}
            </h4>

            {/* Contexto de Llamadas */}
            {(type === "urgente" || type === "hoy" || type === "futura") && (
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded ${type === "urgente" ? "bg-rose-50 text-rose-600 border border-rose-100" : type === "hoy" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-500 border border-slate-100"}`}
                >
                  {type === "futura"
                    ? formatFechaCorta(lead.fechaLlamada)
                    : "HOY"}{" "}
                  • {formatHora(lead.fechaLlamada)}
                </span>
                {lead.temperatura && (
                  <span className="text-[10px]">
                    {lead.temperatura === "Caliente"
                      ? "🔥"
                      : lead.temperatura === "Tibio"
                        ? "☀️"
                        : "❄️"}
                  </span>
                )}
              </div>
            )}

            {/* Contexto de Riesgo */}
            {type === "riesgo" && (
              <p className="text-[8.5px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded inline-block mt-1 uppercase tracking-widest animate-pulse">
                ⚠️ URGENTE: 2 FALTAS
              </p>
            )}

            {/* Contexto Operativo (Papeles o Accesos) */}
            {type === "tramite" && (
              <div className="flex flex-wrap gap-1 mt-1">
                <span
                  className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase border ${lead.estado === "Registrado" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}
                >
                  {lead.estado === "Registrado"
                    ? "ETAPA: REGISTRADO"
                    : "ETAPA: MATRICULADO"}
                </span>
                {lead.estado === "Registrado" && !lead.doc1 && (
                  <span className="text-[8px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded uppercase">
                    FALTA {lead.situacion === "Autonomo" ? "REC" : "NOM"}
                  </span>
                )}
                {lead.estado === "Registrado" && !lead.doc2 && (
                  <span className="text-[8px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded uppercase">
                    FALTA {lead.situacion === "Autonomo" ? "IAE" : "CON"}
                  </span>
                )}
                {lead.estado === "Inscrito" && !lead.tieneUsuarios && (
                  <span className="text-[8px] font-black text-sky-600 bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded uppercase">
                    FALTA ACCESO 🔑
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 ml-3 shrink-0">
            <button
              onClick={() => handleWhatsApp(lead.whatsapp)}
              className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-500 hover:text-white transition-all border border-emerald-100 shadow-sm active:scale-90"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </button>
            <button
              onClick={() => onEditLead(lead)}
              className="bg-indigo-50 text-indigo-500 p-1.5 rounded-lg hover:bg-indigo-500 hover:text-white transition-all border border-indigo-100 shadow-sm active:scale-90"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  strokeWidth={2.5}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-6 px-2 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest italic">
            Centro de Mando
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wide">
            Tareas prioritarias del día
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
            {formatFechaCorta(currentTime)} • {formatHora(currentTime)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VENTAS: LLAMADAS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="text-lg">📞</span>
            <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
              Gestión de Llamadas
            </h3>
            <span className="ml-auto bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[9px] font-black">
              {llamadasVencidas.length + llamadasHoy.length}
            </span>
          </div>

          <div className="space-y-2">
            {llamadasVencidas.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>{" "}
                  Pendientes Atrasadas
                </h4>
                {llamadasVencidas.map((l) => (
                  <TaskCard key={l.id} lead={l} type="urgente" />
                ))}
              </div>
            )}

            {llamadasHoy.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                  Programadas para hoy
                </h4>
                {llamadasHoy.map((l) => (
                  <TaskCard key={l.id} lead={l} type="hoy" />
                ))}
              </div>
            )}

            {llamadasVencidas.length === 0 && llamadasHoy.length === 0 && (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                  Sin llamadas hoy
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RETENCIÓN: RIESGO DE ABANDONO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="text-lg">🚨</span>
            <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
              Riesgo de Abandono
            </h3>
            <span className="ml-auto bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[9px] font-black">
              {alertasRiesgo.length}
            </span>
          </div>
          <div className="space-y-2">
            {alertasRiesgo.map((l) => (
              <TaskCard key={l.id} lead={l} type="riesgo" />
            ))}
            {alertasRiesgo.length === 0 && (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                  Alumnos al día ✅
                </p>
              </div>
            )}
          </div>
        </div>

        {/* OPERACIONES: TRÁMITES Y ACCESOS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="text-lg">⏳</span>
            <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
              Operaciones Bloqueadas
            </h3>
            <span className="ml-auto bg-purple-100 text-purple-600 px-2 py-0.5 rounded text-[9px] font-black">
              {matriculasBloqueadas.length}
            </span>
          </div>
          <div className="space-y-2">
            {matriculasBloqueadas.map((l) => (
              <TaskCard key={l.id} lead={l} type="tramite" />
            ))}
            {matriculasBloqueadas.length === 0 && (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                  Operaciones limpias 🚀
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FUTURO */}
      {llamadasFuturas.length > 0 && (
        <div className="mt-12 pt-6 border-t border-slate-100">
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">
            Llamadas en los próximos días ({llamadasFuturas.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 opacity-40 hover:opacity-100 transition-opacity">
            {llamadasFuturas.map((l) => (
              <TaskCard key={l.id} lead={l} type="futura" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
