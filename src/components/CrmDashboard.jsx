import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import LeadTable from "./leads/LeadTable";
import KanbanView from "./leads/KanbanView";
import AgendaView from "./agenda/AgendaView";
import ReportsView from "./reports/ReportsView";
import LeadFormModal from "./leads/LeadFormModal";
import FollowUpModal from "./leads/FollowUpModal";
import { db } from "../firebase";
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
  const [leadsCLM, setLeadsCLM] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("kanban");
  const [projectFilter, setProjectFilter] = useState("todos");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [leadToFollow, setLeadToFollow] = useState(null);
  const [commentModal, setCommentModal] = useState({
    open: false,
    text: "",
    author: "",
  });
  const [manageModal, setManageModal] = useState({ open: false, lead: null });
  const [finalizeModal, setFinalizeModal] = useState({
    open: false,
    lead: null,
    fechaInicio: "",
    fechaFin: "",
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
          status: "pendiente",
          doc1: false,
          doc2: false,
          regalo: false,
          respondioWpp: false,
          fechaCreacion: new Date().toISOString(),
        });
        notify(`Registrado en ${data.proyecto}`);
      }
      setIsModalOpen(false);
      setLeadToEdit(null);
    } catch (e) {
      notify("Error de guardado", "error");
    }
  };

  const filteredLeads = leadsCLM
    .filter((l) => {
      const b = searchTerm.toLowerCase();
      const matchText =
        l.nombre?.toLowerCase().includes(b) || l.whatsapp?.includes(searchTerm);
      const proj = l.proyecto || "CLM";
      return matchText && (projectFilter === "todos" || proj === projectFilter);
    })
    .sort(
      (a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0),
    );

  const containerStyle =
    "bg-slate-200/40 backdrop-blur-sm p-1 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-inner";
  const btnBase =
    "px-5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300";

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans overflow-hidden text-slate-900">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
        *::-webkit-scrollbar { display: none !important; }
        .board-container:hover { scrollbar-width: thin !important; }
        .board-container:hover::-webkit-scrollbar { display: block !important; height: 6px !important; }
        .board-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `,
        }}
      />

      {toast.show && (
        <div className="fixed bottom-10 right-10 z-[700] px-6 py-3 rounded-full shadow-2xl bg-slate-800 text-white animate-in fade-in">
          <span className="text-[10px] font-black uppercase tracking-widest">
            {toast.message}
          </span>
        </div>
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB] h-full overflow-hidden">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex-1 overflow-hidden p-4 lg:p-6 flex flex-col">
          {activeTab === "clientes-clm" && (
            <div className="max-w-full mx-auto space-y-4 h-full flex flex-col w-full">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-2 shrink-0">
                <div className="space-y-0.5">
                  <h1 className="text-2xl font-black text-slate-800 uppercase italic">
                    Control Jeff
                  </h1>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                    Panel Estratégico Multicampaña
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end lg:self-auto scale-90 lg:scale-100 origin-right">
                  <div className={containerStyle}>
                    {/* AQUI SE AGREGÓ MASDIGITAL */}
                    {["todos", "CLM", "Lideres", "Sandetel", "MasDigital"].map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setProjectFilter(p)}
                          className={`${btnBase} ${projectFilter === p ? (p === "todos" ? "bg-slate-800 text-white" : p === "CLM" ? "bg-indigo-600 text-white" : p === "Lideres" ? "bg-amber-500 text-white" : p === "Sandetel" ? "bg-cyan-500 text-white" : "bg-fuchsia-500 text-white") : "text-slate-400"}`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  </div>
                  <div className="h-6 w-px bg-slate-200 mx-1"></div>
                  <div className={containerStyle}>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`${btnBase} ${viewMode === "table" ? "bg-white text-indigo-600 shadow-md" : "text-slate-400"}`}
                    >
                      Tabla
                    </button>
                    <button
                      onClick={() => setViewMode("kanban")}
                      className={`${btnBase} ${viewMode === "kanban" ? "bg-white text-indigo-600 shadow-md" : "text-slate-400"}`}
                    >
                      Tablero
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setLeadToEdit(null);
                      setIsModalOpen(true);
                    }}
                    className="bg-[#4F46E5] text-white px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase shadow-xl"
                  >
                    + Nuevo
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0 h-full board-container overflow-x-auto overflow-y-auto">
                {viewMode === "table" ? (
                  <LeadTable
                    leads={filteredLeads}
                    onUpdateLead={(id, c, v) =>
                      updateDoc(doc(db, "leads", id), { [c]: v })
                    }
                    onEditLead={(l) => {
                      setLeadToEdit(l);
                      setIsModalOpen(true);
                    }}
                    onFollowUp={(l) => {
                      setLeadToFollow(l);
                      setIsFollowUpOpen(true);
                    }}
                    onDeleteLead={(id) =>
                      window.confirm("¿Eliminar?") &&
                      deleteDoc(doc(db, "leads", id))
                    }
                    onFinalize={(l) =>
                      setFinalizeModal({
                        open: true,
                        lead: l,
                        fechaInicio: "",
                        fechaFin: "",
                      })
                    }
                    onViewComment={(text, author) =>
                      setCommentModal({ open: true, text, author })
                    }
                    onManageLead={(l) =>
                      setManageModal({ open: true, lead: l })
                    }
                  />
                ) : (
                  <KanbanView
                    leads={filteredLeads}
                    onUpdateLead={(id, c, v) =>
                      updateDoc(doc(db, "leads", id), { [c]: v })
                    }
                    onEditLead={(l) => {
                      setLeadToEdit(l);
                      setIsModalOpen(true);
                    }}
                    onFollowUp={(l) => {
                      setLeadToFollow(l);
                      setIsFollowUpOpen(true);
                    }}
                    onFinalize={(l) =>
                      setFinalizeModal({
                        open: true,
                        lead: l,
                        fechaInicio: "",
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
              onUpdateLead={(id, c, v) =>
                updateDoc(doc(db, "leads", id), { [c]: v })
              }
              onEditLead={(l) => {
                setLeadToEdit(l);
                setIsModalOpen(true);
              }}
            />
          )}
          {activeTab === "reportes-clm" && <ReportsView leads={leadsCLM} />}
        </div>
      </main>

      {/* --- ZONA DE MODALES --- */}

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
            if (f >= 3) s = "no apto";
            await updateDoc(doc(db, "leads", u.id), {
              ...u,
              faltas: f.toString(),
              status: s,
            });
            setIsFollowUpOpen(false);
          }}
          lead={leadToFollow}
        />
      )}

      {commentModal.open && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() =>
                setCommentModal({ open: false, text: "", author: "" })
              }
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-colors"
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
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">
              Observaciones
            </h3>
            <p className="text-[10px] text-indigo-500 font-bold uppercase mb-6">
              {commentModal.author}
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {commentModal.text}
            </div>
          </div>
        </div>
      )}

      {manageModal.open && manageModal.lead && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-[420px] rounded-[2rem] p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500"></div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">
                  Panel Alumno
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 truncate max-w-[250px]">
                  {manageModal.lead.nombre}
                </p>
              </div>
              <button
                onClick={() => setManageModal({ open: false, lead: null })}
                className="text-slate-300 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-colors"
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

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateDoc(doc(db, "leads", manageModal.lead.id), {
                  fechaInicioClase: manageModal.lead.fechaInicioClase || "",
                  fechaFinClase: manageModal.lead.fechaFinClase || "",
                  doc1: manageModal.lead.doc1 || false,
                  doc2: manageModal.lead.doc2 || false,
                  regalo: manageModal.lead.regalo || false,
                });
                notify("Panel Alumno actualizado");
                setManageModal({ open: false, lead: null });
              }}
              className="space-y-6"
            >
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Inicio de Curso
                  </label>
                  <input
                    type="date"
                    value={manageModal.lead.fechaInicioClase || ""}
                    onChange={(e) =>
                      setManageModal({
                        ...manageModal,
                        lead: {
                          ...manageModal.lead,
                          fechaInicioClase: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 uppercase"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Fin de Curso
                  </label>
                  <input
                    type="date"
                    value={manageModal.lead.fechaFinClase || ""}
                    onChange={(e) =>
                      setManageModal({
                        ...manageModal,
                        lead: {
                          ...manageModal.lead,
                          fechaFinClase: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-3 border-t border-slate-50">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Documentación
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setManageModal({
                          ...manageModal,
                          lead: {
                            ...manageModal.lead,
                            doc1: !manageModal.lead.doc1,
                          },
                        })
                      }
                      className={`flex-1 py-2 rounded-lg border text-[9px] font-black uppercase transition-all shadow-sm active:scale-95 ${manageModal.lead.doc1 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"}`}
                    >
                      {manageModal.lead.situacion === "Autonomo"
                        ? "RECIBO"
                        : "NÓMINA"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setManageModal({
                          ...manageModal,
                          lead: {
                            ...manageModal.lead,
                            doc2: !manageModal.lead.doc2,
                          },
                        })
                      }
                      className={`flex-1 py-2 rounded-lg border text-[9px] font-black uppercase transition-all shadow-sm active:scale-95 ${manageModal.lead.doc2 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"}`}
                    >
                      {manageModal.lead.situacion === "Autonomo"
                        ? "IAE"
                        : "CONTRATO"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Entregables
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setManageModal({
                        ...manageModal,
                        lead: {
                          ...manageModal.lead,
                          regalo: !manageModal.lead.regalo,
                        },
                      })
                    }
                    className={`w-full py-2 rounded-lg border text-[9px] font-black uppercase transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 ${manageModal.lead.regalo ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"}`}
                  >
                    {manageModal.lead.regalo ? "🎁 Entregado" : "🎁 Pendiente"}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-slate-800 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 transition-all hover:bg-slate-700"
                >
                  Guardar Información
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {finalizeModal.open && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-slate-100">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest text-center mb-6">
              Finalizar para Pago
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveLead({
                  ...finalizeModal.lead,
                  estado: "Inscrito",
                  status: "finalizado",
                  fechaInicioClase: finalizeModal.fechaInicio,
                  fechaFinClase: finalizeModal.fechaFin,
                });
                setFinalizeModal({ open: false });
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
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
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-emerald-500 uppercase ml-1">
                  Fecha de Término
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
                  className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setFinalizeModal({ open: false })}
                  className="flex-1 py-3 text-[10px] font-black text-slate-400 uppercase hover:text-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-emerald-500 text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                >
                  Comisionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
