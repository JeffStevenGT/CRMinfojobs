import React, { useState, useEffect, useRef } from "react";

// --- NUEVO: SUBCOMPONENTE DE AUTOCOMPLETADO ELEGANTE ---
const AutocompleteInput = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  className,
}) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const wrapperRef = useRef(null);

  // Cierra el menú flotante si haces clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(e); // Actualiza el estado principal del formulario

    if (inputValue.trim() === "") {
      setShowOptions(false);
    } else {
      // Filtra las opciones que coincidan con lo que escribe el usuario
      const filtered = options.filter((opt) =>
        opt.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setFilteredOptions(filtered);
      setShowOptions(true);
    }
  };

  const handleOptionClick = (opt) => {
    // Simula un evento para actualizar el estado del padre con la opción elegida
    onChange({ target: { name, value: opt } });
    setShowOptions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputChange} // Muestra sugerencias al hacer clic si ya hay texto
        className={className}
        placeholder={placeholder}
        autoComplete="off"
      />
      {showOptions && filteredOptions.length > 0 && (
        <ul className="absolute z-[1010] w-full bg-white border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] rounded-xl mt-1.5 max-h-40 overflow-y-auto custom-scroll-y py-1.5">
          {filteredOptions.map((opt, i) => (
            <li
              key={i}
              onClick={() => handleOptionClick(opt)}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function LeadFormModal({ onClose, onSave, leadToEdit, leads }) {
  const [formData, setFormData] = useState({
    nombre: "",
    whatsapp: "",
    email: "",
    proyecto: "CLM",
    provincia: "",
    situacion: "Trabajador",
    esReferido: "no",
    quienRefirio: "",
    estado: "Agendado",
    temperatura: "Tibio",
    horario: "mañana",
    comentarios: "",
  });

  useEffect(() => {
    if (leadToEdit) {
      setFormData({ ...leadToEdit });
    }
  }, [leadToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // --- DATOS PARA AUTOCOMPLETADO ---
  const provinciasEspana = [
    "Alava",
    "Albacete",
    "Alicante",
    "Almería",
    "Asturias",
    "Avila",
    "Badajoz",
    "Barcelona",
    "Burgos",
    "Caceres",
    "Cadiz",
    "Cantabria",
    "Castellón",
    "Ciudad Real",
    "Cordoba",
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
    "Malaga",
    "Murcia",
    "Navarra",
    "Orense",
    "Palencia",
    "Pontevedra",
    "Salamanca",
    "Santa Cruz de Tenerife",
    "Segovia",
    "Sevilla",
    "Soria",
    "Tarragona",
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

  // Extraer nombres únicos de leads existentes para sugerir Referidos
  const nombresExistentes = leads
    ? Array.from(new Set(leads.map((l) => l.nombre).filter(Boolean)))
    : [];

  const inputClass =
    "w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-shadow";
  const labelClass =
    "text-[9px] font-black text-slate-400 uppercase ml-1 mb-1 block tracking-widest";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
            {leadToEdit ? "Editar Cliente" : "Nuevo Cliente"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-xl border border-slate-100 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scroll-y flex-1">
          <form id="lead-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b border-indigo-50 pb-1.5 mb-3">
                  Datos Personales
                </h3>
                <div>
                  <label className={labelClass}>Nombre Completo</label>
                  <input
                    required
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <label className={labelClass}>WhatsApp</label>
                  <input
                    required
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Ej. 600123456"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Ej. juan@correo.com"
                  />
                </div>
                <div>
                  <label className={labelClass}>Provincia</label>
                  {/* AUTOCOMPLETADO INTELIGENTE PROVINCIA */}
                  <AutocompleteInput
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleChange}
                    options={provinciasEspana}
                    placeholder="Escribe para buscar..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b border-indigo-50 pb-1.5 mb-3">
                  Gestión de Campaña
                </h3>
                <div>
                  <label className={labelClass}>Campaña / Proyecto</label>
                  <select
                    name="proyecto"
                    value={formData.proyecto}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="CLM">CLM</option>
                    <option value="Lideres">Líderes</option>
                    <option value="Sandetel">Sandetel</option>
                    <option value="MasDigital">MasDigital</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Estado Inicial</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="Agendado">📞 Agendado</option>
                    <option value="Interesado">📝 Interesado</option>
                    <option value="Registrado">🪪 Registrado</option>
                    <option value="Inscrito">⏳ Matriculado (Inscrito)</option>
                    <option value="No Interesado">🛑 No Interesado</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Temperatura</label>
                    <select
                      name="temperatura"
                      value={formData.temperatura}
                      onChange={handleChange}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="Frío">❄️ Frío</option>
                      <option value="Tibio">☀️ Tibio</option>
                      <option value="Caliente">🔥 Caliente</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Turno</label>
                    <select
                      name="horario"
                      value={formData.horario}
                      onChange={handleChange}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="mañana">Mañana</option>
                      <option value="tarde">Tarde</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Situación Laboral</label>
                  <select
                    name="situacion"
                    value={formData.situacion}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="Trabajador">Trabajador</option>
                    <option value="Autonomo">Autónomo</option>
                    <option value="Desempleado">Desempleado (Null)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border-b border-emerald-50 pb-1.5 mb-3">
                  Referidos
                </h3>
                <div>
                  <label className={labelClass}>¿Es Referido?</label>
                  <select
                    name="esReferido"
                    value={formData.esReferido}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="no">No</option>
                    <option value="si">Sí</option>
                  </select>
                </div>
                {formData.esReferido === "si" && (
                  <div className="animate-in fade-in slide-in-from-top-2 relative">
                    <label className={labelClass}>¿Quién lo refirió?</label>
                    {/* AUTOCOMPLETADO INTELIGENTE REFERIDOS */}
                    <AutocompleteInput
                      name="quienRefirio"
                      value={formData.quienRefirio}
                      onChange={handleChange}
                      options={nombresExistentes}
                      placeholder="Empieza a escribir el nombre..."
                      className={inputClass}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-3">
                  Observaciones
                </h3>
                <div>
                  <label className={labelClass}>Comentarios</label>
                  <textarea
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleChange}
                    rows="3"
                    className={`${inputClass} resize-none`}
                    placeholder="Añade notas importantes aquí..."
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/50 shrink-0 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="lead-form"
            className="bg-[#4F46E5] text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Guardar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
