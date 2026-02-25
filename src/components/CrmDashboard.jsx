import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import LeadTable from "./leads/LeadTable";
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

  // ESTADO DEL MODAL DE COMENTARIOS
  const [viewComment, setViewComment] = useState({
    open: false,
    text: "",
    client: "",
  });

  // ESTADO DEL TOAST
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
      notify("Dato actualizado");
    } catch (e) {
      notify("Error de red", "error");
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
          temperatura: data.temperatura || "Tibio", // INYECCIÓN POR DEFECTO DEL TERMÓMETRO
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

  const filteredLeads = leadsCLM.filter((l) => {
    const b = searchTerm.toLowerCase();
    return (
      l.nombre?.toLowerCase().includes(b) ||
      l.whatsapp?.includes(searchTerm) ||
      l.quienRefirio?.toLowerCase().includes(b)
    );
  });

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans overflow-hidden relative">
      {/* TOAST MINIMALISTA */}
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
            <div className="max-w-[1600px] mx-auto space-y-6">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h1 className="text-xl font-black text-slate-800 uppercase tracking-widest italic">
                    CLM Turismo
                  </h1>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    Directorio de Gestión Operativa
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#4F46E5] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  + Nuevo Lead
                </button>
              </div>
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
              />
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

      {/* MODALES */}
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

      {/* MODAL LECTURA DE COMENTARIOS */}
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
