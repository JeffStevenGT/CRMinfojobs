import React, { useState, useEffect } from "react";

// --- COMPONENTE MINI: Botones Segmentados ---
const SegmentedControl = ({ options, value, onChange }) => (
  <div className="flex p-1 bg-gray-100/80 rounded-xl border border-gray-200/50">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300
          ${value === opt.value ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-900/5" : "text-gray-500 hover:text-gray-700"}`}
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
    correo: "",
    whatsapp: "",
    provincia: "",
    situacion: "Dependiente",
    tipoLead: "Base",
    esReferido: "no",
    idReferidor: "",
    estado: "Agendado",
    fechaLlamada: "",
    horario: "mañana",
    faltas: "0",
    finalizo: "en curso",
    regalo: "no",
    doc1: false,
    doc2: false,
  });

  const [isReferidorFocused, setIsReferidorFocused] = useState(false);

  useEffect(() => {
    if (leadToEdit) setFormData(leadToEdit);
  }, [leadToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const sugerenciasReferidor = leads.filter((lead) => {
    const term = formData.idReferidor.toLowerCase();
    if (!term) return false;
    if (leadToEdit && lead.id === leadToEdit.id) return false;
    return (
      lead.nombre.toLowerCase().includes(term) || lead.whatsapp.includes(term)
    );
  });

  const showReferidorSugerencias =
    isReferidorFocused && formData.idReferidor.length > 0;

  const UserIcon = () => (
    <svg
      className="w-4 h-4 text-gray-400 absolute left-3.5 top-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
  const PhoneIcon = () => (
    <svg
      className="w-4 h-4 text-gray-400 absolute left-3.5 top-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
  const MapIcon = () => (
    <svg
      className="w-4 h-4 text-gray-400 absolute left-3.5 top-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
  const SearchIcon = () => (
    <svg
      className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-full flex flex-col transform transition-all overflow-hidden border border-white/20 ring-1 ring-gray-900/5">
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">
              {leadToEdit
                ? "Editar Información del Cliente"
                : "Añadir Nuevo Cliente"}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Completa los datos para su expediente.
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

        <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
          <form id="leadForm" onSubmit={handleSubmit} className="space-y-8">
            {/* 1. DATOS PERSONALES */}
            <div>
              <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
                1. Datos de Contacto
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <UserIcon />
                    <input
                      required
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Juan Pérez"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all text-gray-800 font-medium placeholder-gray-400"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    WhatsApp
                  </label>
                  <div className="relative">
                    <PhoneIcon />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+34 600 000 000"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all text-gray-800 font-medium placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PERFIL COMERCIAL */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
                2. Perfil Comercial
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Provincia
                  </label>
                  <div className="relative">
                    <MapIcon />
                    <select
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all text-gray-800 font-medium appearance-none cursor-pointer"
                    >
                      <option value="" className="text-gray-400">
                        Seleccionar...
                      </option>
                      <option value="Albacete">Albacete</option>
                      <option value="Madrid">Madrid</option>
                      <option value="Cuenca">Cuenca</option>
                      <option value="Toledo">Toledo</option>
                      <option value="Guadalajara">Guadalajara</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Situación Laboral
                  </label>
                  <SegmentedControl
                    options={[
                      { value: "Dependiente", label: "Dependiente" },
                      { value: "Autonomo", label: "Autónomo" },
                    ]}
                    value={formData.situacion}
                    onChange={(val) => handleCustomChange("situacion", val)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                    ¿Viene Referido?
                  </label>
                  <SegmentedControl
                    options={[
                      { value: "no", label: "No" },
                      { value: "si", label: "Sí" },
                    ]}
                    value={formData.esReferido}
                    onChange={(val) => handleCustomChange("esReferido", val)}
                  />
                </div>
              </div>

              {/* BÚSQUEDA DE REFERIDO (Autocompletar) */}
              {formData.esReferido === "si" && (
                <div className="mt-5 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/60 animate-fade-in relative">
                  <label className="block text-[11px] font-bold text-indigo-800 mb-2 uppercase tracking-wide">
                    Buscar Cliente Referidor
                  </label>
                  <div className="relative">
                    <SearchIcon />
                    <input
                      type="text"
                      name="idReferidor"
                      placeholder="Escribe el nombre o móvil..."
                      value={formData.idReferidor}
                      onChange={handleChange}
                      onFocus={() => setIsReferidorFocused(true)}
                      onBlur={() =>
                        setTimeout(() => setIsReferidorFocused(false), 200)
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all text-indigo-900 font-medium placeholder-indigo-300"
                    />

                    {showReferidorSugerencias && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-indigo-100 overflow-hidden z-50 animate-fade-in origin-top">
                        {sugerenciasReferidor.length > 0 ? (
                          <ul className="max-h-48 overflow-y-auto custom-scrollbar">
                            {sugerenciasReferidor.map((lead) => (
                              <li
                                key={lead.id}
                                onClick={() =>
                                  handleCustomChange("idReferidor", lead.nombre)
                                }
                                className="px-4 py-2.5 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                              >
                                <p className="text-sm font-medium text-gray-800">
                                  {lead.nombre}
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                  {lead.whatsapp}
                                </p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="px-4 py-3 text-xs text-indigo-400 text-center font-medium">
                            No se encontró al cliente
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. ESTADO DE VENTA */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
                3. Estado de la Venta
              </h4>

              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                      Fase Actual
                    </label>
                    <div className="relative">
                      <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all text-gray-700 font-semibold appearance-none cursor-pointer"
                      >
                        <option value="Agendado">Agendado</option>
                        <option value="Interesado">
                          Interesado (Documentación)
                        </option>
                        <option value="Inscrito">Inscrito</option>
                        <option value="No Interesado">No Interesado</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {formData.estado === "Agendado" && (
                    <div className="animate-fade-in origin-left">
                      <label className="block text-[11px] font-bold text-blue-700 mb-2 uppercase tracking-wide">
                        Agendar Llamada
                      </label>
                      <input
                        type="datetime-local"
                        name="fechaLlamada"
                        value={formData.fechaLlamada}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-blue-900 font-semibold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
                      />
                    </div>
                  )}

                  {formData.estado === "Inscrito" && (
                    <div className="animate-fade-in origin-left">
                      <label className="block text-[11px] font-bold text-emerald-700 mb-2 uppercase tracking-wide">
                        Turno Asignado
                      </label>
                      <SegmentedControl
                        options={[
                          { value: "mañana", label: "Mañana" },
                          { value: "tarde", label: "Tarde" },
                        ]}
                        value={formData.horario}
                        onChange={(val) => handleCustomChange("horario", val)}
                      />
                    </div>
                  )}

                  {/* MENSAJE DE AYUDA PARA INTERESADO */}
                  {formData.estado === "Interesado" && (
                    <div className="animate-fade-in flex items-center h-full pt-6">
                      <p className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                        Podrás gestionar sus documentos desde la tabla
                        principal.
                      </p>
                    </div>
                  )}

                  {formData.estado === "No Interesado" && (
                    <div className="animate-fade-in flex items-center h-full pt-6">
                      <p className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        El lead se archivará como perdido.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shadow-sm"
          >
            Cancelar
          </button>
          <button
            form="leadForm"
            type="submit"
            className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 outline-none focus:ring-4 focus:ring-indigo-100"
          >
            {leadToEdit ? "Actualizar Cliente" : "Guardar Cliente"}
          </button>
        </div>
      </div>
    </div>
  );
}
