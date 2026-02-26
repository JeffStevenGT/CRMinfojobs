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
          tieneUsuarios: false,
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
                    {["todos", "CLM", "Lideres", "Sandetel"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setProjectFilter(p)}
                        className={`${btnBase} ${projectFilter === p ? (p === "todos" ? "bg-slate-800 text-white" : p === "CLM" ? "bg-indigo-600 text-white" : p === "Lideres" ? "bg-amber-500 text-white" : "bg-cyan-500 text-white") : "text-slate-400"}`}
                      >
                        {p}
                      </button>
                    ))}
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
          {activeTab === "agenda-clm" && <AgendaView leads={leadsCLM} />}
          {activeTab === "reportes-clm" && <ReportsView leads={leadsCLM} />}
        </div>
      </main>

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
    </div>
  );
}
