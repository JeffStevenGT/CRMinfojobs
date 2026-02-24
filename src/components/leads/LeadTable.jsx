import React, { useState } from "react";

// --- ACCORDION SELECT (Estilo Limpio) ---
const AccordionSelect = ({
  value,
  options,
  onChange,
  renderBadge,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  if (disabled) return renderBadge(value, false);

  return (
    <div className="flex flex-col items-center w-full min-w-[130px]">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer transition-transform active:scale-95 w-full flex justify-center"
      >
        {renderBadge(value, isOpen)}
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] w-full ${isOpen ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}
      >
        <div className="flex flex-col gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-200/50 shadow-inner">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all text-center w-full ${value === opt.value ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-white hover:text-gray-800"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- CHECKBOX DOCUMENTOS ---
const CheckboxItem = ({ checked, label, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    className="flex items-start gap-2 cursor-pointer group py-0.5"
  >
    <div
      className={`mt-0.5 w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-all 
      ${checked ? "bg-emerald-500 border-emerald-500" : "bg-white border-gray-300 group-hover:border-indigo-400"}`}
    >
      {checked && (
        <svg
          className="w-2.5 h-2.5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
    <span
      className={`text-[10px] font-medium transition-all ${checked ? "text-emerald-700 opacity-60 line-through" : "text-gray-600"}`}
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
}) {
  const [copiedId, setCopiedId] = useState(null);

  const getEstadoOptions = (estadoActual) => {
    const base = [
      { value: "Agendado", label: "Agendado" },
      { value: "Interesado", label: "Interesado" },
      { value: "Inscrito", label: "Inscrito" },
      { value: "No Interesado", label: "No Interesado" },
    ];
    return estadoActual === "Lead"
      ? [{ value: "Lead", label: "Lead Nuevo" }, ...base]
      : base;
  };

  const handleCopy = (id, num) => {
    navigator.clipboard.writeText(num.replace(/\s+/g, ""));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto min-h-[400px] pb-20 custom-scrollbar">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-400 font-semibold border-b border-gray-100 text-[10px] uppercase tracking-widest text-center">
            <tr>
              <th className="px-6 py-5 text-left">Cliente</th>
              <th className="px-6 py-5 text-left">Contacto</th>
              <th className="px-6 py-5">Estado</th>
              <th className="px-6 py-5">Gestión / Turno</th>
              <th className="px-6 py-5 w-48">Documentación</th>
              <th className="px-6 py-5">Faltas</th>
              <th className="px-6 py-5">Progreso</th>
              <th className="px-6 py-5">Regalo</th>
              <th className="px-4 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-600">
            {leads.map((lead) => {
              const asistencias = (lead.asistencia || []).filter(
                (d) => d,
              ).length;
              const nFaltas = 20 - asistencias;
              const inhabilitado = asistencias < 18; // Regla: Min 18 clases
              const yaFinalizo = lead.finalizo === "si";
              const yaTieneRegalo = lead.regalo === "si";

              let colorFila = "hover:bg-gray-50/40";
              if (yaTieneRegalo)
                colorFila = "bg-emerald-50/30 border-l-4 border-l-emerald-400";
              else if (yaFinalizo)
                colorFila = "bg-sky-50/40 border-l-4 border-l-sky-400";
              else if (inhabilitado && lead.estado === "Inscrito")
                colorFila = "bg-red-50/30 border-l-4 border-l-red-400";

              return (
                <tr
                  key={lead.id}
                  className={`group transition-all duration-300 ${colorFila}`}
                >
                  <td className="px-6 py-5 align-top">
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      {lead.nombre}
                      {lead.esReferido === "si" && (
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded text-[9px] font-bold border border-indigo-100 uppercase">
                          Ref
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tight">
                      {lead.provincia} • {lead.situacion}
                    </div>
                  </td>

                  <td className="px-6 py-5 align-top">
                    <div className="font-medium flex items-center group/copy">
                      <span>{lead.whatsapp}</span>
                      <button
                        onClick={() => handleCopy(lead.id, lead.whatsapp)}
                        className={`ml-2 p-1 rounded transition-all ${copiedId === lead.id ? "text-emerald-500" : "opacity-0 group-hover/copy:opacity-100 text-gray-300 hover:text-indigo-400"}`}
                      >
                        {copiedId === lead.id ? (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
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
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4 align-top text-center">
                    <AccordionSelect
                      value={lead.estado}
                      options={getEstadoOptions(lead.estado)}
                      onChange={(v) => onUpdateLead(lead.id, "estado", v)}
                      renderBadge={(v) => (
                        <span
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase border shadow-sm bg-white ${v === "Inscrito" ? "text-emerald-600 border-emerald-100" : "text-gray-500 border-gray-100"}`}
                        >
                          {v}
                        </span>
                      )}
                    />
                  </td>

                  <td className="px-6 py-4 align-top text-center">
                    {lead.estado === "Agendado" ? (
                      <input
                        type="datetime-local"
                        value={lead.fechaLlamada}
                        onChange={(e) =>
                          onUpdateLead(lead.id, "fechaLlamada", e.target.value)
                        }
                        className="text-[10px] font-medium text-blue-600 bg-white border border-blue-100 rounded-lg px-2 py-1 outline-none"
                      />
                    ) : lead.estado === "Inscrito" ? (
                      <AccordionSelect
                        value={lead.horario}
                        options={[
                          { value: "mañana", label: "Mañana" },
                          { value: "tarde", label: "Tarde" },
                        ]}
                        onChange={(v) => onUpdateLead(lead.id, "horario", v)}
                        renderBadge={(v) => (
                          <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white border border-emerald-50 text-emerald-500 uppercase">
                            Turno {v}
                          </span>
                        )}
                      />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4 align-top">
                    {lead.estado === "Interesado" ? (
                      <div className="bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                        <CheckboxItem
                          checked={lead.doc1}
                          label={
                            lead.situacion === "Autonomo"
                              ? "Recibo Autónomo"
                              : "Recibo Nómina"
                          }
                          onChange={(v) => onUpdateLead(lead.id, "doc1", v)}
                        />
                        <CheckboxItem
                          checked={lead.doc2}
                          label={
                            lead.situacion === "Autonomo"
                              ? "Alta IAE"
                              : "Contrato"
                          }
                          onChange={(v) => onUpdateLead(lead.id, "doc2", v)}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4 align-top text-center">
                    {lead.estado === "Inscrito" ? (
                      <span
                        className={`text-[10px] font-bold ${inhabilitado ? "text-red-500" : "text-gray-400"}`}
                      >
                        {nFaltas} {nFaltas === 1 ? "FALTA" : "FALTAS"}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4 align-top text-center">
                    {lead.estado === "Inscrito" ? (
                      inhabilitado ? (
                        <span className="text-[9px] font-bold uppercase text-gray-400 italic">
                          No Apto (+2 Faltas)
                        </span>
                      ) : (
                        <AccordionSelect
                          value={lead.finalizo}
                          options={[
                            { value: "en curso", label: "En Curso" },
                            { value: "si", label: "Finalizó" },
                          ]}
                          onChange={(v) => onUpdateLead(lead.id, "finalizo", v)}
                          renderBadge={(v) => (
                            <span
                              className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase border bg-white ${v === "si" ? "text-sky-500 border-sky-100" : "text-emerald-500 border-emerald-100"}`}
                            >
                              {v === "si" ? "Finalizó" : "En Curso"}
                            </span>
                          )}
                        />
                      )
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4 align-top text-center">
                    {/* REGLA: Solo en Inscrito, si finalizó y tiene >= 18 asistencias */}
                    {lead.estado === "Inscrito" &&
                    yaFinalizo &&
                    !inhabilitado ? (
                      <AccordionSelect
                        value={lead.regalo || "no"}
                        options={[
                          { value: "no", label: "Pendiente" },
                          { value: "si", label: "Entregado" },
                        ]}
                        onChange={(v) => onUpdateLead(lead.id, "regalo", v)}
                        renderBadge={(v) => (
                          <span
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border bg-white ${v === "si" ? "text-emerald-600 border-emerald-200" : "text-gray-400 border-gray-100"}`}
                          >
                            {v === "si" ? "Entregado 🎁" : "Pendiente"}
                          </span>
                        )}
                      />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-4 py-4 align-top text-center flex gap-1">
                    <button
                      onClick={() => onFollowUp(lead)}
                      className="p-2 text-indigo-400 hover:bg-indigo-50 rounded-xl transition-all"
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
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEditLead(lead)}
                      className="p-2 text-gray-300 hover:text-indigo-600 rounded-xl transition-all"
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
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
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
