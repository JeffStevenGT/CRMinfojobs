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
  const [leadsCLM, setLeadsCLM] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("clientes-clm");
  const [viewMode, setViewMode] = useState("kanban");
  const [projectFilter, setProjectFilter] = useState("todos"); // FILTRO MAESTRO DE CAMPAÑA

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [leadToFollow, setLeadToFollow] = useState(null);
  const [manageModalLeadId, setManageModalLeadId] = useState(null);
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

  // --- FUNCIÓN DE PRUEBA: INYECTAR LEADS ---
  const injectTestLeads = async () => {
    try {
      const tests = [
        {
          nombre: "LEAD PRUEBA LIDERES",
          proyecto: "Lideres",
          estado: "Interesado",
          whatsapp: "111222333",
          situacion: "Trabajador",
          fechaCreacion: new Date().toISOString(),
        },
        {
          nombre: "LEAD PRUEBA SANDETEL",
          proyecto: "Sandetel",
          estado: "Registrado",
          whatsapp: "444555666",
          situacion: "Autonomo",
          fechaCreacion: new Date().toISOString(),
        },
      ];
      for (const t of tests) {
        await addDoc(collection(db, "leads"), {
          ...t,
          asistencia: Array(20).fill(true),
          status: "pendiente",
          doc1: false,
          doc2: false,
          tieneUsuarios: false,
          respondioWpp: false,
        });
      }
      notify("Campaña Líderes y Sandetel inyectadas");
    } catch (e) {
      notify("Error", "error");
    }
  };

  const handleUpdateLead = async (id, campo, valor) => {
    try {
      await updateDoc(doc(db, "leads", id), { [campo]: valor });
      if (
        !["respondioWpp", "doc1", "doc2", "tieneUsuarios", "regalo"].includes(
          campo,
        )
      )
        notify("Dato Guardado");
    } catch (e) {
      notify("Error de red", "error");
    }
  };

  const handleFinalizeSave = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "leads", finalizeModal.lead.id), {
      status: "finalizado",
      inicioClase: finalizeModal.fechaInicio,
      fechaFinClase: finalizeModal.fechaFin,
    });
    setFinalizeModal({
      open: false,
      lead: null,
      fechaInicio: "",
      fechaFin: "",
    });
    notify("Venta Finalizada");
  };

  const filteredLeads = leadsCLM
    .filter((l) => {
      const b = searchTerm.toLowerCase();
      const matchText =
        l.nombre?.toLowerCase().includes(b) || l.whatsapp?.includes(searchTerm);
      const matchProject =
        projectFilter === "todos" || l.proyecto === projectFilter;
      return matchText && matchProject;
    })
    .sort(
      (a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0),
    );

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans overflow-hidden relative">
      {toast.show && (
        <div className="fixed bottom-10 right-10 z-[600] bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <span className="text-[10px] font-black uppercase tracking-widest">
            {toast.message}
          </span>
        </div>
      )}

      <Sidebar
        isOpen={true}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB]">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          {activeTab === "clientes-clm" && (
            <div className="max-w-[1600px] mx-auto space-y-4 flex flex-col h-full">
              {/* CABECERA DASHBOARD */}
              <div className="flex justify-between items-end px-2">
                <div>
                  <h1 className="text-xl font-black text-slate-800 uppercase tracking-widest italic">
                    Panel Multicampaña
                  </h1>
                  <button
                    onClick={injectTestLeads}
                    className="text-[8px] font-black text-indigo-500 hover:underline uppercase mt-1"
                  >
                    Simular Lideres/Sandetel
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* FILTRO DE PROYECTO */}
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="bg-white border border-slate-200 text-[9px] font-black uppercase px-4 py-2.5 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                  >
                    <option value="todos">Todos los Proyectos</option>
                    <option value="CLM">CLM Turismo</option>
                    <option value="Lideres">Campaña Líderes</option>
                    <option value="Sandetel">Campaña Sandetel</option>
                  </select>

                  <div className="bg-slate-200/50 p-1 rounded-xl flex items-center border border-slate-200">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase ${viewMode === "table" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
                    >
                      Tabla
                    </button>
                    <button
                      onClick={() => setViewMode("kanban")}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase ${viewMode === "kanban" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
                    >
                      Tablero
                    </button>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#4F46E5] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl"
                  >
                    + Nuevo Lead
                  </button>
                </div>
              </div>

              {/* RENDER VISTA */}
              <div className="flex-1 min-h-0">
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
                    onManageLead={(l) => setManageModalLeadId(l.id)}
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
              onUpdateLead={handleUpdateLead}
              onEditLead={(l) => {
                setLeadToEdit(l);
                setIsModalOpen(true);
              }}
            />
          )}
          {activeTab === "reportes-clm" && <ReportsView leads={leadsCLM} />}
        </div>
      </main>

      {/* MODAL FINALES */}
      {finalizeModal.open && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest text-center mb-6">
              Finalizar para Comisión
            </h3>
            <form onSubmit={handleFinalizeSave} className="space-y-4">
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
                className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold"
              />
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
                className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold"
              />
              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-black uppercase"
              >
                Cerrar Venta
              </button>
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
          onSave={async (d) => {
            /* lógica de guardado */
          }}
          leadToEdit={leadToEdit}
        />
      )}
      {isFollowUpOpen && (
        <FollowUpModal
          onClose={() => setIsFollowUpOpen(false)}
          onSave={async (u) => {
            /* lógica de asistencia */
          }}
          lead={leadToFollow}
        />
      )}
    </div>
  );
}
