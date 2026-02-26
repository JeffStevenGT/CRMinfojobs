import React, { useState, useRef } from "react";

// --- SUB-COMPONENTES ---
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
  compact,
}) => (
  <div
    className={`relative flex flex-col ${compact ? "w-auto items-start" : "items-center w-full min-w-[100px]"}`}
  >
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`cursor-pointer transition-transform active:scale-95 flex justify-center ${compact ? "" : "w-full"}`}
    >
      {renderBadge(value)}
    </div>
    <div
      className={`absolute z-[60] overflow-hidden transition-all duration-300 ${compact ? "min-w-[100px] left-0" : "w-full max-w-[120px]"} top-full ${isOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
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
  onFinalize,
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
      <div className="overflow-x-auto custom-scrollbar pb-32">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">
              <th className="px-4 py-4 text-left">Cliente</th>
              <th className="px-4 py-4 text-left">Contacto</th>
              <th className="px-2 py-4">Estado</th>
              <th className="px-2 py-4">Turno/Cita</th>
              <th className="px-2 py-4">Docs</th>
              <th className="px-2 py-4">Fechas</th>{" "}
              {/* Actualizado visualmente */}
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
              const isReferido = String(lead.esReferido).toLowerCase() === "si";

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
                } else if (lead.status === "pendiente") {
                  rowColorClass = "bg-slate-100 hover:bg-slate-200";
                  borderColor = "border-l-slate-400";
                }
              }

              return (
                <tr
                  key={lead.id}
                  className={`transition-colors group border-l-4 ${rowColorClass} ${borderColor}`}
                >
                  {/* CLIENTE */}
                  <td className="px-4 py-3 min-w-[200px] align-top">
                    {lead.fechaCreacion && (
                      <div className="text-[6.5px] font-black text-slate-300 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <svg
                          className="w-2.5 h-2.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(lead.fechaCreacion).toLocaleDateString(
                          "es-ES",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )}{" "}
                        •{" "}
                        {new Date(lead.fechaCreacion).toLocaleTimeString(
                          "es-ES",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </div>
                    )}
                    <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5 flex-wrap uppercase">
                      <span>{lead.nombre}</span>
                      {isReferido && (
                        <span className="text-[7px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-black uppercase shadow-sm">
                          Ref
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-[8px] text-slate-500 font-bold uppercase tracking-wide">
                      <span>{lead.provincia || "S/P"}</span>
                      <span className="text-slate-400">•</span>
                      <AccordionSelect
                        compact={true}
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
                            {v === "Desempleado" ? "NULL" : v}
                          </span>
                        )}
                      />
                    </div>
                    {isReferido && lead.quienRefirio && (
                      <div className="text-[8px] text-indigo-600 italic font-medium mt-1 leading-tight">
                        Recomendado por: {lead.quienRefirio}
                      </div>
                    )}
                  </td>

                  {/* CONTACTO */}
                  <td className="px-4 py-3 space-y-1.5 align-top">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center gap-1.5 group cursor-pointer font-bold text-slate-700 text-[10px]"
                        onClick={() =>
                          handleCopy(lead.id, lead.whatsapp, "tel")
                        }
                        title="Copiar teléfono"
                      >
                        <span>+34{lead.whatsapp}</span>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform hover:scale-110 active:scale-95 ${copiedId === lead.id + "tel" ? "text-emerald-500 drop-shadow-sm" : "text-slate-300 group-hover:text-slate-500"}`}
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
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateLead(
                            lead.id,
                            "respondioWpp",
                            !lead.respondioWpp,
                          );
                        }}
                        className={`transition-transform hover:scale-110 active:scale-95 ${lead.respondioWpp ? "text-emerald-500 drop-shadow-sm" : "text-slate-300 hover:text-emerald-400"}`}
                        title={
                          lead.respondioWpp
                            ? "Respondió WhatsApp"
                            : "No respondió WhatsApp"
                        }
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.48-1.459-1.653-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                      </button>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 ${lead.email ? "group cursor-pointer" : ""}`}
                      onClick={() =>
                        lead.email && handleCopy(lead.id, lead.email, "mail")
                      }
                      title={lead.email ? "Copiar email" : ""}
                    >
                      <span
                        className={`text-[9px] truncate max-w-[100px] ${lead.email ? "text-slate-500" : "text-slate-300 italic tracking-tight"}`}
                      >
                        {lead.email || "No especificado"}
                      </span>
                      {lead.email && (
                        <svg
                          className={`w-3.5 h-3.5 transition-transform hover:scale-110 active:scale-95 ${copiedId === lead.id + "mail" ? "text-emerald-500 drop-shadow-sm" : "text-slate-300 group-hover:text-slate-500"}`}
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
                    </div>
                  </td>

                  {/* ESTADO CON TERMÓMETRO */}
                  <td className="px-2 py-3 text-center align-top">
                    <div className="flex flex-col items-center gap-1.5">
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
                      {(lead.estado === "Agendado" ||
                        lead.estado === "Interesado") && (
                        <AccordionSelect
                          compact={true}
                          value={lead.temperatura || "Tibio"}
                          isOpen={openDropdownId === lead.id + "temp"}
                          onToggle={() =>
                            setOpenDropdownId(
                              openDropdownId === lead.id + "temp"
                                ? null
                                : lead.id + "temp",
                            )
                          }
                          options={[
                            { value: "Frío", label: "❄️ Frío" },
                            { value: "Tibio", label: "☀️ Tibio" },
                            { value: "Caliente", label: "🔥 Alto" },
                          ]}
                          onChange={(v) =>
                            onUpdateLead(lead.id, "temperatura", v)
                          }
                          renderBadge={(v) => {
                            let color =
                              "text-amber-600 bg-amber-50 border-amber-100";
                            let icon = "☀️";
                            if (v === "Caliente") {
                              color =
                                "text-orange-600 bg-orange-50 border-orange-200";
                              icon = "🔥";
                            }
                            if (v === "Frío") {
                              color =
                                "text-blue-500 bg-blue-50 border-blue-100";
                              icon = "❄️";
                            }
                            return (
                              <span
                                className={`px-1.5 py-0.5 rounded border text-[7px] font-black uppercase shadow-sm flex items-center gap-1 ${color}`}
                              >
                                <span>{icon}</span> {v}
                              </span>
                            );
                          }}
                        />
                      )}
                    </div>
                  </td>

                  {/* TURNO/CITA */}
                  <td className="px-2 py-3 text-center align-top">
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

                  {/* DOCS */}
                  <td className="px-2 py-3 align-top">
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

                  {/* INICIO Y FIN (AQUÍ SE MUESTRA LA FECHA DE FINALIZACIÓN) */}
                  <td className="px-2 py-3 text-center align-top">
                    {lead.estado === "Inscrito" ? (
                      <div className="flex flex-col items-center gap-1.5">
                        <ElegantDatePicker
                          type="date"
                          colorClass="indigo"
                          value={lead.inicioClase}
                          onChange={(v) =>
                            onUpdateLead(lead.id, "inicioClase", v)
                          }
                        />
                        {lead.status === "finalizado" && lead.fechaFinClase && (
                          <span
                            className="text-[7px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shadow-sm border border-emerald-100 flex items-center gap-1"
                            title="Fecha de Finalización"
                          >
                            <span>✓</span>{" "}
                            {new Date(lead.fechaFinClase).toLocaleDateString(
                              "es-ES",
                              { day: "2-digit", month: "short" },
                            )}
                          </span>
                        )}
                      </div>
                    ) : (
                      "---"
                    )}
                  </td>

                  {/* USER */}
                  <td className="px-2 py-3 text-center align-top">
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

                  {/* ASISTENCIA */}
                  <td className="px-2 py-3 text-center align-top">
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

                  {/* REGALO */}
                  <td className="px-2 py-3 text-center align-top">
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

                  {/* OBSERVACIONES */}
                  <td className="px-2 py-3 text-center align-top">
                    {lead.comentarios ? (
                      <button
                        onClick={() =>
                          onViewComment(lead.comentarios, lead.nombre)
                        }
                        className="bg-indigo-50 text-indigo-600 p-2 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-sm active:scale-95"
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

                  {/* ESTATUS CONDICIONAL (AHORA INTERCEPTA EL FINALIZADO) */}
                  <td className="px-2 py-3 text-center align-top">
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
                          { value: "pendiente", label: "Pendiente" },
                          { value: "finalizado", label: "Fin" },
                          { value: "abandonado", label: "Aband" },
                          { value: "no apto", label: "No Apto" },
                        ]}
                        onChange={(v) => {
                          if (v === "finalizado") {
                            onFinalize(lead); // ABRE MODAL
                          } else {
                            onUpdateLead(lead.id, "status", v); // ACTUALIZA DIRECTO
                          }
                        }}
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
                          if (v === "pendiente")
                            badgeClass =
                              "bg-slate-500 text-white border-slate-600";
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

                  {/* ACCIONES */}
                  <td className="px-4 py-3 text-right align-top">
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
