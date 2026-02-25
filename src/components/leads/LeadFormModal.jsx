import React, { useState, useEffect } from "react";

const MiniToggle = ({ options, value, onChange }) => (
  <div className="flex p-0.5 bg-gray-100 rounded-lg border border-gray-200/50">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`flex-1 py-1 px-2 text-[9px] font-bold rounded-md transition-all uppercase
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
    estado: "Agendado",
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
      const soloNumeros = value.replace(/\D/g, "").slice(0, 9);
      setFormData((prev) => ({ ...prev, [name]: soloNumeros }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid =
    formData.nombre.trim() !== "" && formData.whatsapp.length === 9;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
            Registro de Lead
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-all"
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
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                Nombre
              </label>
              <input
                required
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-transparent rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-50 transition-all outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                WhatsApp (9 dígitos)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-300">
                  +34
                </span>
                <input
                  required
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="600000000"
                  className={`w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-xs font-medium outline-none transition-all ${formData.whatsapp.length > 0 && formData.whatsapp.length < 9 ? "border-red-200" : "border-transparent focus:ring-2 focus:ring-indigo-50"}`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-transparent rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-50 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                Estado inicial
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-2 py-2 bg-gray-50 border border-transparent rounded-lg text-xs font-bold text-indigo-600 outline-none cursor-pointer"
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

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase">
                Provincia
              </label>
              <select
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="w-full px-2 py-1.5 bg-gray-50 border-transparent rounded-lg text-[10px] font-bold outline-none"
              >
                <option value="">...</option>
                {["Albacete", "Madrid", "Cuenca", "Toledo", "Guadalajara"].map(
                  (p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase text-center block">
                Situación
              </label>
              <MiniToggle
                options={[
                  { value: "Dependiente", label: "Trab." },
                  { value: "Autonomo", label: "Auton." },
                ]}
                value={formData.situacion}
                onChange={(v) => setFormData({ ...formData, situacion: v })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase text-center block">
                Referido
              </label>
              <MiniToggle
                options={[
                  { value: "no", label: "No" },
                  { value: "si", label: "Sí" },
                ]}
                value={formData.esReferido}
                onChange={(v) => setFormData({ ...formData, esReferido: v })}
              />
            </div>
          </div>

          {formData.esReferido === "si" && (
            <div className="bg-indigo-50/30 p-3 rounded-xl border border-indigo-50 space-y-1">
              <label className="text-[8px] font-black text-indigo-400 uppercase">
                Nombre del Referidor
              </label>
              <input
                type="text"
                value={formData.idReferidor}
                onChange={(e) =>
                  setFormData({ ...formData, idReferidor: e.target.value })
                }
                placeholder="Buscar..."
                className="w-full px-3 py-1.5 bg-white border border-indigo-100 rounded-lg text-xs font-bold outline-none"
              />
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600"
            >
              Cancelar
            </button>
            <button
              disabled={!isFormValid}
              type="submit"
              className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isFormValid ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 active:scale-95" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
            >
              Guardar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
