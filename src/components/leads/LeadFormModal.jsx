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
    situacion: "Desempleado",
    esReferido: "no",
    quienRefirio: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const provinciasCLM = [
    "Toledo",
    "Albacete",
    "Ciudad Real",
    "Cuenca",
    "Guadalajara",
  ];

  // Extraer nombres únicos para el autocompletado de referidos
  const nombresExistentes = [...new Set(leads.map((l) => l.nombre))].filter(
    Boolean,
  );

  useEffect(() => {
    if (leadToEdit) setFormData(leadToEdit);
  }, [leadToEdit]);

  // Validación de 9 dígitos para WhatsApp
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 9) setFormData({ ...formData, whatsapp: val });
  };

  // Lógica de autocompletado de referente
  const handleReferrerChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, quienRefirio: val });

    if (val.length > 0) {
      const filtered = nombresExistentes
        .filter(
          (nombre) =>
            nombre.toLowerCase().includes(val.toLowerCase()) &&
            nombre !== formData.nombre,
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (nombre) => {
    setFormData({ ...formData, quienRefirio: nombre });
    setSuggestions([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        {/* HEADER */}
        <div className="bg-[#4F46E5] p-6 text-center text-white">
          <h2 className="text-xs font-black uppercase tracking-[0.2em]">
            {leadToEdit ? "Editar Información" : "Registro Nuevo Lead"}
          </h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="p-6 space-y-4"
        >
          {/* NOMBRE */}
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
              placeholder="Ej. Juan Pérez"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* WHATSAPP */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                WhatsApp
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[11px] font-bold text-slate-300">
                  +34
                </span>
                <input
                  required
                  type="tel"
                  value={formData.whatsapp}
                  onChange={handlePhoneChange}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                  placeholder="600000000"
                />
              </div>
            </div>
            {/* PROVINCIA */}
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
                className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold outline-none appearance-none"
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

          {/* EMAIL (RESTAURADO) */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* SITUACIÓN */}
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
                <option value="Desempleado">Desempleado</option>
                <option value="Trabajador">Trabajador</option>
                <option value="Autonomo">Autónomo</option>
              </select>
            </div>
            {/* REFERIDO */}
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
          </div>

          {/* CAMPO REFERENTE CON AUTOCOMPLETADO */}
          {formData.esReferido === "si" && (
            <div className="space-y-1 relative animate-in slide-in-from-top-2">
              <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-1">
                ¿Quién lo recomendó?
              </label>
              <input
                required
                type="text"
                value={formData.quienRefirio}
                onChange={handleReferrerChange}
                className="w-full px-4 py-2 bg-indigo-50 border-none rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-indigo-200 outline-none"
                placeholder="Escribe el nombre..."
              />
              {suggestions.length > 0 && (
                <div className="absolute z-[110] left-0 right-0 mt-1 bg-white border border-slate-100 shadow-2xl rounded-xl overflow-hidden">
                  {suggestions.map((n, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectSuggestion(n)}
                      className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-none"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
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
              {leadToEdit ? "Guardar Cambios" : "Completar Registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
