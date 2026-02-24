import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import LeadTable from "./leads/LeadTable";
import LeadFormModal from "./leads/LeadFormModal";
import FollowUpModal from "./leads/FollowUpModal";

export default function CrmDashboard() {
  // --- ESTADOS DE LA UI ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("clientes-clm");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [leadToFollow, setLeadToFollow] = useState(null);

  // --- BASE DE DATOS (LocalStorage) ---
  const [leadsCLM, setLeadsCLM] = useState(() => {
    const datosGuardados = localStorage.getItem("crm_leads_clm");
    if (datosGuardados) return JSON.parse(datosGuardados);

    return [
      {
        id: 1,
        nombre: "George Lindelof",
        whatsapp: "+34 612 345 678",
        provincia: "Albacete",
        situacion: "Dependiente",
        estado: "Inscrito",
        horario: "mañana",
        finalizo: "si",
        regalo: "si",
        asistencia: Array(20).fill(true),
        doc1: true,
        doc2: true,
      },
      {
        id: 2,
        nombre: "Carmen Ruiz",
        whatsapp: "+34 698 765 432",
        provincia: "Madrid",
        situacion: "Autonomo",
        estado: "Inscrito",
        horario: "tarde",
        finalizo: "en curso",
        regalo: "no",
        asistencia: Array(20).fill(true),
        doc1: true,
        doc2: true,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("crm_leads_clm", JSON.stringify(leadsCLM));
  }, [leadsCLM]);

  // --- FILTRADO ---
  const filteredLeads = leadsCLM.filter((lead) => {
    const term = searchTerm.toLowerCase();
    return (
      lead.nombre.toLowerCase().includes(term) || lead.whatsapp.includes(term)
    );
  });

  // --- MANEJADORES ---
  const handleSaveLead = (leadData) => {
    if (leadData.id) {
      setLeadsCLM((prev) =>
        prev.map((l) => (l.id === leadData.id ? leadData : l)),
      );
    } else {
      setLeadsCLM([
        ...leadsCLM,
        {
          ...leadData,
          id: Date.now(),
          asistencia: Array(20).fill(true),
          faltas: "0",
        },
      ]);
    }
    setLeadToEdit(null);
    setIsModalOpen(false);
  };

  const handleUpdateLead = (id, campo, valor) => {
    setLeadsCLM((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, [campo]: valor } : lead)),
    );
  };

  const handleSaveFollowUp = (updatedLead) => {
    const asistencias = (updatedLead.asistencia || []).filter((d) => d).length;
    if (asistencias < 18) {
      updatedLead.finalizo = "no apto";
      updatedLead.regalo = "no";
    } else if (updatedLead.finalizo === "no apto") {
      updatedLead.finalizo = "en curso";
    }
    handleSaveLead(updatedLead);
    setIsFollowUpOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      {/* CORRECCIÓN: Ahora pasamos isOpen y setIsOpen correctamente */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sugerencias={filteredLeads}
        />

        <div className="flex-1 overflow-auto p-6 md:p-8 custom-scrollbar">
          {activeTab === "clientes-clm" && (
            <div className="max-w-[1450px] mx-auto space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  CLM Turismo
                </h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  + Añadir Cliente
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
              />
            </div>
          )}

          {/* Marcadores de posición para otras pestañas */}
          {activeTab.startsWith("agenda-") && (
            <div className="p-10 text-gray-400">
              Módulo de Agenda en construcción...
            </div>
          )}
          {activeTab.startsWith("reportes-") && (
            <div className="p-10 text-gray-400">
              Módulo de Reportes en construcción...
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
