import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import LeadTable from "./leads/LeadTable";
import KanbanView from "./leads/KanbanView";
import AgendaView from "./agenda/AgendaView";
import ReportsView from "./reports/ReportsView";
import LeadFormModal from "./leads/LeadFormModal";
import FollowUpModal from "./leads/FollowUpModal";
import { db } from "../firebase.js";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function CrmDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("clientes-clm");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [leadsCLM, setLeadsCLM] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [leadToFollow, setLeadToFollow] = useState(null);

  const [viewMode, setViewMode] = useState("table");
  const [tableFilter, setTableFilter] = useState("todos");

  const [finalizeModal, setFinalizeModal] = useState({
    open: false,
    lead: null,
    fechaInicio: "",
    fechaFin: "",
  });
  const [manageModalLeadId, setManageModalLeadId] = useState(null);
  const [viewComment, setViewComment] = useState({
    open: false,
    text: "",
    client: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "leads"), (snapshot) => {
      setLeadsCLM(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const notify = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3500,
    );
  };

  const handleUpdateLead = async (id, campo, valor) => {
    try {
      await updateDoc(doc(db, "leads", id), { [campo]: valor });
      if (
        campo !== "respondioWpp" &&
        campo !== "doc1" &&
        campo !== "doc2" &&
        campo !== "tieneUsuarios" &&
        campo !== "regalo"
      ) {
        notify("Dato actualizado");
      }
    } catch (e) {
      notify("Error de red", "error");
    }
  };

  const handleFinalizeSave = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "leads", finalizeModal.lead.id), {
        status: "finalizado",
        inicioClase: finalizeModal.fechaInicio,
        fechaFinClase: finalizeModal.fechaFin,
      });
      notify("✅ Lead finalizado con éxito");
      setFinalizeModal({
        open: false,
        lead: null,
        fechaInicio: "",
        fechaFin: "",
      });
    } catch (error) {
      notify("Error al finalizar", "error");
    }
  };

  const handleSaveLead = async (data) => {
    try {
      if (data.id) {
        const { id, ...cleanData } = data;
        await updateDoc(doc(db, "leads", id), cleanData);
        notify("Perfil actualizado");
      } else {
        await addDoc(collection(db, "leads"), {
          ...data,
          asistencia: Array(20).fill(true),
          faltas: "0",
          status: "en curso",
          regalo: "no",
          tieneUsuarios: false,
          agendaStatus: "pendiente",
          comentarios: data.comentarios || "",
          temperatura: data.temperatura || "Tibio",
          respondioWpp: false,
          fechaCreacion: new Date().toISOString(),
        });
        notify("Nuevo lead registrado");
      }
      setIsModalOpen(false);
      setLeadToEdit(null);
    } catch (e) {
      notify("Error al guardar", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este lead?")) {
      try {
        await deleteDoc(doc(db, "leads", id));
        notify("Lead eliminado", "error");
      } catch (e) {
        notify("No se pudo eliminar", "error");
      }
    }
  };

  const filteredLeads = leadsCLM
    .filter((l) => {
      const b = searchTerm.toLowerCase();
      const matchText =
        l.nombre?.toLowerCase().includes(b) ||
        l.whatsapp?.includes(searchTerm) ||
        l.quienRefirio?.toLowerCase().includes(b);
      if (!matchText) return false;

      if (viewMode === "kanban" || tableFilter === "todos") return true;
      if (tableFilter === "agendados") return l.estado === "Agendado";
      if (tableFilter === "interesados") return l.estado === "Interesado";
      if (tableFilter === "registrados") return l.estado === "Registrado";
      if (tableFilter === "matriculados")
        return l.estado === "Inscrito" && l.status === "pendiente";
      if (tableFilter === "curso")
        return l.estado === "Inscrito" && l.status === "en curso";
      if (tableFilter === "finalizados")
        return l.estado === "Inscrito" && l.status === "finalizado";
      if (tableFilter === "perdidos")
        return (
          l.estado === "No Interesado" ||
          (l.estado === "Inscrito" &&
            (l.status === "no apto" || l.status === "abandonado"))
        );

      return true;
    })
    .sort((a, b) => {
      const dateA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
      const dateB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
      return dateB - dateA;
    });

  const countAgendados = leadsCLM.filter((l) => l.estado === "Agendado").length;
  const countInteresados = leadsCLM.filter(
    (l) => l.estado === "Interesado",
  ).length;
  const countRegistrados = leadsCLM.filter(
    (l) => l.estado === "Registrado",
  ).length;
  const countMatriculados = leadsCLM.filter(
    (l) => l.estado === "Inscrito" && l.status === "pendiente",
  ).length;
  const countCurso = leadsCLM.filter(
    (l) => l.estado === "Inscrito" && l.status === "en curso",
  ).length;
  const countFinalizados = leadsCLM.filter(
    (l) => l.estado === "Inscrito" && l.status === "finalizado",
  ).length;
  const countPerdidos = leadsCLM.filter(
    (l) =>
      l.estado === "No Interesado" ||
      (l.estado === "Inscrito" &&
        (l.status === "no apto" || l.status === "abandonado")),
  ).length;

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans overflow-hidden relative">
      {toast.show && (
        <div className="fixed bottom-10 right-10 z-[300] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border backdrop-blur-xl ${toast.type === "success" ? "bg-emerald-500/90 border-emerald-400" : "bg-rose-500/90 border-rose-400"}`}
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              {toast.message}
            </span>
          </div>
        </div>
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB]">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          {activeTab === "clientes-clm" && (
            <div className="max-w-[1600px] mx-auto space-y-4 flex flex-col h-full">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h1 className="text-xl font-black text-slate-800 uppercase tracking-widest italic">
                    CLM Turismo
                  </h1>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    Directorio de Gestión Operativa
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-slate-200/50 p-1 rounded-xl flex items-center border border-slate-200">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === "table" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      Tabla
                    </button>
                    <button
                      onClick={() => setViewMode("kanban")}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === "kanban" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      Tablero
                    </button>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#4F46E5] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                  >
                    + Nuevo Lead
                  </button>
                </div>
              </div>

              {viewMode === "table" && (
                <div className="flex items-center gap-2 px-2 mt-2 overflow-x-auto custom-scrollbar pb-1">
                  <button
                    onClick={() => setTableFilter("todos")}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tableFilter === "todos" ? "bg-slate-800 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
                  >
                    📋 Todos{" "}
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[8px] ${tableFilter === "todos" ? "bg-slate-600" : "bg-slate-100"}`}
                    >
                      {leadsCLM.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setTableFilter("agendados")}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tableFilter === "agendados" ? "bg-slate-500 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
                  >
                    📞 Agendados{" "}
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[8px] ${tableFilter === "agendados" ? "bg-slate-400" : "bg-slate-100"}`}
                    >
                      {countAgendados}
                    </span>
                  </button>
                  <button
                    onClick={() => setTableFilter("interesados")}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tableFilter === "interesados" ? "bg-blue-500 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-blue-50"}`}
                  >
                    📝 Interesados{" "}
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[8px] ${tableFilter === "interesados" ? "bg-blue-400" : "bg-slate-100"}`}
                    >
                      {countInteresados}
                    </span>
                  </button>
                  <button
                    onClick={() => setTableFilter("registrados")}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tableFilter === "registrados" ? "bg-purple-500 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-purple-50"}`}
                  >
                    🪪 Registrados{" "}
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[8px] ${tableFilter === "registrados" ? "bg-purple-400" : "bg-slate-100"}`}
                    >
                      {countRegistrados}
                    </span>
                  </button>
                  <button
                    onClick={() => setTableFilter("matriculados")}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tableFilter === "matriculados" ? "bg-amber-500 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-amber-50"}`}
                  >
                    ⏳ Matriculados{" "}
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[8px] ${tableFilter === "matriculados" ? "bg-amber-400" : "bg-slate-100"}`}
                    >
                      {countMatriculados}
                    </span>
                  </button>
                  <button
                    onClick={() => setTableFilter("curso")}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tableFilter === "curso" ? "bg-indigo-500 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-indigo-50"}`}
                  >
                    📚 En Curso{" "}
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[8px] ${tableFilter === "curso" ? "bg-indigo-400" : "bg-slate-100"}`}
                    >
                      {countCurso}
                    </span>
                  </button>
                  <button
                    onClick={() => setTableFilter("finalizados")}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tableFilter === "finalizados" ? "bg-emerald-500 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-emerald-50"}`}
                  >
                    🏆 Finalizados{" "}
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[8px] ${tableFilter === "finalizados" ? "bg-emerald-400" : "bg-slate-100"}`}
                    >
                      {countFinalizados}
                    </span>
                  </button>
                  <button
                    onClick={() => setTableFilter("perdidos")}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tableFilter === "perdidos" ? "bg-rose-500 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:bg-rose-50"}`}
                  >
                    🛑 Bajas{" "}
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[8px] ${tableFilter === "perdidos" ? "bg-rose-400" : "bg-slate-100"}`}
                    >
                      {countPerdidos}
                    </span>
                  </button>
                </div>
              )}

              <div className="flex-1 min-h-0 pt-1">
                {viewMode === "table" ? (
                  <LeadTable
                    leads={filteredLeads}
                    onUpdateLead={handleUpdateLead}
                    onEditLead={(l) => {
                      setLeadToEdit(l);
                      setIsModalOpen(true);
                    }}
                    onFollowUp={(l) => {
                      setLeadToFollow(l);
                      setIsFollowUpOpen(true);
                    }}
                    onDeleteLead={handleDelete}
                    onViewComment={(text, client) =>
                      setViewComment({ open: true, text, client })
                    }
                    onFinalize={(lead) =>
                      setFinalizeModal({
                        open: true,
                        lead,
                        fechaInicio: lead.inicioClase || "",
                        fechaFin: "",
                      })
                    }
                    onManageLead={(lead) => setManageModalLeadId(lead.id)}
                  />
                ) : (
                  <KanbanView
                    leads={filteredLeads}
                    onUpdateLead={handleUpdateLead}
                    onEditLead={(l) => {
                      setLeadToEdit(l);
                      setIsModalOpen(true);
                    }}
                    onFollowUp={(l) => {
                      setLeadToFollow(l);
                      setIsFollowUpOpen(true);
                    }}
                    onFinalize={(lead) =>
                      setFinalizeModal({
                        open: true,
                        lead,
                        fechaInicio: lead.inicioClase || "",
                        fechaFin: "",
                      })
                    }
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "agenda-clm" && (
            <AgendaView
              leads={leadsCLM}
              onUpdateLead={handleUpdateLead}
              onEditLead={(l) => {
                setLeadToEdit(l);
                setIsModalOpen(true);
              }}
              titulo="Agenda de Seguimiento"
            />
          )}
          {activeTab === "reportes-clm" && <ReportsView leads={leadsCLM} />}
        </div>
      </main>

      {manageModalLeadId &&
        (() => {
          const activeLead = leadsCLM.find((l) => l.id === manageModalLeadId);
          if (!activeLead) return null;
          return (
            <div
              className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setManageModalLeadId(null)}
            >
              <div
                className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 pb-4 flex justify-between items-center border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-inner">
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
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 tracking-tight">
                        Panel Alumno
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {activeLead.nombre}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setManageModalLeadId(null)}
                    className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-colors"
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
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-4 bg-slate-50/50">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/60">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <svg
                        className="w-3 h-3 text-slate-300"
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
                      </svg>{" "}
                      Fechas del Curso
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 uppercase">
                          Inicio
                        </label>
                        <input
                          type="date"
                          value={activeLead.inicioClase || ""}
                          onChange={(e) =>
                            handleUpdateLead(
                              activeLead.id,
                              "inicioClase",
                              e.target.value,
                            )
                          }
                          className="w-full mt-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-indigo-600 outline-none hover:bg-slate-100 focus:bg-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-slate-400 uppercase">
                          Finalización
                        </label>
                        <input
                          type="date"
                          value={activeLead.fechaFinClase || ""}
                          onChange={(e) =>
                            handleUpdateLead(
                              activeLead.id,
                              "fechaFinClase",
                              e.target.value,
                            )
                          }
                          className="w-full mt-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-emerald-600 outline-none hover:bg-slate-100 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/60">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <svg
                        className="w-3 h-3 text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>{" "}
                      Documentación
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdateLead(
                            activeLead.id,
                            "doc1",
                            !activeLead.doc1,
                          )
                        }
                        className={`flex-1 py-2 rounded-xl border text-[10px] font-black transition-all flex justify-center items-center gap-1.5 active:scale-95 ${activeLead.doc1 ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}
                      >
                        <div
                          className={`w-3 h-3 rounded-[3px] flex items-center justify-center border transition-colors ${activeLead.doc1 ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300"}`}
                        >
                          {activeLead.doc1 && (
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
                        {activeLead.situacion === "Autonomo" ? "REC" : "NOM"}
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateLead(
                            activeLead.id,
                            "doc2",
                            !activeLead.doc2,
                          )
                        }
                        className={`flex-1 py-2 rounded-xl border text-[10px] font-black transition-all flex justify-center items-center gap-1.5 active:scale-95 ${activeLead.doc2 ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}
                      >
                        <div
                          className={`w-3 h-3 rounded-[3px] flex items-center justify-center border transition-colors ${activeLead.doc2 ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300"}`}
                        >
                          {activeLead.doc2 && (
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
                        {activeLead.situacion === "Autonomo" ? "IAE" : "CON"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100/60">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <svg
                        className="w-3 h-3 text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>{" "}
                      Entregables
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdateLead(
                            activeLead.id,
                            "tieneUsuarios",
                            !activeLead.tieneUsuarios,
                          )
                        }
                        className={`flex-1 py-2 rounded-xl border text-[10px] font-black transition-all flex justify-center items-center gap-1.5 active:scale-95 ${activeLead.tieneUsuarios ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}
                      >
                        <div
                          className={`w-3 h-3 rounded-[3px] flex items-center justify-center border transition-colors ${activeLead.tieneUsuarios ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300"}`}
                        >
                          {activeLead.tieneUsuarios && (
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
                        ACCESOS
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateLead(
                            activeLead.id,
                            "regalo",
                            activeLead.regalo === "si" ? "no" : "si",
                          )
                        }
                        className={`flex-1 py-2 rounded-xl border text-[10px] font-black transition-all flex justify-center items-center gap-1.5 active:scale-95 ${activeLead.regalo === "si" ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}
                      >
                        <div
                          className={`w-3 h-3 rounded-[3px] flex items-center justify-center border transition-colors ${activeLead.regalo === "si" ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300"}`}
                        >
                          {activeLead.regalo === "si" && (
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
                        REGALO
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white border-t border-slate-100">
                  <button
                    onClick={() => setManageModalLeadId(null)}
                    className="w-full bg-[#4F46E5] text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    Guardar y Cerrar
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {finalizeModal.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-6 border border-slate-100">
            <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-widest mb-1 text-center">
              Registrar Finalización
            </h3>
            <p className="text-[10px] text-slate-400 font-bold text-center mb-6 uppercase">
              Lead:{" "}
              <span className="text-indigo-500">
                {finalizeModal.lead.nombre}
              </span>
            </p>
            <form onSubmit={handleFinalizeSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Fecha de Inicio
                </label>
                <input
                  required
                  type="date"
                  value={finalizeModal.fechaInicio}
                  onChange={(e) =>
                    setFinalizeModal({
                      ...finalizeModal,
                      fechaInicio: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-[12px] font-bold outline-none text-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest ml-1">
                  Fecha de Finalización
                </label>
                <input
                  required
                  type="date"
                  value={finalizeModal.fechaFin}
                  onChange={(e) =>
                    setFinalizeModal({
                      ...finalizeModal,
                      fechaFin: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-emerald-50 border-none rounded-xl text-[12px] font-bold outline-none focus:ring-2 focus:ring-emerald-200 text-emerald-700"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setFinalizeModal({
                      open: false,
                      lead: null,
                      fechaInicio: "",
                      fechaFin: "",
                    })
                  }
                  className="flex-1 px-4 py-3 text-[10px] font-black uppercase text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-emerald-500 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Guardar y Comisionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <LeadFormModal
          leads={leadsCLM}
          onClose={() => {
            setIsModalOpen(false);
            setLeadToEdit(null);
          }}
          onSave={handleSaveLead}
          leadToEdit={leadToEdit}
        />
      )}

      {isFollowUpOpen && (
        <FollowUpModal
          onClose={() => setIsFollowUpOpen(false)}
          onSave={async (u) => {
            const f = 20 - (u.asistencia || []).filter((d) => d).length;
            let s = u.status || "en curso";
            if (f >= 3 && s !== "abandonado" && s !== "finalizado")
              s = "no apto";
            else if (f < 3 && s === "no apto") s = "en curso";
            await updateDoc(doc(db, "leads", u.id), {
              ...u,
              faltas: f.toString(),
              status: s,
            });
            if (f >= 3) notify("⚠️ NO APTO Automático", "error");
            else notify("Asistencia guardada");
            setIsFollowUpOpen(false);
          }}
          lead={leadToFollow}
        />
      )}

      {viewComment.open && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setViewComment({ ...viewComment, open: false })}
        >
          <div
            className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Notas: {viewComment.client}
            </h3>
            <div className="bg-slate-50 p-6 rounded-2xl text-sm text-slate-600 font-medium leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
              {viewComment.text}
            </div>
            <button
              onClick={() => setViewComment({ ...viewComment, open: false })}
              className="w-full mt-6 bg-indigo-50 text-indigo-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 active:scale-95 transition-all"
            >
              Cerrar Nota
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
