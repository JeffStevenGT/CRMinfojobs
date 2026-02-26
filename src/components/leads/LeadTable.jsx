import React, { useState, useRef } from "react";

// --- SUB-COMPONENTES (Más compactos) ---
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
      className={`relative flex items-center justify-center w-full px-2 py-1 rounded-lg border text-[9px] font-black uppercase transition-all cursor-pointer select-none bg-white shadow-sm hover:shadow ${colorClass === "sky" ? "text-sky-600 border-sky-100 hover:border-sky-300" : "text-indigo-600 border-indigo-100 hover:border-indigo-300"}`}
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
      className={`cursor-pointer transition-transform active:scale-95 flex justify-center w-full`}
    >
      {renderBadge(value)}
    </div>
    <div
      className={`absolute z-[100] overflow-hidden transition-all duration-300 ${compact ? "min-w-[100px] left-0" : "w-full min-w-[120px]"} top-full ${isOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"}`}
    >
      <div className="flex flex-col gap-0.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xl">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              onToggle();
            }}
            className={`px-2 py-1 text-[9px] font-bold rounded-lg text-center w-full transition-colors ${value === opt.value ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
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
  onManageLead,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleCopy = (id, text, type) => {
    const val = type === "tel" ? "+34" + text.replace(/\s+/g, "") : text;
    navigator.clipboard.writeText(val);
    setCopiedId(id + type);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // ESTILO BASE DE LA CÁPSULA
  const capsuleStyle =
    "bg-white/60 backdrop-blur-sm hover:bg-white/95 transition-all duration-300 rounded-xl px-2.5 py-1.5 border border-white/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full w-full relative justify-center";

  return (
    <div
      className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden"
      onClick={() => setOpenDropdownId(null)}
    >
      <div className="overflow-x-auto custom-scrollbar pb-32 p-2">
        <table className="min-w-full text-left border-separate border-spacing-y-1.5">
          <thead className="bg-transparent">
            <tr className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">
              <th className="px-2 py-1.5 text-left">Cliente</th>
              <th className="px-2 py-1.5 text-left">Contacto</th>
              <th className="px-2 py-1.5">Estado</th>
              <th className="px-2 py-1.5">Estatus</th>
              <th className="px-2 py-1.5 text-indigo-500">Flujo Operativo</th>
              <th className="px-2 py-1.5">Obs.</th>
              <th className="px-2 py-1.5">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const asistencias = (lead.asistencia || []).filter(
                (d) => d,
              ).length;
              const nFaltas = 20 - asistencias;
              const isReferido = lead.esReferido === "si";

              // === LÓGICA DE CAPAS (Z-INDEX) ===
              // Verifica si ESTE lead en particular tiene algún menú abierto
              const isRowActive =
                openDropdownId && openDropdownId.startsWith(lead.id);

              let rowColorClass = "bg-slate-50/30";
              let borderColor = "border-l-transparent";
              if (lead.estado === "Inscrito") {
                if (lead.status === "no apto") {
                  rowColorClass = "bg-rose-50/40";
                  borderColor = "border-l-rose-500";
                } else if (lead.status === "finalizado") {
                  rowColorClass = "bg-emerald-50/40";
                  borderColor = "border-l-emerald-500";
                } else if (lead.status === "en curso") {
                  rowColorClass = "bg-blue-50/40";
                  borderColor = "border-l-blue-500";
                } else if (lead.status === "abandonado") {
                  rowColorClass = "bg-orange-50/40";
                  borderColor = "border-l-orange-500";
                } else if (lead.status === "pendiente") {
                  rowColorClass = "bg-amber-50/30";
                  borderColor = "border-l-amber-400";
                }
              }

              return (
                // Añadimos relative y z-50 solo a la fila activa para que resalte sobre las de abajo
                <tr
                  key={lead.id}
                  className={`group border-l-4 rounded-xl ${rowColorClass} ${borderColor} relative ${isRowActive ? "z-50" : "z-0"}`}
                >
                  {/* CÁPSULA 1: CLIENTE */}
                  <td className="p-0.5 align-top min-w-[200px]">
                    <div
                      className={`${capsuleStyle} justify-start items-start ${isRowActive ? "z-50" : "z-0"}`}
                    >
                      {lead.fechaCreacion && (
                        <div className="text-[6px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-100">
                          <svg
                            className="w-2.5 h-2.5 text-indigo-400"
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

                      <div className="font-black text-slate-800 text-[11px] flex items-center gap-1.5 flex-wrap uppercase mt-1 w-full leading-tight">
                        <span className="truncate">{lead.nombre}</span>
                        {isReferido && (
                          <span className="text-[6.5px] bg-indigo-500 text-white px-1 py-0.5 rounded shadow-sm">
                            REF
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[7.5px] text-slate-500 font-bold uppercase tracking-wide w-full mt-0.5">
                        <span className="bg-slate-100/80 px-1.5 py-0.5 rounded border border-slate-200">
                          {lead.provincia || "S/P"}
                        </span>
                        <span className="text-slate-300">•</span>
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
                          onChange={(v) =>
                            onUpdateLead(lead.id, "situacion", v)
                          }
                          renderBadge={(v) => (
                            <span className="bg-slate-100/80 px-1.5 py-0.5 rounded border border-slate-200 cursor-pointer hover:text-indigo-600 hover:border-indigo-300 transition-colors">
                              {v === "Desempleado" ? "NULL" : v}
                            </span>
                          )}
                        />
                      </div>

                      {isReferido && lead.quienRefirio && (
                        <div className="text-[7px] text-indigo-500 font-bold mt-1 w-full truncate leading-none">
                          Rec: {lead.quienRefirio}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* CÁPSULA 2: CONTACTO */}
                  <td className="p-0.5 align-top min-w-[140px]">
                    <div
                      className={`${capsuleStyle} justify-center items-start gap-1.5 ${isRowActive ? "z-50" : "z-0"}`}
                    >
                      <div className="flex items-center gap-1.5 w-full">
                        <div
                          className="flex items-center gap-1 group cursor-pointer font-black text-slate-700 text-[9.5px] bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm flex-1 hover:border-emerald-200 transition-colors"
                          onClick={() =>
                            handleCopy(lead.id, lead.whatsapp, "tel")
                          }
                          title="Copiar teléfono"
                        >
                          <span>+34 {lead.whatsapp}</span>
                          <svg
                            className={`w-3 h-3 ml-auto transition-transform ${copiedId === lead.id + "tel" ? "text-emerald-500 drop-shadow-sm scale-110" : "text-slate-300 group-hover:text-slate-500"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
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
                          className={`p-1.5 rounded-lg border shadow-sm transition-all active:scale-95 ${lead.respondioWpp ? "bg-emerald-50 border-emerald-200 text-emerald-500" : "bg-white border-slate-100 text-slate-300 hover:text-emerald-400 hover:border-emerald-100"}`}
                          title={
                            lead.respondioWpp
                              ? "Respondió WhatsApp"
                              : "No respondió"
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
                        className={`flex items-center w-full gap-1 px-2 py-1 bg-white rounded-lg border border-slate-100 shadow-sm ${lead.email ? "group cursor-pointer hover:border-sky-200 transition-colors" : ""}`}
                        onClick={() =>
                          lead.email && handleCopy(lead.id, lead.email, "mail")
                        }
                        title="Copiar email"
                      >
                        <span
                          className={`text-[8px] font-bold truncate flex-1 ${lead.email ? "text-slate-500" : "text-slate-300 italic"}`}
                        >
                          {lead.email || "Sin correo"}
                        </span>
                        {lead.email && (
                          <svg
                            className={`w-3 h-3 transition-transform ${copiedId === lead.id + "mail" ? "text-emerald-500 drop-shadow-sm scale-110" : "text-slate-300 group-hover:text-slate-500"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* CÁPSULA 3: ESTADO */}
                  <td className="p-0.5 align-top w-[120px]">
                    <div
                      className={`${capsuleStyle} justify-center items-center gap-1.5 ${isRowActive ? "z-50" : "z-0"}`}
                    >
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
                          { value: "Inscrito", label: "Matriculado" },
                          { value: "No Interesado", label: "No Interesado" },
                        ]}
                        onChange={(v) => onUpdateLead(lead.id, "estado", v)}
                        renderBadge={(v) => {
                          const c =
                            v === "Inscrito"
                              ? "text-emerald-700 bg-emerald-100 border-emerald-200"
                              : v === "No Interesado"
                                ? "text-red-600 bg-red-50 border-red-200"
                                : v === "Interesado"
                                  ? "text-violet-700 bg-violet-50 border-violet-200"
                                  : "text-sky-700 bg-sky-50 border-sky-200";
                          const displayLabel =
                            v === "Inscrito"
                              ? "Matriculado"
                              : v === "No Interesado"
                                ? "No Interesado"
                                : v;
                          return (
                            <span
                              className={`px-2 py-1.5 w-full text-center rounded-lg text-[8px] font-black uppercase shadow-sm border ${c}`}
                            >
                              {displayLabel}
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
                              "text-amber-600 bg-amber-50 border-amber-200";
                            let icon = "☀️";
                            if (v === "Caliente") {
                              color =
                                "text-orange-600 bg-orange-50 border-orange-200";
                              icon = "🔥";
                            }
                            if (v === "Frío") {
                              color =
                                "text-blue-600 bg-blue-50 border-blue-200";
                              icon = "❄️";
                            }
                            return (
                              <span
                                className={`px-2 py-1 w-[80px] justify-center rounded-lg border text-[7.5px] font-black uppercase shadow-sm flex items-center gap-1 ${color}`}
                              >
                                <span>{icon}</span> {v}
                              </span>
                            );
                          }}
                        />
                      )}
                    </div>
                  </td>

                  {/* CÁPSULA 4: ESTATUS (SOLO INSCRITOS) */}
                  <td className="p-0.5 align-top w-[110px]">
                    <div
                      className={`${capsuleStyle} justify-center items-center ${isRowActive ? "z-50" : "z-0"}`}
                    >
                      {lead.estado === "Inscrito" ? (
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
                              onFinalize(lead);
                            } else {
                              onUpdateLead(lead.id, "status", v);
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
                                "bg-rose-600 text-white border-rose-700 animate-pulse shadow-rose-200";
                            if (v === "pendiente")
                              badgeClass =
                                "bg-slate-600 text-white border-slate-700";
                            return (
                              <span
                                className={`px-2 py-1.5 w-full text-center rounded-lg text-[8px] font-black uppercase shadow-sm border ${badgeClass}`}
                              >
                                {v}
                              </span>
                            );
                          }}
                        />
                      ) : (
                        <span className="text-slate-300 text-[8px] font-bold italic bg-white/50 px-2 py-1 rounded-lg border border-slate-100">
                          Sin Estatus
                        </span>
                      )}
                    </div>
                  </td>

                  {/* CÁPSULA 5: FLUJO OPERATIVO */}
                  <td className="p-0.5 align-top w-[130px]">
                    <div
                      className={`${capsuleStyle} justify-center items-center gap-1.5 ${isRowActive ? "z-50" : "z-0"}`}
                    >
                      {lead.estado === "Agendado" && (
                        <div className="flex flex-col items-center gap-1 w-full">
                          <span className="text-[6.5px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-0.5">
                            <svg
                              className="w-2 h-2 text-indigo-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Agendar Cita
                          </span>
                          <ElegantDatePicker
                            type="datetime-local"
                            value={lead.fechaLlamada}
                            onChange={(v) =>
                              onUpdateLead(lead.id, "fechaLlamada", v)
                            }
                          />
                        </div>
                      )}

                      {lead.estado === "Interesado" && (
                        <div className="flex flex-col items-center gap-1 w-full">
                          <span className="text-[6.5px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-0.5">
                            <svg
                              className="w-2 h-2 text-indigo-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Turno
                          </span>
                          <AccordionSelect
                            compact={true}
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
                            onChange={(v) =>
                              onUpdateLead(lead.id, "horario", v)
                            }
                            renderBadge={(v) => (
                              <span className="text-[8.5px] font-bold text-indigo-600 bg-white border border-indigo-100 px-3 py-1 w-full text-center rounded-lg uppercase shadow-sm cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                                {v || "Select"}
                              </span>
                            )}
                          />
                        </div>
                      )}

                      {lead.estado === "Inscrito" && (
                        <div className="flex flex-col gap-1.5 w-full">
                          <button
                            onClick={() => onManageLead(lead)}
                            className="group w-full bg-white text-slate-600 px-2 py-1.5 rounded-lg text-[8.5px] font-black tracking-widest uppercase border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95"
                          >
                            <svg
                              className="w-3 h-3 text-indigo-400 group-hover:rotate-90 transition-transform duration-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Panel Alumno
                          </button>
                          <button
                            onClick={() => onFollowUp(lead)}
                            className={`w-full py-1.5 rounded-lg border text-[8.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm hover:shadow ${nFaltas >= 3 ? "bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200 shadow-rose-200" : nFaltas > 0 ? "bg-amber-50 text-amber-600 border-amber-300" : "bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50"}`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full shadow-sm border border-white/50 ${nFaltas >= 3 ? "bg-white animate-pulse" : nFaltas > 0 ? "bg-amber-500" : "bg-emerald-400"}`}
                            ></div>
                            {nFaltas} Faltas
                          </button>
                        </div>
                      )}

                      {lead.estado === "No Interesado" && (
                        <span className="text-slate-300 text-[8.5px] font-bold uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-slate-100">
                          Cerrado
                        </span>
                      )}
                    </div>
                  </td>

                  {/* CÁPSULA 6: OBS */}
                  <td className="p-0.5 align-top w-[60px]">
                    <div
                      className={`${capsuleStyle} justify-center items-center ${isRowActive ? "z-50" : "z-0"}`}
                    >
                      {lead.comentarios ? (
                        <button
                          onClick={() =>
                            onViewComment(lead.comentarios, lead.nombre)
                          }
                          className="bg-indigo-50 text-indigo-600 p-2 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-200 shadow-sm active:scale-95 group"
                        >
                          <svg
                            className="w-4 h-4 group-hover:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                        </button>
                      ) : (
                        <span className="w-8 h-8 rounded-xl border-2 border-dashed border-slate-200 text-slate-200 flex items-center justify-center">
                          -
                        </span>
                      )}
                    </div>
                  </td>

                  {/* CÁPSULA 7: ACCIONES */}
                  <td className="p-0.5 align-top w-[80px]">
                    <div
                      className={`${capsuleStyle} flex-row justify-center items-center gap-1.5 ${isRowActive ? "z-50" : "z-0"}`}
                    >
                      <button
                        onClick={() => onEditLead(lead)}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm hover:shadow active:scale-95 transition-all"
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
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-rose-300 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 shadow-sm hover:shadow active:scale-95 transition-all"
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
