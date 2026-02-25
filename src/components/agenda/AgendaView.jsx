import React, { useState } from "react";

export default function AgendaView({
  leads,
  onUpdateLead,
  onEditLead,
  titulo,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const now = new Date();

  const statuses = [
    { v: "pendiente", l: "Pendiente", c: "bg-slate-100 text-slate-500" },
    { v: "respondio", l: "Respondió", c: "bg-emerald-100 text-emerald-600" },
    { v: "buzo", l: "Buzo", c: "bg-orange-100 text-orange-600" },
    { v: "reprogramar", l: "Repro.", c: "bg-amber-100 text-amber-600" },
  ];

  const proximasLlamadas = leads
    .filter((l) => l.estado === "Agendado" && l.fechaLlamada)
    .sort((a, b) => new Date(a.fechaLlamada) - new Date(b.fechaLlamada));

  const proximosInicios = leads
    .filter((l) => l.estado === "Inscrito" && l.inicioClase)
    .sort((a, b) => new Date(a.inicioClase) - new Date(b.inicioClase));

  const isPast = (d) => new Date(d) < now;

  const handleCopy = (id, num) => {
    navigator.clipboard.writeText("+34" + num.replace(/\s+/g, ""));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatF = (f, h = false) => {
    if (!f) return "---";
    const d = new Date(f);
    const o = { day: "2-digit", month: "short" };
    if (h) {
      o.hour = "2-digit";
      o.minute = "2-digit";
    }
    return d.toLocaleDateString("es-ES", o);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-[12px] font-black text-gray-800 uppercase tracking-widest">
          {titulo}
        </h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span className="text-[8px] font-bold text-gray-400 uppercase">
              Atrasado
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[8px] font-bold text-gray-400 uppercase">
              Al día
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-sky-600 uppercase tracking-widest flex items-center gap-2">
            📞 Llamadas Pendientes
          </h3>
          <div className="space-y-3">
            {proximasLlamadas.map((l) => {
              const overdue =
                isPast(l.fechaLlamada) && l.agendaStatus !== "respondio";
              return (
                <div
                  key={l.id}
                  className={`bg-white border rounded-2xl p-4 shadow-sm transition-all ${overdue ? "border-red-200 bg-red-50/5" : "border-gray-50 hover:border-sky-100"}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p
                        className={`text-[11px] font-black ${overdue ? "text-red-600" : "text-gray-700"}`}
                      >
                        {l.nombre}
                      </p>
                      <div
                        className="flex items-center gap-2 mt-1 cursor-pointer group"
                        onClick={() => handleCopy(l.id, l.whatsapp)}
                      >
                        <p className="text-[9px] text-gray-400 font-bold tracking-tighter">
                          +34{l.whatsapp}
                        </p>
                        <svg
                          className={`w-3 h-3 ${copiedId === l.id ? "text-emerald-500" : "text-gray-300 group-hover:text-sky-400"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            strokeWidth={3}
                          />
                        </svg>
                        {copiedId === l.id && (
                          <span className="text-[7px] font-black text-emerald-500 uppercase">
                            ¡Copiado!
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${overdue ? "bg-red-100 text-red-600" : "bg-sky-50 text-sky-600"}`}
                    >
                      {formatF(l.fechaLlamada, true)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-3 border-t border-gray-50">
                    {statuses.map((s) => (
                      <button
                        key={s.v}
                        onClick={() => onUpdateLead(l.id, "agendaStatus", s.v)}
                        className={`text-[7.5px] font-black uppercase px-2 py-1 rounded-md transition-all ${l.agendaStatus === s.v ? s.c : "bg-gray-50 text-gray-300 hover:bg-gray-100"}`}
                      >
                        {s.l}
                      </button>
                    ))}
                    <button
                      onClick={() => onEditLead(l)}
                      className="ml-auto text-[7.5px] font-black text-indigo-400 uppercase"
                    >
                      Perfil →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
            🎓 Próximos Inicios
          </h3>
          <div className="space-y-3">
            {proximosInicios.map((l) => (
              <div
                key={l.id}
                className="bg-white border border-gray-50 rounded-2xl p-4 shadow-sm hover:border-indigo-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-black text-gray-700">
                      {l.nombre}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[7.5px] font-black bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100 uppercase">
                        {l.horario || "S/T"}
                      </span>
                      {l.tieneUsuarios ? (
                        <span className="text-[7.5px] font-black text-emerald-500 uppercase">
                          ✓ User OK
                        </span>
                      ) : (
                        <span className="text-[7.5px] font-black text-red-500 uppercase animate-pulse">
                          ⚠ Sin Claves
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[9px] font-black px-2 py-1 rounded-lg uppercase bg-indigo-50 text-indigo-600">
                    {formatF(l.inicioClase)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
