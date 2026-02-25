import React, { useState, useRef } from "react";

const InlineDatePicker = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const handleTrigger = () => {
    if (inputRef.current) {
      if (inputRef.current.showPicker) inputRef.current.showPicker();
      else inputRef.current.click();
    }
  };

  return (
    <div
      onClick={handleTrigger}
      className="relative flex items-center justify-center px-3 py-1.5 rounded-xl border border-sky-100 bg-sky-50 text-sky-600 text-[9px] font-black uppercase hover:border-sky-300 transition-all cursor-pointer"
    >
      {value
        ? new Date(value).toLocaleString("es-ES", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Asignar Cita"}
      <input
        ref={inputRef}
        type="datetime-local"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 z-10 cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default function AgendaView({
  leads,
  onUpdateLead,
  onEditLead,
  titulo,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const now = new Date();

  const statusOptions = [
    { v: "pendiente", l: "Pendiente", c: "bg-slate-100 text-slate-500" },
    { v: "respondio", l: "Respondió", c: "bg-emerald-100 text-emerald-600" },
    { v: "buzo", l: "Buzo", c: "bg-orange-100 text-orange-600" },
  ];

  const proximasLlamadas = leads
    .filter((l) => l.estado === "Agendado" && l.fechaLlamada)
    .sort((a, b) => new Date(a.fechaLlamada) - new Date(b.fechaLlamada));

  const proximosInicios = leads
    .filter((l) => l.estado === "Inscrito" && l.inicioClase)
    .sort((a, b) => new Date(a.inicioClase) - new Date(b.inicioClase));

  const handleCopy = (id, num) => {
    navigator.clipboard.writeText("+34" + num.replace(/\s+/g, ""));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 px-2">
        <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-widest italic">
          {titulo}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LLAMADAS */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-sky-600 uppercase tracking-widest px-2">
            📞 Seguimiento
          </h3>
          <div className="space-y-4">
            {proximasLlamadas.map((l) => {
              const overdue =
                new Date(l.fechaLlamada) < now &&
                l.agendaStatus !== "respondio";
              return (
                <div
                  key={l.id}
                  className={`bg-white border rounded-[2rem] p-6 shadow-sm transition-all ${overdue ? "border-red-100 bg-red-50/5" : "border-slate-50"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p
                        className={`text-[13px] font-black ${overdue ? "text-red-600" : "text-slate-700"}`}
                      >
                        {l.nombre}
                      </p>
                      <div
                        className="flex items-center gap-2 mt-1 cursor-pointer group"
                        onClick={() => handleCopy(l.id, l.whatsapp)}
                      >
                        <p className="text-[10px] text-slate-400 font-bold">
                          +34{l.whatsapp}
                        </p>
                        <svg
                          className={`w-3 h-3 ${copiedId === l.id ? "text-emerald-500" : "text-slate-300 group-hover:text-sky-400"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            strokeWidth={3}
                          />
                        </svg>
                      </div>
                    </div>
                    <InlineDatePicker
                      value={l.fechaLlamada}
                      onChange={(val) =>
                        onUpdateLead(l.id, "fechaLlamada", val)
                      }
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-50">
                    {statusOptions.map((s) => (
                      <button
                        key={s.v}
                        onClick={() => onUpdateLead(l.id, "agendaStatus", s.v)}
                        className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-xl ${l.agendaStatus === s.v ? s.c : "bg-slate-50 text-slate-300 hover:bg-slate-100"}`}
                      >
                        {s.l}
                      </button>
                    ))}
                    <button
                      onClick={() => onEditLead(l)}
                      className="ml-auto text-[8px] font-black text-indigo-400 hover:text-indigo-600 uppercase"
                    >
                      Perfil →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INICIOS */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-2">
            🎓 Inscritos
          </h3>
          <div className="space-y-4">
            {proximosInicios.map((l) => (
              <div
                key={l.id}
                className="bg-white border border-slate-50 rounded-[2rem] p-6 shadow-sm hover:border-indigo-100"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-[13px] font-black text-slate-700 tracking-tight">
                      {l.nombre}
                    </p>
                    <div className="flex gap-2">
                      <span className="text-[8px] font-black bg-slate-50 text-slate-400 px-2 py-1 rounded-lg border border-slate-100 uppercase">
                        {l.horario || "S/T"}
                      </span>
                      {l.tieneUsuarios ? (
                        <span className="text-[8px] font-black text-emerald-500 uppercase">
                          ✓ User OK
                        </span>
                      ) : (
                        <span className="text-[8px] font-black text-rose-500 uppercase animate-pulse">
                          ⚠ Sin Claves
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-3 py-1.5 rounded-xl uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {new Date(l.inicioClase).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                    })}
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
