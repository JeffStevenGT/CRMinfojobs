import React, { useState, useEffect } from "react";

export default function FollowUpModal({ onClose, onSave, lead }) {
  const [asistencia, setAsistencia] = useState(Array(20).fill(true));

  useEffect(() => {
    if (lead.asistencia) setAsistencia(lead.asistencia);
  }, [lead]);

  const toggleDia = (index) => {
    const nuevaAsistencia = [...asistencia];
    nuevaAsistencia[index] = !nuevaAsistencia[index];
    setAsistencia(nuevaAsistencia);
  };

  const faltasCount = 20 - asistencia.filter((d) => d).length;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">
              Asistencia
            </h3>
            <p className="text-[10px] text-gray-400 font-medium">
              {lead.nombre}
            </p>
          </div>
          <div
            className={`px-2 py-1 rounded-md text-[9px] font-black border ${faltasCount >= 3 ? "bg-red-50 text-red-500 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
          >
            {faltasCount} FALTAS
          </div>
        </div>

        <div className="p-6 flex flex-col items-center">
          <label className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 text-center">
            Registro de 20 días lectivos
          </label>

          {/* CUADRÍCULA CENTRADA */}
          <div className="grid grid-cols-5 gap-2 w-fit mx-auto">
            {asistencia.map((asistio, index) => (
              <button
                key={index}
                onClick={() => toggleDia(index)}
                className={`w-10 h-10 rounded-lg text-[9px] font-bold transition-all border flex items-center justify-center
                  ${asistio ? "bg-white border-emerald-100 text-emerald-600 hover:bg-emerald-50" : "bg-red-50 border-red-200 text-red-500 shadow-inner"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {faltasCount >= 3 && (
            <div className="mt-4 p-2 bg-red-50 border border-red-100 rounded-lg w-full">
              <p className="text-[9px] text-red-700 font-bold text-center leading-tight">
                BLOQUEADO: Máximo de faltas superado.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-50 flex justify-center gap-4 bg-gray-50/20">
          <button
            onClick={onClose}
            className="text-[9px] font-bold text-gray-400 uppercase tracking-widest"
          >
            Cerrar
          </button>
          <button
            onClick={() =>
              onSave({ ...lead, asistencia, faltas: faltasCount.toString() })
            }
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-md shadow-indigo-50 active:scale-95 transition-all"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
