import React, { useState, useRef } from "react";

// --- SUB-COMPONENTES (Sin cambios de diseño) ---
const ElegantDatePicker = ({
  value,
  onChange,
  type = "date",
  colorClass = "sky",
}) => {
  const inputRef = useRef(null);
  const handleContainerClick = () => {
    if (inputRef.current) {
      if (inputRef.current.showPicker) inputRef.current.showPicker();
      else {
        inputRef.current.focus();
        inputRef.current.click();
      }
    }
  };
  const displayDate = () => {
    if (!value) return "---";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "---";
    return type === "datetime-local"
      ? d.toLocaleString("es-ES", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  };
  return (
    <div
      onClick={handleContainerClick}
      className={`relative flex items-center justify-center px-2 py-1 rounded-lg border text-[9px] font-black uppercase transition-all cursor-pointer select-none ${colorClass === "sky" ? "bg-sky-50 text-sky-600 border-sky-100 hover:border-sky-300" : "bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-300"}`}
    >
      {displayDate()}
      <input
        ref={inputRef}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

const AccordionSelect = ({
  value,
  options,
  onChange,
  renderBadge,
  isOpen,
  onToggle,
}) => (
  <div className="relative flex flex-col items-center w-full min-w-[100px]">
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="cursor-pointer transition-transform active:scale-95 w-full flex justify-center"
    >
      {renderBadge(value)}
    </div>
    <div
      className={`absolute z-50 overflow-hidden transition-all duration-300 w-full max-w-[120px] top-full ${isOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
    >
      <div className="flex flex-col gap-0.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xl">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              onToggle();
            }}
            className={`px-2 py-1.5 text-[9px] font-bold rounded-lg text-center w-full ${value === opt.value ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const CheckboxItem = ({ checked, label, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    className="flex items-center gap-1.5 cursor-pointer group py-0.5"
  >
    <div
      className={`w-3 h-3 rounded-[3px] border flex items-center justify-center transition-all ${checked ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300 group-hover:border-indigo-400"}`}
    >
      {checked && (
        <svg
          className="w-2 h-2 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
    <span
      className={`text-[8px] font-bold uppercase ${checked ? "text-emerald-700 opacity-50 line-through" : "text-slate-500"}`}
    >
      {label}
    </span>
  </div>
);

export default function LeadTable({
  leads,
  onUpdateLead,
  onEditLead,
  onFollowUp,
  onDeleteLead,
  onViewComment,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleCopy = (id, text, type) => {
    const val = type === "tel" ? "+34" + text.replace(/\s+/g, "") : text;
    navigator.clipboard.writeText(val);
    setCopiedId(id + type);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div
      className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden"
      onClick={() => setOpenDropdownId(null)}
    >
      <div className="overflow-x-auto custom-scrollbar pb-24">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">
              <th className="px-4 py-4 text-left">Cliente</th>
              <th className="px-4 py-4 text-left">Contacto</th>
              <th className="px-2 py-4">Estado</th>
              <th className="px-2 py-4">Turno/Cita</th>
              <th className="px-2 py-4">Docs</th>
              <th className="px-2 py-4">Inicio</th>
              <th className="px-2 py-4">User</th>
              <th className="px-2 py-4">Asistencia</th>
              <th className="px-2 py-4">Regalo</th>
              <th className="px-2 py-4">Obs.</th>
              <th className="px-2 py-4">Estatus</th>
              <th className="px-4 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => {
              const asistencias = (lead.asistencia || []).filter(
                (d) => d,
              ).length;
              const nFaltas = 20 - asistencias;
              const isReferido = lead.esReferido === "si";

              // Colores condicionales
              let rowColorClass = "bg-white hover:bg-slate-50";
              let borderColor = "border-l-transparent";
              if (lead.estado === "Inscrito") {
                if (lead.status === "no apto") {
                  rowColorClass = "bg-rose-50 hover:bg-rose-100";
                  borderColor = "border-l-rose-500";
                } else if (lead.status === "finalizado") {
                  rowColorClass = "bg-emerald-50 hover:bg-emerald-100";
                  borderColor = "border-l-emerald-500";
                } else if (lead.status === "en curso") {
                  rowColorClass = "bg-blue-50 hover:bg-blue-100";
                  borderColor = "border-l-blue-500";
                } else if (lead.status === "abandonado") {
                  rowColorClass = "bg-orange-50 hover:bg-orange-100";
                  borderColor = "border-l-orange-500";
                }
              }

              return (
                <tr
                  key={lead.id}
                  className={`transition-colors group border-l-4 ${rowColorClass} ${borderColor}`}
                >
                  {/* CLIENTE: CORRECCIÓN AQUÍ */}
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                      {lead.nombre}
                      {isReferido && (
                        <span className="text-[7px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-black uppercase shadow-sm">
                          Ref
                        </span>
                      )}
                    </div>
                    <div className="text-[8px] text-slate-500 font-bold uppercase mt-0.5 flex items-center gap-1">
                      <span>{lead.provincia} •</span>
                      {/* LÓGICA DE VISUALIZACIÓN: Si es 'Desempleado' muestra 'Null' */}
                      <AccordionSelect
                        value={lead.situacion || "Null"}
                        isOpen={openDropdownId === lead.id + "sit"}
                        onToggle={() =>
                          setOpenDropdownId(
                            openDropdownId === lead.id + "sit"
                              ? null
                              : lead.id + "sit",
                          )
                        }
                        options={[
                          { value: "Null", label: "Null" },
                          { value: "Trabajador", label: "Trabajador" },
                          { value: "Autonomo", label: "Autonomo" },
                        ]}
                        onChange={(v) => onUpdateLead(lead.id, "situacion", v)}
                        renderBadge={(v) => (
                          <span className="cursor-pointer hover:text-indigo-600 transition-colors">
                            {v === "Desempleado" ? "Null" : v}
                          </span>
                        )}
                      />
                    </div>
                    {isReferido && lead.quienRefirio && (
                      <span className="text-[8px] text-indigo-600 block italic font-medium mt-0.5">
                        Rec. por: {lead.quienRefirio}
                      </span>
                    )}
                  </td>

                  {/* CONTACTO: NO ESPECIFICADO + SIN ICONO */}
                  <td className="px-4 py-3 space-y-1">
                    <div
                      className="flex items-center gap-1.5 group/copy cursor-pointer font-bold text-slate-700 text-[10px]"
                      onClick={() => handleCopy(lead.id, lead.whatsapp, "tel")}
                    >
                      <span>+34{lead.whatsapp}</span>
                      <svg
                        className={`w-3 h-3 ${copiedId === lead.id + "tel" ? "text-emerald-500" : "opacity-0 group-hover/copy:opacity-100 text-slate-400"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          strokeWidth={3}
                        />
                      </svg>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${lead.email ? "group/copy cursor-pointer" : ""}`}
                      onClick={() =>
                        lead.email && handleCopy(lead.id, lead.email, "mail")
                      }
                    >
                      <span
                        className={`text-[9px] truncate max-w-[100px] ${lead.email ? "text-slate-500" : "text-slate-300 italic tracking-tight"}`}
                      >
                        {lead.email || "No especificado"}
                      </span>
                      {/* ICONO SOLO SI HAY EMAIL */}
                      {lead.email && (
                        <svg
                          className={`w-2.5 h-2.5 ${copiedId === lead.id + "mail" ? "text-emerald-500" : "opacity-0 group-hover/copy:opacity-100 text-slate-400"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            strokeWidth={3}
                          />
                        </svg>
                      )}
                    </div>
                  </td>

                  {/* RESTO DE COLUMNAS (Sin cambios) */}
                  <td className="px-2 py-3 text-center">
                    <AccordionSelect
                      value={lead.estado}
                      isOpen={openDropdownId === lead.id + "st"}
                      onToggle={() =>
                        setOpenDropdownId(
                          openDropdownId === lead.id + "st"
                            ? null
                            : lead.id + "st",
                        )
                      }
                      options={[
                        { value: "Agendado", label: "Agendado" },
                        { value: "Interesado", label: "Interesado" },
                        { value: "Inscrito", label: "Inscrito" },
                        { value: "No Interesado", label: "No" },
                      ]}
                      onChange={(v) => onUpdateLead(lead.id, "estado", v)}
                      renderBadge={(v) => {
                        const c =
                          v === "Inscrito"
                            ? "text-emerald-700 bg-emerald-100"
                            : v === "No Interesado"
                              ? "text-red-600 bg-red-100"
                              : v === "Interesado"
                                ? "text-violet-700 bg-violet-100"
                                : "text-sky-700 bg-sky-100";
                        return (
                          <span
                            className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase shadow-sm ${c}`}
                          >
                            {v === "No Interesado" ? "No" : v}
                          </span>
                        );
                      }}
                    />
                  </td>
                  <td className="px-2 py-3 text-center">
                    {lead.estado === "Agendado" ? (
                      <ElegantDatePicker
                        type="datetime-local"
                        value={lead.fechaLlamada}
                        onChange={(v) =>
                          onUpdateLead(lead.id, "fechaLlamada", v)
                        }
                      />
                    ) : lead.estado === "Inscrito" ||
                      lead.estado === "Interesado" ? (
                      <AccordionSelect
                        value={lead.horario}
                        isOpen={openDropdownId === lead.id + "hor"}
                        onToggle={() =>
                          setOpenDropdownId(
                            openDropdownId === lead.id + "hor"
                              ? null
                              : lead.id + "hor",
                          )
                        }
                        options={[
                          { value: "mañana", label: "Mañana" },
                          { value: "tarde", label: "Tarde" },
                        ]}
                        onChange={(v) => onUpdateLead(lead.id, "horario", v)}
                        renderBadge={(v) => (
                          <span className="text-[8px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-lg uppercase shadow-sm">
                            {v || "S/T"}
                          </span>
                        )}
                      />
                    ) : (
                      "---"
                    )}
                  </td>
                  <td className="px-2 py-3">
                    {lead.estado === "Inscrito" ||
                    lead.estado === "Interesado" ? (
                      <div className="bg-white/60 p-1.5 rounded-xl border border-slate-200 flex flex-col gap-1 shadow-sm">
                        <CheckboxItem
                          checked={lead.doc1}
                          label={lead.situacion === "Autonomo" ? "REC" : "NOM"}
                          onChange={(v) => onUpdateLead(lead.id, "doc1", v)}
                        />
                        <CheckboxItem
                          checked={lead.doc2}
                          label={lead.situacion === "Autonomo" ? "IAE" : "CON"}
                          onChange={(v) => onUpdateLead(lead.id, "doc2", v)}
                        />
                      </div>
                    ) : (
                      <div className="text-center text-slate-300">---</div>
                    )}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {lead.estado === "Inscrito" ? (
                      <ElegantDatePicker
                        type="date"
                        colorClass="indigo"
                        value={lead.inicioClase}
                        onChange={(v) =>
                          onUpdateLead(lead.id, "inicioClase", v)
                        }
                      />
                    ) : (
                      "---"
                    )}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {lead.estado === "Inscrito" && (
                      <div className="flex justify-center">
                        <CheckboxItem
                          checked={lead.tieneUsuarios}
                          label={lead.tieneUsuarios ? "OK" : "PND"}
                          onChange={(v) =>
                            onUpdateLead(lead.id, "tieneUsuarios", v)
                          }
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {lead.estado === "Inscrito" ? (
                      <button
                        onClick={() => onFollowUp(lead)}
                        className={`group flex items-center justify-center gap-1.5 mx-auto px-2 py-1.5 rounded-lg border shadow-sm transition-all active:scale-95 ${nFaltas >= 3 ? "bg-rose-500 border-rose-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300"}`}
                      >
                        <span className="text-[10px] font-black">
                          {nFaltas}F
                        </span>
                        <svg
                          className={`w-3 h-3 ${nFaltas >= 3 ? "opacity-100" : "opacity-50 group-hover:opacity-100"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                      </button>
                    ) : (
                      <span className="text-slate-300 text-[10px]">---</span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {lead.estado === "Inscrito" ? (
                      <AccordionSelect
                        value={lead.regalo || "no"}
                        isOpen={openDropdownId === lead.id + "reg"}
                        onToggle={() =>
                          setOpenDropdownId(
                            openDropdownId === lead.id + "reg"
                              ? null
                              : lead.id + "reg",
                          )
                        }
                        options={[
                          { value: "si", label: "Entregado" },
                          { value: "no", label: "Pendiente" },
                        ]}
                        onChange={(v) => onUpdateLead(lead.id, "regalo", v)}
                        renderBadge={(v) => (
                          <span
                            className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 shadow-sm ${v === "si" ? "bg-purple-500 text-white border border-purple-600" : "bg-white text-slate-400 border border-slate-200"}`}
                          >
                            {v === "si" ? "🎁 SÍ" : "NO"}
                          </span>
                        )}
                      />
                    ) : (
                      <span className="text-slate-300 text-[10px]">---</span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {lead.comentarios ? (
                      <button
                        onClick={() =>
                          onViewComment(lead.comentarios, lead.nombre)
                        }
                        className="bg-indigo-50 text-indigo-600 p-2 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </button>
                    ) : (
                      <span className="text-slate-200">-</span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-center">
                    {lead.estado === "Inscrito" && (
                      <AccordionSelect
                        value={lead.status || "en curso"}
                        isOpen={openDropdownId === lead.id + "sts"}
                        onToggle={() =>
                          setOpenDropdownId(
                            openDropdownId === lead.id + "sts"
                              ? null
                              : lead.id + "sts",
                          )
                        }
                        options={[
                          { value: "en curso", label: "Curso" },
                          { value: "finalizado", label: "Fin" },
                          { value: "abandonado", label: "Aband" },
                          { value: "no apto", label: "No Apto" },
                        ]}
                        onChange={(v) => onUpdateLead(lead.id, "status", v)}
                        renderBadge={(v) => {
                          let badgeClass =
                            "bg-blue-500 text-white border-blue-600";
                          if (v === "finalizado")
                            badgeClass =
                              "bg-emerald-500 text-white border-emerald-600";
                          if (v === "abandonado")
                            badgeClass =
                              "bg-orange-500 text-white border-orange-600";
                          if (v === "no apto")
                            badgeClass =
                              "bg-rose-600 text-white border-rose-700 animate-pulse";
                          return (
                            <span
                              className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase shadow-md border ${badgeClass}`}
                            >
                              {v}
                            </span>
                          );
                        }}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEditLead(lead)}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm hover:shadow active:scale-95 transition-all"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            strokeWidth={2}
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteLead(lead.id)}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-rose-300 hover:text-rose-600 shadow-sm hover:shadow active:scale-95 transition-all"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            strokeWidth={2}
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
