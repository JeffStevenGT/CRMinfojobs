import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function AdminUsersView() {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [nuevoRol, setNuevoRol] = useState("empleado");

  useEffect(() => {
    // Escucha la colección 'usuarios_permitidos' en Firebase
    const unsubscribe = onSnapshot(
      collection(db, "usuarios_permitidos"),
      (snapshot) => {
        setUsuarios(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
    );
    return () => unsubscribe();
  }, []);

  const handleAgregarUsuario = async (e) => {
    e.preventDefault();
    if (!nuevoCorreo.trim()) return;
    try {
      await addDoc(collection(db, "usuarios_permitidos"), {
        email: nuevoCorreo.toLowerCase().trim(),
        rol: nuevoRol,
        fechaCreacion: new Date().toISOString(),
      });
      setNuevoCorreo("");
    } catch (error) {
      console.error("Error al agregar usuario", error);
    }
  };

  const handleEliminarUsuario = async (id, email) => {
    if (window.confirm(`¿Estás seguro de quitarle el acceso a ${email}?`)) {
      await deleteDoc(doc(db, "usuarios_permitidos", id));
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto custom-scroll-y pb-20 animate-in fade-in duration-300 px-2">
      <div className="flex flex-col gap-1 shrink-0">
        <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">
          Control de Accesos
        </h2>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
          Panel Exclusivo de Administrador
        </p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">
          Autorizar Nuevo Usuario
        </h3>

        <form
          onSubmit={handleAgregarUsuario}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            type="email"
            required
            value={nuevoCorreo}
            onChange={(e) => setNuevoCorreo(e.target.value)}
            placeholder="correo@ejemplo.com"
            className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <select
            value={nuevoRol}
            onChange={(e) => setNuevoRol(e.target.value)}
            className="w-full md:w-48 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="empleado">Vendedor / Empleado</option>
            <option value="admin">Administrador</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Dar Acceso
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 flex-1">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">
          Usuarios con Acceso al CRM
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usuarios.map((user) => (
            <div
              key={user.id}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${user.rol === "admin" ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500"}`}
                >
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-700 truncate max-w-[150px]">
                    {user.email}
                  </p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                    {user.rol}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleEliminarUsuario(user.id, user.email)}
                className="text-rose-300 hover:text-rose-600 p-2 bg-white rounded-lg shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-all"
                title="Revocar acceso"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
          {usuarios.length === 0 && (
            <p className="text-xs text-slate-400 font-bold col-span-full">
              No hay usuarios registrados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
