import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import LeadTable from "./leads/LeadTable";
import AgendaView from "./agenda/AgendaView";
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
  const [leadsEndesa, setLeadsEndesa] = useState([]); // ESCALABILIDAD: Estado para Endesa
  const [searchTerm, setSearchTerm] = useState("");
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [leadToFollow, setLeadToFollow] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  // Escuchamos Leads de CLM (Colección principal actual)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "leads"), (snapshot) => {
      setLeadsCLM(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const showToast = (m) => {
    setToast({ show: true, message: m });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handleSaveLead = async (data) => {
    try {
      if (data.id) {
        await updateDoc(doc(db, "leads", data.id), data);
      } else {
        await addDoc(collection(db, "leads"), {
          ...data,
          asistencia: Array(20).fill(true),
          faltas: "0",
          status: "en curso",
          regalo: "no",
          tieneUsuarios: false,
        });
      }
      setIsModalOpen(false);
      setLeadToEdit(null);
      showToast("✓ Guardado");
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredLeads = leadsCLM.filter((l) =>
    l.nombre?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          {/* DIRECTORIO CLM */}
          {activeTab === "clientes-clm" && (
            <div className="max-w-[1600px] mx-auto space-y-4">
              <div className="flex justify-between items-center px-2">
                <h1 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                  Directorio CLM Turismo
                </h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#4F46E5] text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  + Registro
                </button>
              </div>
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
                  confirm("¿Eliminar?") && deleteDoc(doc(db, "leads", id))
                }
                onShowWarning={showToast}
              />
            </div>
          )}

          {/* AGENDA CLM */}
          {activeTab === "agenda-clm" && (
            <AgendaView
              leads={leadsCLM}
              onEditLead={(l) => {
                setLeadToEdit(l);
                setIsModalOpen(true);
              }}
              titulo="Agenda CLM Turismo"
            />
          )}

          {/* ESCALABILIDAD: VISTAS ENDESA (Vacias por ahora) */}
          {activeTab.includes("endesa") && (
            <div className="h-full flex items-center justify-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Módulo ENDESA en desarrollo...
              </p>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <LeadFormModal
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
            await updateDoc(doc(db, "leads", u.id), u);
            setIsFollowUpOpen(false);
          }}
          lead={leadToFollow}
        />
      )}
    </div>
  );
}
