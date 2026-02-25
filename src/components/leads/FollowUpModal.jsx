import React, { useState, useEffect } from "react";

export default function FollowUpModal({ onClose, onSave, lead }) {
  // Ahora manejamos únicamente los 20 días de clases de CLM Turismo
  const [asistencia, setAsistencia] = useState(Array(20).fill(true));

  useEffect(() => {
    if (lead.asistencia) setAsistencia(lead.asistencia);
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
      // Ya no enviamos inicioClase desde aquí porque se gestiona en la tabla principal
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-white/20">
        {/* CABECERA */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-black text-gray-800 tracking-tight">
              Control de Asistencia
            </h3>
            <p className="text-xs text-gray-500 mt-1">Alumno: {lead.nombre}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
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
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* CUERPO DEL MODAL */}
        <div className="p-8 bg-white space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Registro 20 Días
              </label>
              <div
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${faltasTotales >= 3 ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
              >
                {asistenciasTotales} / 20 Asistencias
              </div>
            </div>

            {/* GRID DE BOTONES */}
            <div className="grid grid-cols-5 gap-3">
              {asistencia.map((asistio, index) => (
                <button
                  key={index}
                  onClick={() => toggleDia(index)}
                  className={`h-11 rounded-xl text-[10px] font-bold transition-all border shadow-sm flex items-center justify-center
                    ${
                      asistio
                        ? "bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        : "bg-red-50 border-red-200 text-red-500 animate-pulse"
                    }`}
                >
                  {asistio ? `DÍA ${index + 1}` : "FALTA"}
                </button>
              ))}
            </div>
          </div>

          {/* REGLA DE NEGOCIO VISUAL */}
          {faltasTotales >= 3 && (
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3">
              <div className="text-red-500">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-[11px] text-red-800 font-bold leading-relaxed">
                Este alumno ha superado el límite de faltas. Se marcará
                automáticamente como "No Apto".
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
