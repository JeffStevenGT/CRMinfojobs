import React, { useState, useEffect } from "react";

export default function FollowUpModal({ onClose, onSave, lead }) {
  // Ahora manejamos 20 días de clases
  const [asistencia, setAsistencia] = useState(Array(20).fill(true));
  const [fechaInicio, setFechaInicio] = useState("");

  useEffect(() => {
    if (lead.asistencia) setAsistencia(lead.asistencia);
    if (lead.inicioClase) setFechaInicio(lead.inicioClase);
  }, [lead]);

  const toggleDia = (index) => {
    const nuevaAsistencia = [...asistencia];
    nuevaAsistencia[index] = !nuevaAsistencia[index];
    setAsistencia(nuevaAsistencia);
  };

  const asistenciasTotales = asistencia.filter((dia) => dia).length;
  const faltasTotales = 20 - asistenciasTotales;

  const handleSave = () => {
    onSave({
      ...lead,
      asistencia: asistencia,
      faltas: faltasTotales.toString(),
      inicioClase: fechaInicio,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-white/20 ring-1 ring-gray-900/5">
        {/* CABECERA (Mismo estilo que LeadFormModal) */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">
              Seguimiento de Asistencia
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Control académico de {lead.nombre}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 hover:bg-white p-2 rounded-full transition-all shadow-sm border border-transparent hover:border-gray-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar bg-white space-y-8">
          {/* FECHA DE INICIO */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest">
              Fecha Inicio de Clases
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-medium"
            />
          </div>

          {/* GRID DE ASISTENCIA */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                Asistencia (20 Días)
              </label>
              <div
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${asistenciasTotales >= 18 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
              >
                {asistenciasTotales} / 20 Asistencias
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {asistencia.map((asistio, index) => (
                <button
                  key={index}
                  onClick={() => toggleDia(index)}
                  className={`h-10 rounded-xl text-[10px] font-bold transition-all border shadow-sm flex items-center justify-center
                    ${
                      asistio
                        ? "bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        : "bg-red-50 border-red-200 text-red-500"
                    }`}
                >
                  {asistio ? `D${index + 1}` : "FALTA"}
                </button>
              ))}
            </div>
          </div>

          {/* REGLA DE NEGOCIO VISUAL */}
          {asistenciasTotales < 18 && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
              <svg
                className="w-5 h-5 text-amber-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                Este alumno tiene {faltasTotales} faltas. Requiere mínimo 18
                asistencias para finalizar el curso y recibir el regalo.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            Guardar Seguimiento
          </button>
        </div>
      </div>
    </div>
  );
}
