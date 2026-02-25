import React, { useState } from "react";

// --- SUB-COMPONENTES DE DISEÑO ---
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

const ElegantDatePicker = ({
  value,
  onChange,
  type = "date",
  colorClass = "sky",
}) => (
  <div
    className={`relative flex items-center justify-center px-2 py-1 rounded-lg border text-[9px] font-black uppercase transition-all ${colorClass === "sky" ? "bg-sky-50 text-sky-600 border-sky-100 hover:border-sky-300" : "bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-300"}`}
  >
    {value || "---"}
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
    />
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

// --- TABLA PRINCIPAL ---
export default function LeadTable({
  leads,
  onUpdateLead,
  onEditLead,
  onFollowUp,
  onDeleteLead,
  onShowWarning,
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
      <div className="overflow-x-auto custom-scrollbar pb-20">
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
              <th className="px-2 py-4">Faltas</th>
              <th className="px-2 py-4">Estatus</th>
              <th className="px-4 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => {
              const asistencias = (lead.asistencia || []).filter(
                (d) => d,
              ).length;
              const nFaltas = 20 - asistencias;
              const isReferido = lead.esReferido === "si";

              return (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  {/* CLIENTE */}
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5">
                      {lead.nombre}
                      {isReferido && (
                        <span className="text-[7px] bg-indigo-500 text-white px-1 py-0.5 rounded font-black uppercase">
                          Ref
                        </span>
                      )}
                    </div>
                    <div className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">
                      {lead.provincia} • {lead.situacion}
                      {isReferido && lead.quienRefirio && (
                        <span className="text-indigo-500 block italic normal-case font-medium mt-0.5 tracking-tight">
                          Recomendado por: {lead.quienRefirio}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* CONTACTO ACTUALIZADO */}
                  <td className="px-4 py-3 space-y-1">
                    <div
                      className="flex items-center gap-1.5 group/copy cursor-pointer font-bold text-slate-600 text-[10px]"
                      onClick={() => handleCopy(lead.id, lead.whatsapp, "tel")}
                    >
                      <span>+34{lead.whatsapp}</span>
                      <svg
                        className={`w-3 h-3 ${copiedId === lead.id + "tel" ? "text-emerald-500" : "opacity-0 group-hover/copy:opacity-100 text-slate-300"}`}
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
                    {lead.email && (
                      <div
                        className="flex items-center gap-1.5 group/copy cursor-pointer text-slate-400 text-[9px] font-medium"
                        onClick={() => handleCopy(lead.id, lead.email, "mail")}
                      >
                        <span className="truncate max-w-[120px]">
                          {lead.email}
                        </span>
                        <svg
                          className={`w-2.5 h-2.5 ${copiedId === lead.id + "mail" ? "text-emerald-500" : "opacity-0 group-hover/copy:opacity-100 text-slate-300"}`}
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
                    )}
                  </td>

                  {/* ESTADO */}
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
                            ? "text-emerald-600 bg-emerald-50"
                            : v === "No Interesado"
                              ? "text-red-500 bg-red-50"
                              : v === "Interesado"
                                ? "text-violet-600 bg-violet-50"
                                : "text-sky-600 bg-sky-50";
                        return (
                          <span
                            className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${c}`}
                          >
                            {v === "No Interesado" ? "No" : v}
                          </span>
                        );
                      }}
                    />
                  </td>

                  {/* TURNO / CITA */}
                  <td className="px-2 py-3 text-center">
                    {lead.estado === "Agendado" ? (
                      <ElegantDatePicker
                        value={lead.fechaLlamada}
                        onChange={(v) =>
                          onUpdateLead(lead.id, "fechaLlamada", v)
                        }
                        type="datetime-local"
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
                          <span className="text-[8px] font-bold text-slate-400 border px-2 py-0.5 rounded-lg uppercase">
                            {v || "S/T"}
                          </span>
                        )}
                      />
                    ) : (
                      "---"
                    )}
                  </td>

                  {/* DOCS (Lógica de visibilidad corregida) */}
                  <td className="px-2 py-3">
                    {lead.estado === "Interesado" ||
                    lead.estado === "Inscrito" ? (
                      <div className="bg-slate-50/50 p-1 rounded-xl border border-slate-100 flex flex-col gap-0.5">
                        <CheckboxItem
                          checked={lead.doc1}
                          label={
                            lead.situacion === "Autonomo" ? "Recibo" : "Nómina"
                          }
                          onChange={(v) => onUpdateLead(lead.id, "doc1", v)}
                        />
                        <CheckboxItem
                          checked={lead.doc2}
                          label={
                            lead.situacion === "Autonomo" ? "IAE" : "Cont."
                          }
                          onChange={(v) => onUpdateLead(lead.id, "doc2", v)}
                        />
                      </div>
                    ) : (
                      <div className="text-center text-slate-200 text-[10px]">
                        ---
                      </div>
                    )}
                  </td>

                  {/* RESTO DE COLUMNAS */}
                  <td className="px-2 py-3 text-center">
                    {lead.estado === "Inscrito" ? (
                      <ElegantDatePicker
                        value={lead.inicioClase}
                        onChange={(v) =>
                          onUpdateLead(lead.id, "inicioClase", v)
                        }
                        colorClass="indigo"
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
                          label={lead.tieneUsuarios ? "OK" : "PEND"}
                          onChange={(v) =>
                            onUpdateLead(lead.id, "tieneUsuarios", v)
                          }
                        />
                      </div>
                    )}
                  </td>

                  <td className="px-2 py-3 text-center">
                    <span
                      className={`text-[10px] font-black ${nFaltas >= 3 ? "text-red-500" : "text-slate-400"}`}
                    >
                      {nFaltas}F
                    </span>
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
                          { value: "en curso", label: "En Curso" },
                          { value: "finalizado", label: "Finalizado" },
                          { value: "abandonado", label: "Abandonado" },
                        ]}
                        onChange={(v) => onUpdateLead(lead.id, "status", v)}
                        renderBadge={(v) => (
                          <span
                            className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${v === "finalizado" ? "bg-emerald-50 text-emerald-600" : v === "abandonado" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}
                          >
                            {v}
                          </span>
                        )}
                      />
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEditLead(lead)}
                        className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"
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
                        className="p-1.5 text-red-200 hover:text-red-500 transition-colors"
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
