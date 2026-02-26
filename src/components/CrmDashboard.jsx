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
} from "firebase/firestore";

export default function CrmDashboard() {
  const [leadsCLM, setLeadsCLM] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("clientes-clm");
  const [viewMode, setViewMode] = useState("kanban");
  const [projectFilter, setProjectFilter] = useState("todos");

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
          status: "pendiente",
          doc1: false,
          doc2: false,
          tieneUsuarios: false,
          regalo: "no",
          respondioWpp: false,
          fechaCreacion: new Date().toISOString(),
        });
        notify(`Registrado en ${data.proyecto}`);
      }
      setIsModalOpen(false);
      setLeadToEdit(null);
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
      notify("Error", "error");
    }
  };

  const filteredLeads = leadsCLM
    .filter((l) => {
      const b = searchTerm.toLowerCase();
      const matchText =
        l.nombre?.toLowerCase().includes(b) || l.whatsapp?.includes(searchTerm);
      const proj = l.proyecto || "CLM";
      const matchProject = projectFilter === "todos" || proj === projectFilter;
      return matchText && matchProject;
    })
    .sort(
      (a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0),
    );

  // --- CLASES UNIFICADAS ---
  const containerStyle =
    "bg-slate-200/40 backdrop-blur-sm p-1 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-inner";
  const btnBase =
    "px-5 py-2 rounded-xl text-[9.5px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95";

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans overflow-hidden relative">
      {toast.show && (
        <div className="fixed bottom-10 right-10 z-[700] px-6 py-3 rounded-full shadow-2xl bg-slate-800 text-white animate-in fade-in slide-in-from-bottom-4">
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
            <div className="max-w-[1600px] mx-auto space-y-6 flex flex-col h-full">
              <div className="flex justify-between items-center px-2">
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">
                    Operaciones
                  </h1>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    Multi-Proyecto
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* SELECTOR DE CAMPAÑAS UNIFICADO */}
                  <div className={containerStyle}>
                    <button
                      onClick={() => setProjectFilter("todos")}
                      className={`${btnBase} ${projectFilter === "todos" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      🌎 Todos
                    </button>
                    <button
                      onClick={() => setProjectFilter("CLM")}
                      className={`${btnBase} ${projectFilter === "CLM" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-400 hover:text-indigo-500"}`}
                    >
                      CLM
                    </button>
                    <button
                      onClick={() => setProjectFilter("Lideres")}
                      className={`${btnBase} ${projectFilter === "Lideres" ? "bg-amber-500 text-white shadow-md shadow-amber-100" : "text-slate-400 hover:text-amber-500"}`}
                    >
                      LÍDERES
                    </button>
                    <button
                      onClick={() => setProjectFilter("Sandetel")}
                      className={`${btnBase} ${projectFilter === "Sandetel" ? "bg-cyan-500 text-white shadow-md shadow-cyan-100" : "text-slate-400 hover:text-cyan-500"}`}
                    >
                      SANDETEL
                    </button>
                  </div>

                  <div className="h-8 w-px bg-slate-200 mx-1"></div>

                  {/* SELECTOR DE VISTA UNIFICADO (MISMO ESTILO) */}
                  <div className={containerStyle}>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`${btnBase} ${viewMode === "table" ? "bg-white text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      Tabla
                    </button>
                    <button
                      onClick={() => setViewMode("kanban")}
                      className={`${btnBase} ${viewMode === "kanban" ? "bg-white text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      Tablero
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setLeadToEdit(null);
                      setIsModalOpen(true);
                    }}
                    className="bg-[#4F46E5] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-95 transition-all"
                  >
                    + Nuevo Registro
                  </button>
                </div>
              </div>

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

      {/* MODALES SE MANTIENEN IGUAL */}
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
    </div>
  );
}
