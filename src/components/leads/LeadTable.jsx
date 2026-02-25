import React, { useState } from "react";

// --- SELECTORES (Estilo SENATI - Ultra Compacto) ---
const AccordionSelect = ({
  value,
  options,
  onChange,
  renderBadge,
  isOpen,
  onToggle,
  disabledOptions = [],
}) => {
  return (
    <div className="flex flex-col items-center w-full min-w-[110px]">
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="cursor-pointer transition-transform active:scale-95 w-full flex justify-center"
      >
        {renderBadge(value, isOpen)}
      </div>
      <div
        className={`absolute z-50 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] w-full max-w-[120px] ${
          isOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="flex flex-col gap-0.5 bg-gray-50/90 p-1 rounded-lg border border-gray-200/50 shadow-inner">
          {options.map((opt) => {
            const isDisabled = disabledOptions.includes(opt.value);
            return (
              <button
                key={opt.value}
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled) {
                    onChange(opt.value);
                    onToggle();
                  }
                }}
                className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all text-center w-full 
                  ${value === opt.value ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-white"}
                  ${isDisabled ? "opacity-30 cursor-not-allowed grayscale" : ""}`}
              >
                {opt.label} {isDisabled && "🔒"}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- CHECKBOX (Miniatura con efecto line-through) ---
const CheckboxItem = ({ checked, label, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    className="flex items-start gap-1 cursor-pointer group py-0.5"
  >
    <div
      className={`mt-0.5 w-3 h-3 rounded-[3px] border flex-shrink-0 flex items-center justify-center transition-all 
      ${checked ? "bg-emerald-500 border-emerald-500" : "bg-white border-gray-300 group-hover:border-indigo-400"}`}
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
            strokeWidth={4}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
    <span
      className={`text-[9px] font-medium leading-none transition-all ${checked ? "text-emerald-700 opacity-60 line-through" : "text-gray-600"}`}
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
  onShowWarning,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleCopy = (id, text) => {
    if (!text) return;
    const prefijo = id.endsWith("t") ? "+34" : "";
    navigator.clipboard.writeText(prefijo + text.replace(/\s+/g, ""));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      onClick={() => setOpenDropdownId(null)}
    >
      <div className="overflow-x-auto min-h-[450px] pb-20 custom-scrollbar">
        <table className="min-w-full text-xs text-left">
          <thead className="bg-gray-50/50 text-gray-400 font-bold border-b border-gray-100 text-[8px] uppercase tracking-wider text-center">
            <tr>
              <th className="px-3 py-3 text-left">Cliente</th>
              <th className="px-3 py-3 text-left">Contacto</th>
              <th className="px-1 py-3">Estado</th>
              <th className="px-1 py-3">Turno</th>
              <th className="px-1 py-3">Docs</th>
              <th className="px-1 py-3">Inicio</th>
              <th className="px-1 py-3">User</th>
              <th className="px-1 py-3">Faltas</th>
              <th className="px-1 py-3">Regalo</th>
              <th className="px-1 py-3">Estatus</th>
              <th className="px-2 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-600">
            {leads.map((lead) => {
              const asistencias = (lead.asistencia || []).filter(
                (d) => d,
              ).length;
              const nFaltas = 20 - asistencias;
              const tieneDocs = lead.doc1 && lead.doc2;
              const esInscrito = lead.estado === "Inscrito";
              const tieneUser = lead.tieneUsuarios;
              const canFollow = esInscrito && tieneDocs && tieneUser;
              const esAutonomo = lead.situacion === "Autonomo";

              // Color de fila dinámico basado en Estatus/Faltas
              let colorFila = "hover:bg-gray-50/40";
              if (nFaltas >= 3 && esInscrito)
                colorFila = "bg-red-50/30 border-l-2 border-l-red-500";
              else if (lead.status === "finalizado")
                colorFila = "bg-emerald-50/30 border-l-2 border-l-emerald-500";
              else if (lead.status === "abandonado")
                colorFila = "bg-amber-50/30 border-l-2 border-l-amber-500";
              else if (lead.status === "en curso")
                colorFila = "bg-blue-50/30 border-l-2 border-l-blue-500";

              return (
                <tr
                  key={lead.id}
                  className={`group transition-all duration-300 ${colorFila}`}
                >
                  {/* CLIENTE */}
                  <td className="px-3 py-2 align-top">
                    <div className="font-bold text-gray-800 text-[12px] flex items-center gap-1">
                      {lead.nombre}
                      {lead.esReferido === "si" && (
                        <span
                          title={`Referidor: ${lead.idReferidor}`}
                          className="px-1 py-0.2 bg-indigo-50 text-indigo-500 rounded text-[7px] font-black border border-indigo-100 uppercase"
                        >
                          Ref
                        </span>
                      )}
                    </div>
                    <div className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">
                      {lead.provincia} • {lead.situacion}
                    </div>
                  </td>

                  {/* CONTACTO */}
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-col gap-0.5">
                      <div
                        className="font-bold flex items-center group/copy cursor-pointer text-[10px]"
                        onClick={() => handleCopy(lead.id + "t", lead.whatsapp)}
                      >
                        <span>
                          {lead.whatsapp ? `+34${lead.whatsapp}` : "---"}
                        </span>
                        <svg
                          className={`ml-1 w-3 h-3 transition-all ${copiedId === lead.id + "t" ? "text-emerald-500" : "opacity-0 group-hover/copy:opacity-100 text-gray-300"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            strokeWidth={2.5}
                          />
                        </svg>
                      </div>
                      <div
                        className="text-[9px] text-gray-400 italic flex items-center group/copy-m cursor-pointer"
                        onClick={() => handleCopy(lead.id + "m", lead.email)}
                      >
                        <span className="truncate max-w-[80px]">
                          {lead.email || "---"}
                        </span>
                        <svg
                          className={`ml-1 w-2.5 h-2.5 transition-all ${copiedId === lead.id + "m" ? "text-emerald-500" : "opacity-0 group-hover/copy-m:opacity-100 text-gray-300"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            strokeWidth={2.5}
                          />
                        </svg>
                      </div>
                    </div>
                  </td>

                  {/* ESTADO: Colores específicos solicitados */}
                  <td className="px-1 py-2 text-center">
                    <AccordionSelect
                      value={lead.estado}
                      isOpen={openDropdownId === `${lead.id}-st`}
                      onToggle={() => toggleDropdown(`${lead.id}-st`)}
                      options={[
                        { value: "Agendado", label: "Agendado" },
                        { value: "Interesado", label: "Interesado" },
                        { value: "Inscrito", label: "Inscrito" },
                        { value: "No Interesado", label: "No Interesado" },
                      ]}
                      onChange={(v) => onUpdateLead(lead.id, "estado", v)}
                      renderBadge={(v) => {
                        const colorMap = {
                          Agendado: "text-sky-600 border-sky-100 bg-sky-50/50",
                          Interesado:
                            "text-violet-600 border-violet-100 bg-violet-50/50", // LILA
                          Inscrito:
                            "text-emerald-600 border-emerald-100 bg-emerald-50/50", // ÚNICO VERDE
                          "No Interesado":
                            "text-red-600 border-red-100 bg-red-50/50", // ÚNICO ROJO
                        };
                        return (
                          <span
                            className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase border shadow-sm ${colorMap[v] || "text-gray-500 border-gray-100 bg-white"}`}
                          >
                            {v === "No Interesado" ? "No" : v}
                          </span>
                        );
                      }}
                    />
                  </td>

                  <td className="px-1 py-2 text-center">
                    {lead.estado === "Agendado" ? (
                      <input
                        type="datetime-local"
                        value={lead.fechaLlamada}
                        onChange={(e) =>
                          onUpdateLead(lead.id, "fechaLlamada", e.target.value)
                        }
                        className="text-[9px] font-bold text-blue-600 bg-white border border-blue-50 rounded-md p-0.5 outline-none"
                      />
                    ) : lead.estado === "Interesado" || esInscrito ? (
                      <AccordionSelect
                        value={lead.horario}
                        isOpen={openDropdownId === `${lead.id}-hor`}
                        onToggle={() => toggleDropdown(`${lead.id}-hor`)}
                        options={[
                          { value: "", label: "Ninguno" },
                          { value: "mañana", label: "Mañana" },
                          { value: "tarde", label: "Tarde" },
                        ]}
                        onChange={(v) => onUpdateLead(lead.id, "horario", v)}
                        renderBadge={(v) => (
                          <span
                            className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase border bg-white ${!v ? "text-gray-300 border-gray-50" : "text-indigo-500 border-indigo-50"}`}
                          >
                            {v ? v : "S/T"}
                          </span>
                        )}
                      />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* DOCS: Lógica dinámica trabajador/autónomo */}
                  <td className="px-1 py-2">
                    {lead.estado === "Interesado" || esInscrito ? (
                      <div className="bg-gray-50/50 p-1 rounded-lg border border-gray-100">
                        <CheckboxItem
                          checked={lead.doc1}
                          label={esAutonomo ? "Recibo" : "Nómina"}
                          onChange={(v) => onUpdateLead(lead.id, "doc1", v)}
                        />
                        <CheckboxItem
                          checked={lead.doc2}
                          label={esAutonomo ? "IAE" : "Cont."}
                          onChange={(v) => onUpdateLead(lead.id, "doc2", v)}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-1 py-2 text-center">
                    {esInscrito ? (
                      <input
                        type="date"
                        value={lead.inicioClase || ""}
                        onChange={(e) =>
                          onUpdateLead(lead.id, "inicioClase", e.target.value)
                        }
                        className={`text-[9px] font-bold p-0.5 rounded border outline-none ${!lead.inicioClase ? "border-red-100 text-red-500" : "border-blue-50 text-blue-500"}`}
                      />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* USER: Columna obligatoria restaurada */}
                  <td className="px-1 py-2 text-center">
                    {esInscrito ? (
                      <div className="flex justify-center">
                        <CheckboxItem
                          checked={lead.tieneUsuarios}
                          label={lead.tieneUsuarios ? "OK" : "PEND"}
                          onChange={(v) =>
                            onUpdateLead(lead.id, "tieneUsuarios", v)
                          }
                        />
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-1 py-2 text-center">
                    {esInscrito ? (
                      <span
                        className={`text-[9px] font-bold ${nFaltas >= 3 ? "text-red-500" : "text-gray-400"}`}
                      >
                        {nFaltas}F
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* REGALO: Bloqueado por faltas */}
                  <td className="px-1 py-2 text-center">
                    {esInscrito ? (
                      nFaltas >= 3 ? (
                        <span className="text-[8px] font-bold text-gray-300 italic">
                          No Apto
                        </span>
                      ) : (
                        <AccordionSelect
                          value={lead.regalo || "no"}
                          isOpen={openDropdownId === `${lead.id}-reg`}
                          onToggle={() => toggleDropdown(`${lead.id}-reg`)}
                          options={[
                            { value: "no", label: "No" },
                            { value: "si", label: "Sí" },
                          ]}
                          onChange={(v) => onUpdateLead(lead.id, "regalo", v)}
                          renderBadge={(v) => (
                            <span
                              className={`px-2 py-1 rounded-lg text-[8px] font-black border ${v === "si" ? "text-emerald-600 border-emerald-100 bg-emerald-50" : "text-gray-400 border-gray-100 bg-white"}`}
                            >
                              {v === "si" ? "🎁 OK" : "PEND."}
                            </span>
                          )}
                        />
                      )
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* ESTATUS: Entre Regalo y Acciones / Bloqueado por USER */}
                  <td className="px-1 py-2 text-center">
                    {esInscrito ? (
                      <AccordionSelect
                        value={
                          nFaltas >= 3 ? "no apto" : lead.status || "ninguno"
                        }
                        isOpen={openDropdownId === `${lead.id}-sts`}
                        onToggle={() => toggleDropdown(`${lead.id}-sts`)}
                        disabledOptions={!tieneUser ? ["finalizado"] : []}
                        options={[
                          { value: "ninguno", label: "Ninguno" },
                          { value: "en curso", label: "En Curso" },
                          { value: "finalizado", label: "Finalizado" },
                          { value: "abandonado", label: "Abandonado" },
                        ]}
                        onChange={(v) => onUpdateLead(lead.id, "status", v)}
                        renderBadge={(v) => {
                          if (v === "finalizado" && !tieneUser)
                            onUpdateLead(lead.id, "status", "en curso");
                          return (
                            <span
                              className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase border ${v === "finalizado" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : v === "no apto" ? "bg-red-50 text-red-600 border-red-100" : v === "abandonado" ? "bg-amber-50 text-amber-600 border-amber-100" : v === "en curso" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-white text-gray-400 border-gray-100"}`}
                            >
                              {v}
                            </span>
                          );
                        }}
                      />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  <td className="px-2 py-2 text-center">
                    <div className="flex justify-center gap-0.5">
                      {esInscrito && (
                        <button
                          onClick={() =>
                            canFollow
                              ? onFollowUp(lead)
                              : onShowWarning("Docs/User OK")
                          }
                          className={`p-1 rounded-md transition-all ${canFollow ? "text-indigo-400 hover:bg-indigo-50" : "text-gray-200 cursor-not-allowed"}`}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                              strokeWidth={2.5}
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => onEditLead(lead)}
                        className="p-1 text-gray-300 hover:text-indigo-600 rounded-md transition-all"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            strokeWidth={2.5}
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteLead(lead.id)}
                        className="p-1 text-red-200 hover:text-red-500 rounded-md transition-all"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            strokeWidth={2.5}
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
