import React, { useState, useEffect } from "react";

const MiniToggle = ({ options, value, onChange }) => (
  <div className="flex p-1 bg-gray-100/80 rounded-xl border border-gray-200/50">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase
          ${value === opt.value ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

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
    situacion: "Dependiente",
    esReferido: "no",
    idReferidor: "",
    estado: "Agendado", // Restaurado
    horario: "",
    doc1: false,
    doc2: false,
  });

  const [isReferidorFocused, setIsReferidorFocused] = useState(false);

  useEffect(() => {
    if (leadToEdit) setFormData(leadToEdit);
  }, [leadToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "whatsapp") {
      const soloNumeros = value.replace(/\D/g, "").slice(0, 9); // Máximo 9 dígitos
      setFormData((prev) => ({ ...prev, [name]: soloNumeros }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // VALIDACIÓN: El botón solo se activa si hay nombre y exactamente 9 números en WhatsApp
  const isFormValid =
    formData.nombre.trim() !== "" && formData.whatsapp.length === 9;

  const sugerenciasReferidor = leads.filter((l) => {
    const term = formData.idReferidor.toLowerCase();
    return (
      term &&
      l.nombre.toLowerCase().includes(term) &&
      (!leadToEdit || l.id !== leadToEdit.id)
    );
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden border border-white/20">
        <div className="px-10 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-black text-gray-800 tracking-tight">
              Registro de Lead
            </h3>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">
              CLM Turismo
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-red-500 transition-all p-2"
          >
            <svg
              className="w-6 h-6"
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
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="p-10 space-y-6"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Nombre Completo
              </label>
              <input
                required
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl text-[13px] font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                WhatsApp (9 dígitos requeridos)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-400">
                  +34
                </span>
                <input
                  required
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="600000000"
                  className={`w-full pl-12 pr-5 py-3 bg-gray-50 border rounded-2xl text-[13px] font-bold outline-none transition-all ${formData.whatsapp.length > 0 && formData.whatsapp.length < 9 ? "border-red-300" : "border-transparent focus:ring-4 focus:ring-indigo-50"}`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl text-[13px] font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
              />
            </div>
            {/* SELECTOR DE ESTADO RESTAURADO */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Fase de Venta
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-[13px] font-bold outline-none cursor-pointer focus:bg-white transition-all appearance-none"
              >
                {["Agendado", "Interesado", "Inscrito", "No Interesado"].map(
                  (e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Provincia
              </label>
              <select
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-[13px] font-bold outline-none"
              >
                <option value="">Seleccionar...</option>
                {["Albacete", "Madrid", "Cuenca", "Toledo", "Guadalajara"].map(
                  (p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                Situación
              </label>
              <MiniToggle
                options={[
                  { value: "Dependiente", label: "Trabajador" },
                  { value: "Autonomo", label: "Autónomo" },
                ]}
                value={formData.situacion}
                onChange={(v) => handleCustomChange("situacion", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                ¿Referido?
              </label>
              <MiniToggle
                options={[
                  { value: "no", label: "No" },
                  { value: "si", label: "Sí" },
                ]}
                value={formData.esReferido}
                onChange={(v) => handleCustomChange("esReferido", v)}
              />
            </div>
          </div>

          {formData.esReferido === "si" && (
            <div className="bg-indigo-50/50 p-5 rounded-[24px] border border-indigo-100 relative">
              <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                Referidor
              </label>
              <input
                type="text"
                value={formData.idReferidor}
                onChange={(e) =>
                  handleCustomChange("idReferidor", e.target.value)
                }
                onFocus={() => setIsReferidorFocused(true)}
                onBlur={() =>
                  setTimeout(() => setIsReferidorFocused(false), 200)
                }
                placeholder="Buscar..."
                className="w-full px-4 py-2 bg-white border border-indigo-100 rounded-xl text-[12px] font-bold outline-none focus:ring-4 focus:ring-indigo-100"
              />
              {isReferidorFocused && sugerenciasReferidor.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-xl border border-indigo-50 z-20 max-h-40 overflow-auto">
                  {sugerenciasReferidor.map((s) => (
                    <div
                      key={s.id}
                      onClick={() =>
                        handleCustomChange("idReferidor", s.nombre)
                      }
                      className="px-5 py-3 text-[11px] font-bold text-gray-600 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-0"
                    >
                      {s.nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-[11px] font-black text-gray-400 uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-10 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all shadow-lg ${isFormValid ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95" : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"}`}
            >
              Guardar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
