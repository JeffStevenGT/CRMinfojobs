import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore"; // <-- Agregamos updateDoc y doc
import { db } from "../../firebase";

export default function Login({ onLoginSuccess }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const checkWhitelist = async (emailToCheck) => {
    const q = query(
      collection(db, "usuarios_permitidos"),
      where("email", "==", emailToCheck.toLowerCase().trim()),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { isAllowed: false, rol: null, docId: null, nombreDB: null };
    }

    const userData = querySnapshot.docs[0].data();
    // Retornamos también el ID del documento para poder actualizarlo luego
    return {
      isAllowed: true,
      rol: userData.rol,
      docId: querySnapshot.docs[0].id,
      nombreDB: userData.nombre,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering && !nombre.trim()) {
        throw new Error("Por favor, ingresa tu nombre.");
      }

      const { isAllowed, rol, docId, nombreDB } = await checkWhitelist(email);

      if (!isAllowed) {
        throw new Error(
          "ACCESO DENEGADO: Tu correo no está autorizado por el Administrador.",
        );
      }

      let userCredential;
      let finalName = nombre;

      if (isRegistering) {
        // 1. Crear cuenta en Firebase Auth
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(userCredential.user, { displayName: nombre });

        // 2. LA MAGIA: Guardar el nombre en Firestore para que sea permanente
        await updateDoc(doc(db, "usuarios_permitidos", docId), {
          nombre: nombre,
        });
      } else {
        // Iniciar sesión
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        // Si ya tenía nombre en Firestore, lo usamos; si no, "Usuario"
        finalName = userCredential.user.displayName || nombreDB || "Usuario";
      }

      onLoginSuccess(userCredential.user, rol, finalName);
    } catch (err) {
      console.error(err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Correo o contraseña incorrectos.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado. Intenta Iniciar Sesión.");
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError(err.message || "Ocurrió un error al autenticar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10 animate-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-600/30 mb-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            J
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
            JEFF CRM
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Plataforma Operativa
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 animate-in fade-in">
            <svg
              className="w-5 h-5 text-rose-500 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-[10px] font-black text-rose-600 uppercase tracking-wide leading-snug">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">
                Tu Nombre
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
                placeholder="Ej. Carlos Mendoza"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
              placeholder="tu@correo.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Verificando acceso...</span>
            ) : isRegistering ? (
              "Crear Cuenta y Entrar"
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            {isRegistering
              ? "¿Ya tienes tu cuenta configurada?"
              : "¿Es tu primera vez entrando al CRM?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
            }}
            className="mt-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
          >
            {isRegistering ? "Iniciar Sesión" : "Crear mi cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
}
