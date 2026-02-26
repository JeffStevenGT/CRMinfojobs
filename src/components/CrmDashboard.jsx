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
      notify("Error", "error");
    }
  };

  const handleUpdateLead = async (id, campo, valor) => {
    try {
      await updateDoc(doc(db, "leads", id), { [campo]: valor });
      if (!["respondioWpp", "doc1", "doc2", "tieneUsuarios"].includes(campo))
        notify("Guardado");
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
      return matchText && (projectFilter === "todos" || proj === projectFilter);
    })
    .sort(
      (a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0),
    );

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans overflow-hidden relative text-slate-900">
      {/* CSS PARA SCROLLBARS ELEGANTES */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scroll-x::-webkit-scrollbar { height: 8px; }
        .custom-scroll-x::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scroll-x::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #f1f5f9; }
        .custom-scroll-x::-webkit-scrollbar-thumb:hover { background: #6366f1; }
        
        .hide-scroll-y::-webkit-scrollbar { width: 0px; }
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
        isOpen={true}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB] h-full">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Contenedor principal con padding reducido para ganar espacio Y */}
        <div className="flex-1 overflow-hidden p-4 flex flex-col">
          {activeTab === "clientes-clm" && (
            <div className="max-w-full mx-auto space-y-3 flex flex-col h-full w-full">
              <div className="flex justify-between items-center px-2 shrink-0">
                <div className="space-y-0.5">
                  <h1 className="text-xl font-black text-slate-800 uppercase italic">
                    Operaciones
                  </h1>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                    Luis - CRM SENATI
                  </p>
                </div>

                <div className="flex items-center gap-3 scale-90 origin-right">
                  <div className="bg-slate-200/40 p-1 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-inner">
                    {["todos", "CLM", "Lideres", "Sandetel"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setProjectFilter(p)}
                        className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${projectFilter === p ? (p === "todos" ? "bg-slate-800 text-white" : p === "CLM" ? "bg-indigo-600 text-white" : p === "Lideres" ? "bg-amber-500 text-white" : "bg-cyan-500 text-white") : "text-slate-400"}`}
                      >
                        {p === "todos" ? "🌎 Todos" : p}
                      </button>
                    ))}
                  </div>
                  <div className="bg-slate-200/40 p-1 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-inner">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${viewMode === "table" ? "bg-white text-indigo-600 shadow-md" : "text-slate-400"}`}
                    >
                      Tabla
                    </button>
                    <button
                      onClick={() => setViewMode("kanban")}
                      className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${viewMode === "kanban" ? "bg-white text-indigo-600 shadow-md" : "text-slate-400"}`}
                    >
                      Tablero
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setLeadToEdit(null);
                      setIsModalOpen(true);
                    }}
                    className="bg-[#4F46E5] text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95"
                  >
                    + Nuevo
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0 h-full">
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
