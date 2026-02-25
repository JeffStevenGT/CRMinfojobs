import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import LeadTable from "./leads/LeadTable";
import LeadFormModal from "./leads/LeadFormModal";
import FollowUpModal from "./leads/FollowUpModal";

// --- CONEXIÓN FIREBASE ---
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
  // --- ESTADOS DE INTERFAZ ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("clientes-clm");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [leadToFollow, setLeadToFollow] = useState(null);

  // Notificación minimalista (Toast)
  const [toast, setToast] = useState({ show: false, message: "" });

  // --- ESTADOS DE DATOS ---
  const [leadsCLM, setLeadsCLM] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para mostrar alertas elegantes
  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  };

  // --- 1. ESCUCHA EN TIEMPO REAL (FIRESTORE) ---
  useEffect(() => {
    setIsLoading(true);
    // Conexión al proyecto crm-mainjobs
    const unsubscribe = onSnapshot(
      collection(db, "leads"),
      (snapshot) => {
        const leadsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeadsCLM(leadsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error en Firestore:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // --- 2. MOTOR DE BÚSQUEDA ---
  const filteredLeads = leadsCLM.filter((lead) => {
    const busqueda = searchTerm.toLowerCase();
    return (
      lead.nombre?.toLowerCase().includes(busqueda) ||
      lead.whatsapp?.includes(searchTerm) ||
      lead.email?.toLowerCase().includes(busqueda)
    );
  });

  // --- 3. GUARDAR / EDITAR LEAD ---
  const handleSaveLead = async (leadData) => {
    // REGLA DE ORO: No inscribir sin documentos completos
    if (leadData.estado === "Inscrito" && (!leadData.doc1 || !leadData.doc2)) {
      showToast("❌ Error: Faltan documentos para inscribir.");
      return;
    }

    try {
      if (leadData.id) {
        // Modo Edición
        const leadRef = doc(db, "leads", leadData.id);
        const { id, ...dataSinId } = leadData;
        await updateDoc(leadRef, dataSinId);
      } else {
        // Modo Creación: Inicializamos campos de seguimiento
        const nuevoLead = {
          ...leadData,
          asistencia: Array(20).fill(true), // Los 20 días de CLM Turismo
          faltas: "0",
          finalizo: "en curso",
          regalo: "no",
          tieneUsuarios: false,
          inicioClase: "",
        };
        await addDoc(collection(db, "leads"), nuevoLead);
      }
      setLeadToEdit(null);
      setIsModalOpen(false);
    } catch (error) {
      alert("Error en la base de datos: " + error.message);
    }
  };

  // --- 4. ACTUALIZACIÓN RÁPIDA (DESDE LA TABLA) ---
  const handleUpdateLead = async (id, campo, valor) => {
    const leadActual = leadsCLM.find((l) => l.id === id);

    // Validación de seguridad para cambios de estado a Inscrito
    if (campo === "estado" && valor === "Inscrito") {
      if (!leadActual.doc1 || !leadActual.doc2) {
        showToast("⚠️ Bloqueado: Adjunta documentos antes de inscribir.");
        return;
      }
    }

    try {
      const leadRef = doc(db, "leads", id);
      await updateDoc(leadRef, { [campo]: valor });
    } catch (error) {
      console.error("Error al actualizar campo:", error);
    }
  };

  // --- 5. ELIMINAR REGISTRO ---
  const handleDeleteLead = async (id) => {
    if (
      window.confirm("¿Estás seguro de eliminar este registro de crm-mainjobs?")
    ) {
      try {
        await deleteDoc(doc(db, "leads", id));
      } catch (error) {
        alert("Error al eliminar: " + error.message);
      }
    }
  };

  // --- 6. SEGUIMIENTO DE ASISTENCIA (20 DÍAS) ---
  const handleSaveFollowUp = async (updatedLead) => {
    try {
      const asistencias = (updatedLead.asistencia || []).filter(
        (d) => d,
      ).length;
      const faltasCount = 20 - asistencias;

      const leadRef = doc(db, "leads", updatedLead.id);
      await updateDoc(leadRef, {
        asistencia: updatedLead.asistencia,
        faltas: faltasCount.toString(),
      });

      setIsFollowUpOpen(false);
    } catch (error) {
      console.error("Error al guardar asistencia:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-slate-900 relative">
      {/* TOAST MINIMALISTA (NOTIFICACIÓN) */}
      {toast.show && (
        <div className="fixed top-24 right-10 z-[100] animate-bounce-short">
          <div className="bg-white/90 backdrop-blur-md border border-indigo-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="bg-indigo-500 p-1.5 rounded-full text-white">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-[11px] font-black text-gray-700 tracking-tight">
              {toast.message}
            </p>
          </div>
        </div>
      )}

      {/* COMPONENTES DE ESTRUCTURA */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar">
          {activeTab === "clientes-clm" && (
            <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in">
              <div className="flex justify-between items-center px-2">
                <div>
                  <h1 className="text-2xl font-black text-gray-800 tracking-tight">
                    Directorio CLM Turismo
                  </h1>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                    Sincronización Activa: crm-mainjobs
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  + Añadir Registro
                </button>
              </div>

              {isLoading ? (
                <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[32px] border border-gray-100 shadow-sm mt-4">
                  <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    Conectando con Google Cloud...
                  </p>
                </div>
              ) : (
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
                  onDeleteLead={handleDeleteLead}
                  onShowWarning={showToast}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODALES CONECTADOS CORRECTAMENTE */}
      {isModalOpen && (
        <LeadFormModal
          onClose={() => {
            setIsModalOpen(false);
            setLeadToEdit(null);
          }}
          onSave={handleSaveLead}
          leadToEdit={leadToEdit}
          leads={leadsCLM}
        />
      )}

      {isFollowUpOpen && (
        <FollowUpModal
          onClose={() => setIsFollowUpOpen(false)}
          onSave={handleSaveFollowUp}
          lead={leadToFollow}
        />
      )}
    </div>
  );
}
