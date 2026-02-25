import React, { useState, useEffect } from "react";

export default function LeadFormModal({
  onClose,
  onSave,
  leadToEdit,
  leads = [],
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    whatsapp: "",
    email: "",
    provincia: "",
    situacion: "Null", // Por defecto Null
    esReferido: "no",
    quienRefirio: "",
    fechaLlamada: "",
    inicioClase: "",
    temperatura: "Tibio", // CAMPO DE TEMPERATURA POR DEFECTO
    comentarios: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const provinciasCLM = [
    "Toledo",
    "Albacete",
    "Ciudad Real",
    "Cuenca",
    "Guadalajara",
  ];
  const nombresExistentes = [...new Set(leads.map((l) => l.nombre))].filter(
    Boolean,
  );

  useEffect(() => {
    if (leadToEdit) setFormData({ ...formData, ...leadToEdit });
  }, [leadToEdit]);

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 9) setFormData({ ...formData, whatsapp: val });
  };

  const handleReferrerChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, quienRefirio: val });
    if (val.length > 0) {
      const filtered = nombresExistentes
        .filter(
          (n) =>
            n.toLowerCase().includes(val.toLowerCase()) &&
            n !== formData.nombre,
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else setSuggestions([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="bg-[#4F46E5] p-6 text-center text-white sticky top-0 z-10">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em]">
            {leadToEdit ? "Editar Perfil" : "Nuevo Registro CLM"}
          </h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="p-6 space-y-4"
        >
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Nombre Completo
            </label>
            <input
              required
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                WhatsApp
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[11px] font-bold text-slate-300">
                  +34
                </span>
                <input
                  required
                  type="tel"
                  value={formData.whatsapp}
                  onChange={handlePhoneChange}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Provincia
              </label>
              <select
                required
                value={formData.provincia}
                onChange={(e) =>
                  setFormData({ ...formData, provincia: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold outline-none"
              >
                <option value="">Seleccionar...</option>
                {provinciasCLM.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* EMAIL OPCIONAL */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Email (Opcional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/30 rounded-2xl border border-indigo-50">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-indigo-400 uppercase tracking-widest ml-1">
                Cita Llamada
              </label>
              <input
                type="datetime-local"
                value={formData.fechaLlamada}
                onChange={(e) =>
                  setFormData({ ...formData, fechaLlamada: e.target.value })
                }
                className="w-full px-2 py-1.5 bg-white border-none rounded-lg text-[10px] font-bold outline-none text-indigo-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-indigo-400 uppercase tracking-widest ml-1">
                Inicio Clase
              </label>
              <input
                type="date"
                value={formData.inicioClase}
                onChange={(e) =>
                  setFormData({ ...formData, inicioClase: e.target.value })
                }
                className="w-full px-2 py-1.5 bg-white border-none rounded-lg text-[10px] font-bold outline-none text-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Situación
              </label>
              <select
                value={formData.situacion}
                onChange={(e) =>
                  setFormData({ ...formData, situacion: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold outline-none"
              >
                <option value="Null">Null</option>
                <option value="Trabajador">Trabajador</option>
                <option value="Autonomo">Autónomo</option>
              </select>
            </div>

            {/* SELECTOR DE TEMPERATURA / INTERÉS */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-amber-500 uppercase tracking-widest ml-1">
                Interés Inicial
              </label>
              <select
                value={formData.temperatura}
                onChange={(e) =>
                  setFormData({ ...formData, temperatura: e.target.value })
                }
                className="w-full px-4 py-2 bg-amber-50 border-none rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-amber-200"
              >
                <option value="Frío">❄️ Frío (Dudoso)</option>
                <option value="Tibio">☀️ Tibio (Interesado)</option>
                <option value="Caliente">🔥 Caliente (Muy Alto)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              ¿Referido?
            </label>
            <select
              value={formData.esReferido}
              onChange={(e) =>
                setFormData({ ...formData, esReferido: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold outline-none"
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>
          </div>

          {formData.esReferido === "si" && (
            <div className="space-y-1 relative animate-in slide-in-from-top-2">
              <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-1">
                Referente
              </label>
              <input
                required
                type="text"
                value={formData.quienRefirio}
                onChange={handleReferrerChange}
                className="w-full px-4 py-2 bg-indigo-50 border-none rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-indigo-200 outline-none"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-[110] left-0 right-0 mt-1 bg-white border border-slate-100 shadow-2xl rounded-xl overflow-hidden">
                  {suggestions.map((n, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, quienRefirio: n });
                        setSuggestions([]);
                      }}
                      className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-indigo-50"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CAMPO DE COMENTARIOS */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Notas / Observaciones
            </label>
            <textarea
              rows="3"
              value={formData.comentarios}
              onChange={(e) =>
                setFormData({ ...formData, comentarios: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-[11px] font-medium text-slate-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
              placeholder="Escribe detalles importantes aquí..."
            />
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-[10px] font-black uppercase text-slate-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formData.whatsapp.length < 9}
              className="flex-[2] bg-[#4F46E5] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
            >
              {leadToEdit ? "Guardar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
