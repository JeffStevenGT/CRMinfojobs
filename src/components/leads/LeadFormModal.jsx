import React, { useState, useEffect } from "react";

export default function LeadFormModal({ onClose, onSave, leadToEdit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    whatsapp: "",
    email: "",
    provincia: "",
    situacion: "Null",
    estado: "Agendado",
    temperatura: "Tibio",
    proyecto: "CLM",
    comentarios: "",
    esReferido: "no",
    quienRefirio: "",
  });

  useEffect(() => {
    if (leadToEdit) setFormData({ ...leadToEdit });
  }, [leadToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClass =
    "w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-slate-700 uppercase shadow-sm";
  const labelClass =
    "text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block";

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#F8FAFC] w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-300">
        <div className="bg-slate-800 p-6 text-center text-white relative">
          <h3 className="text-sm font-black uppercase tracking-[0.2em]">
            {leadToEdit ? "Editar Perfil" : "Nuevo Registro"}
          </h3>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors"
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

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          {/* SELECTOR DE CAMPAÑA POR CLIC (BOTONES) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] text-center block mb-3">
              Seleccionar Campaña
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, proyecto: "CLM" })}
                className={`py-3 rounded-2xl text-[10px] font-black transition-all border-2 ${formData.proyecto === "CLM" ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105" : "bg-white border-slate-100 text-slate-400 hover:border-indigo-200"}`}
              >
                CLM TURISMO
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, proyecto: "Lideres" })
                }
                className={`py-3 rounded-2xl text-[10px] font-black transition-all border-2 ${formData.proyecto === "Lideres" ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100 scale-105" : "bg-white border-slate-100 text-slate-400 hover:border-amber-200"}`}
              >
                LÍDERES
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, proyecto: "Sandetel" })
                }
                className={`py-3 rounded-2xl text-[10px] font-black transition-all border-2 ${formData.proyecto === "Sandetel" ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-100 scale-105" : "bg-white border-slate-100 text-slate-400 hover:border-cyan-200"}`}
              >
                SANDETEL
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-200 w-full my-2"></div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nombre del Cliente</label>
              <input
                required
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className={inputClass}
                placeholder="Nombre y Apellidos"
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input
                required
                type="text"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                className={inputClass}
                placeholder="987654321"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={inputClass}
                placeholder="ejemplo@mail.com"
              />
            </div>
            <div>
              <label className={labelClass}>Provincia</label>
              <input
                type="text"
                value={formData.provincia}
                onChange={(e) =>
                  setFormData({ ...formData, provincia: e.target.value })
                }
                className={inputClass}
                placeholder="Ciudad"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Situación</label>
              <div className="flex gap-1">
                {["Trabajador", "Autonomo"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, situacion: s })}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black border transition-all ${formData.situacion === s ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-400 border-slate-200"}`}
                  >
                    {s === "Autonomo" ? "AUTÓN." : "TRAB."}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Temperatura</label>
              <div className="flex gap-1">
                {["Frío", "Tibio", "Caliente"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, temperatura: t })}
                    className={`flex-1 py-2 rounded-xl text-[12px] border transition-all ${formData.temperatura === t ? "bg-white border-indigo-500 shadow-sm" : "bg-white border-slate-100 opacity-40 hover:opacity-100"}`}
                  >
                    {t === "Frío" ? "❄️" : t === "Tibio" ? "☀️" : "🔥"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Observaciones</label>
            <textarea
              rows="2"
              value={formData.comentarios}
              onChange={(e) =>
                setFormData({ ...formData, comentarios: e.target.value })
              }
              className={`${inputClass} normal-case h-16 resize-none py-2`}
              placeholder="Notas adicionales..."
            ></textarea>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-[10px] font-black uppercase text-slate-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] bg-indigo-600 text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              {leadToEdit ? "Guardar Cambios" : "Registrar Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
