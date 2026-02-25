import React from "react";

export default function AgendaView({ leads, onEditLead, titulo }) {
  const proximasLlamadas = leads
    .filter((l) => l.estado === "Agendado" && l.fechaLlamada)
    .sort((a, b) => new Date(a.fechaLlamada) - new Date(b.fechaLlamada));

  const proximosInicios = leads
    .filter((l) => l.estado === "Inscrito" && l.inicioClase)
    .sort((a, b) => new Date(a.inicioClase) - new Date(b.inicioClase));

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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="px-2 border-l-4 border-indigo-500 pl-4">
        <h2 className="text-[12px] font-black text-gray-800 uppercase tracking-widest">
          {titulo}
        </h2>
        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
          Control Operativo de Agenda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-lg shadow-sky-200"></div>
            <h3 className="text-[10px] font-black text-sky-600 uppercase">
              Llamadas Pendientes
            </h3>
          </div>
          <div className="space-y-2">
            {proximasLlamadas.length > 0 ? (
              proximasLlamadas.map((l) => (
                <div
                  key={l.id}
                  className="bg-white border border-gray-100 rounded-2xl p-3 flex justify-between items-center shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <p className="text-[11px] font-bold text-gray-700">
                      {l.nombre}
                    </p>
                    <p className="text-[9px] text-gray-400">{l.whatsapp}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-sky-600 bg-sky-50 px-2 py-1 rounded-lg">
                      {formatF(l.fechaLlamada, true)}
                    </span>
                    <button
                      onClick={() => onEditLead(l)}
                      className="block text-[8px] font-black text-gray-300 hover:text-indigo-600 mt-1 uppercase"
                    >
                      Ver Perfil →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[9px] text-gray-300 italic px-2">
                Sin llamadas para este proyecto
              </p>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-200"></div>
            <h3 className="text-[10px] font-black text-indigo-600 uppercase">
              Inicios de Clase
            </h3>
          </div>
          <div className="space-y-2">
            {proximosInicios.length > 0 ? (
              proximosInicios.map((l) => (
                <div
                  key={l.id}
                  className="bg-white border border-gray-100 rounded-2xl p-3 flex justify-between items-center shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <p className="text-[11px] font-bold text-gray-700">
                      {l.nombre}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[8px] font-black bg-gray-50 text-gray-400 px-1 py-0.5 rounded border uppercase">
                        {l.horario || "S/T"}
                      </span>
                      {l.tieneUsuarios ? (
                        <span className="text-[8px] font-black text-emerald-500 uppercase">
                          User OK
                        </span>
                      ) : (
                        <span className="text-[8px] font-black text-rose-400 uppercase animate-pulse">
                          User Pend.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                      {formatF(l.inicioClase)}
                    </span>
                    <button
                      onClick={() => onEditLead(l)}
                      className="block text-[8px] font-black text-gray-300 hover:text-indigo-600 mt-1 uppercase"
                    >
                      Gestión →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[9px] text-gray-300 italic px-2">
                Sin inicios próximos
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
