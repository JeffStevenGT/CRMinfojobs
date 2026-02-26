import React, { useState, useEffect, useRef } from "react";

export default function LeadFormModal({ leads, onClose, onSave, leadToEdit }) {
  const PROVINCIAS = [
    "Álava",
    "Albacete",
    "Alicante",
    "Almería",
    "Asturias",
    "Ávila",
    "Badajoz",
    "Barcelona",
    "Burgos",
    "Cáceres",
    "Cádiz",
    "Cantabria",
    "Castellón",
    "Ciudad Real",
    "Córdoba",
    "Cuenca",
    "Gerona",
    "Granada",
    "Guadalajara",
    "Guipúzcoa",
    "Huelva",
    "Huesca",
    "Islas Baleares",
    "Jaén",
    "La Coruña",
    "La Rioja",
    "Las Palmas",
    "León",
    "Lérida",
    "Lugo",
    "Madrid",
    "Málaga",
    "Murcia",
    "Navarra",
    "Orense",
    "Palencia",
    "Pontevedra",
    "Salamanca",
    "Segovia",
    "Sevilla",
    "Soria",
    "Tarragona",
    "Santa Cruz de Tenerife",
    "Teruel",
    "Toledo",
    "Valencia",
    "Valladolid",
    "Vizcaya",
    "Zamora",
    "Zaragoza",
    "Ceuta",
    "Melilla",
  ];

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

  // Estados para buscadores inteligentes
  const [showProvList, setShowProvList] = useState(false);
  const [showReferList, setShowReferList] = useState(false);

  useEffect(() => {
    if (leadToEdit) setFormData({ ...leadToEdit });
  }, [leadToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Filtrado de provincias según lo escrito
  const filteredProvincias = PROVINCIAS.filter((p) =>
    p.toLowerCase().includes(formData.provincia.toLowerCase()),
  ).slice(0, 5); // Solo mostrar 5 para no saturar

  // Filtrado de nombres para referidos (basado en leads existentes)
  const nombresReferidores = [...new Set(leads.map((l) => l.nombre))]
    .filter(
      (n) => n && n.toLowerCase().includes(formData.quienRefirio.toLowerCase()),
    )
    .slice(0, 5);

  const inputClass =
    "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-slate-700 uppercase shadow-sm";
  const labelClass =
    "text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block";

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#F8FAFC] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white">
        <div className="bg-slate-800 p-6 text-center text-white relative">
          <h3 className="text-sm font-black uppercase tracking-widest">
            {leadToEdit ? "Editar Lead" : "Nuevo Registro"}
          </h3>
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-slate-400 hover:text-white"
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
          className="p-8 space-y-5 max-h-[85vh] overflow-y-auto custom-scrollbar"
        >
          {/* BOTONES DE PROYECTO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase text-center block mb-2">
              Campaña
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, proyecto: "CLM" })}
                className={`py-2.5 rounded-xl text-[10px] font-black border-2 transition-all ${formData.proyecto === "CLM" ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400"}`}
              >
                CLM TURISMO
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, proyecto: "Lideres" })
                }
                className={`py-2.5 rounded-xl text-[10px] font-black border-2 transition-all ${formData.proyecto === "Lideres" ? "bg-amber-500 border-amber-500 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400"}`}
              >
                LÍDERES
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, proyecto: "Sandetel" })
                }
                className={`py-2.5 rounded-xl text-[10px] font-black border-2 transition-all ${formData.proyecto === "Sandetel" ? "bg-cyan-500 border-cyan-500 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400"}`}
              >
                SANDETEL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Nombre y Apellidos</label>
              <input
                required
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className={inputClass}
                placeholder="Juan Pérez"
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>WhatsApp (+34)</label>
              <input
                required
                type="text"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsapp: e.target.value.replace(/\D/g, ""),
                  })
                }
                className={inputClass}
                placeholder="600000000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={inputClass}
                placeholder="mail@ejemplo.com"
              />
            </div>
            {/* BUSCADOR DE PROVINCIAS INTELIGENTE */}
            <div className="space-y-1 relative">
              <label className={labelClass}>Provincia de Residencia</label>
              <input
                required
                type="text"
                value={formData.provincia}
                onFocus={() => setShowProvList(true)}
                onBlur={() => setTimeout(() => setShowProvList(false), 200)}
                onChange={(e) =>
                  setFormData({ ...formData, provincia: e.target.value })
                }
                className={inputClass}
                placeholder="Escribe para buscar..."
              />
              {showProvList &&
                formData.provincia.length > 0 &&
                filteredProvincias.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                    {filteredProvincias.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, provincia: p });
                          setShowProvList(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[10px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors uppercase"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>¿Es un Referido?</label>
              <div className="flex gap-1">
                {["no", "si"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, esReferido: r })}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black border transition-all ${formData.esReferido === r ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-slate-400 border-slate-100"}`}
                  >
                    {r === "si" ? "ES REFERIDO" : "DIRECTO"}
                  </button>
                ))}
              </div>
            </div>
            {/* BUSCADOR DE REFERIDORES INTELIGENTE */}
            {formData.esReferido === "si" && (
              <div className="space-y-1 relative">
                <label className={labelClass}>¿Quién Recomendó?</label>
                <input
                  required
                  type="text"
                  value={formData.quienRefirio}
                  onFocus={() => setShowReferList(true)}
                  onBlur={() => setTimeout(() => setShowReferList(false), 200)}
                  onChange={(e) =>
                    setFormData({ ...formData, quienRefirio: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Nombre de ayuda..."
                />
                {showReferList &&
                  formData.quienRefirio.length > 0 &&
                  nombresReferidores.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                      {nombresReferidores.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, quienRefirio: n });
                            setShowReferList(false);
                          }}
                          className="w-full text-left px-4 py-2 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 transition-colors uppercase"
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Situación Laboral</label>
              <div className="flex gap-1">
                {["Trabajador", "Autonomo"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, situacion: s })}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black border transition-all ${formData.situacion === s ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-slate-400 border-slate-100"}`}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Interés</label>
              <div className="flex gap-1">
                {["Frío", "Tibio", "Caliente"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, temperatura: t })}
                    className={`flex-1 py-2 rounded-xl text-[12px] border transition-all ${formData.temperatura === t ? "bg-white border-indigo-500 shadow-sm" : "bg-white border-slate-100 opacity-40"}`}
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

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-[10px] font-black uppercase text-slate-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-[2] bg-[#4F46E5] text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              {leadToEdit ? "Guardar Cambios" : "Completar Registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
