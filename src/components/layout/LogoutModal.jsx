import React from "react";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[320px] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 p-8 text-center">
        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-500">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>

        <h3 className="text-[13px] font-black uppercase text-slate-800 tracking-widest mb-2">
          ¿Cerrar Sesión?
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase mb-8 leading-relaxed">
          Tu progreso en CLM quedará guardado de forma segura.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-rose-500 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-100 hover:bg-rose-600 active:scale-95 transition-all"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
