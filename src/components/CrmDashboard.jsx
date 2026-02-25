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

  // SISTEMA DE NOTIFICACIÓN MINIMALISTA (TOAST)
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // CONEXIÓN EN TIEMPO REAL CON FIREBASE
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "leads"), (snapshot) => {
      setLeadsCLM(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  // FUNCIÓN MAESTRA DE AVISOS (Reemplaza a los alert y console.log)
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
      notify("Sincronizado con la base de datos");
    } catch (e) {
      notify("Error de conexión", "error");
    }
  };

  const handleSaveLead = async (data) => {
    try {
      if (data.id) {
        const { id, ...cleanData } = data;
        await updateDoc(doc(db, "leads", id), cleanData);
        notify("Perfil de cliente actualizado");
      } else {
        await addDoc(collection(db, "leads"), {
          ...data,
          asistencia: Array(20).fill(true),
          faltas: "0",
          status: "en curso",
          regalo: "no",
          tieneUsuarios: false,
          agendaStatus: "pendiente",
          fechaLlamada: data.fechaLlamada || "",
          inicioClase: data.inicioClase || "",
        });
        notify("Nuevo registro exitoso");
      }
      setIsModalOpen(false);
      setLeadToEdit(null);
    } catch (e) {
      notify("Error al guardar registro", "error");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de eliminar permanentemente este registro?")
    ) {
      try {
        await deleteDoc(doc(db, "leads", id));
        notify("Registro eliminado del sistema", "error");
      } catch (e) {
        notify("No se pudo eliminar", "error");
      }
    }
  };

  // BUSCADOR INTELIGENTE (Nombre, WhatsApp o Referente)
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
      {/* COMPONENTE TOAST (PÍLDORA FLOTANTE) */}
      {toast.show && (
        <div className="fixed bottom-10 right-10 z-[300] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl border backdrop-blur-xl ${
              toast.type === "success"
                ? "bg-emerald-500/90 border-emerald-400"
                : "bg-rose-500/90 border-rose-400"
            }`}
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
          {/* TAB: DIRECTORIO CLM */}
          {activeTab === "clientes-clm" && (
            <div className="max-w-[1600px] mx-auto space-y-6">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h1 className="text-xl font-black text-slate-800 uppercase tracking-widest italic">
                    CLM Turismo
                  </h1>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    Directorio de Gestión de Leads
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#4F46E5] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all"
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
              />
            </div>
          )}

          {/* TAB: AGENDA CLM */}
          {activeTab === "agenda-clm" && (
            <AgendaView
              leads={leadsCLM}
              onUpdateLead={handleUpdateLead}
              onEditLead={(l) => {
                setLeadToEdit(l);
                setIsModalOpen(true);
              }}
              titulo="Agenda de Seguimiento CLM"
            />
          )}

          {/* TAB: REPORTES CLM */}
          {activeTab === "reportes-clm" && <ReportsView leads={leadsCLM} />}
        </div>
      </main>

      {/* MODAL DE FORMULARIO */}
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

      {/* MODAL DE ASISTENCIA (CON TRIGGER DE "NO APTO") */}
      {isFollowUpOpen && (
        <FollowUpModal
          onClose={() => setIsFollowUpOpen(false)}
          onSave={async (u) => {
            // 1. Calculamos las faltas en tiempo real
            const faltasCalc =
              20 - (u.asistencia || []).filter((d) => d).length;
            let nuevoStatus = u.status || "en curso";

            // 2. TRIGGER AUTOMÁTICO: Si tiene 3 o más faltas = NO APTO
            if (
              faltasCalc >= 3 &&
              nuevoStatus !== "abandonado" &&
              nuevoStatus !== "finalizado"
            ) {
              nuevoStatus = "no apto";
            }
            // 3. TRIGGER INVERSO: Si le quitas faltas y estaba no apto, vuelve a EN CURSO
            else if (faltasCalc < 3 && nuevoStatus === "no apto") {
              nuevoStatus = "en curso";
            }

            // 4. Guardamos todo en Firestore de golpe
            await updateDoc(doc(db, "leads", u.id), {
              ...u,
              faltas: faltasCalc.toString(),
              status: nuevoStatus,
            });

            // 5. Notificamos al usuario
            if (faltasCalc >= 3) {
              notify("⚠️ Lead marcado como NO APTO", "error");
            } else {
              notify("Asistencia guardada");
            }

            setIsFollowUpOpen(false);
          }}
          lead={leadToFollow}
        />
      )}
    </div>
  );
}
