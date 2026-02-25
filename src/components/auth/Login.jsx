import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- FUNCIÓN DE AUTOCOMPLETADO RÁPIDO ---
  const fillCredentials = () => {
    setEmail("admin@mainjobs.com"); // Cámbialo por el que creaste en la consola
    setPassword("12345678"); // Cámbialo por el que creaste en la consola
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Credenciales inválidas. Revisa e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#4F46E5] p-8 text-center text-white">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 backdrop-blur-md">
            <span className="text-xl font-black italic">CT</span>
          </div>
          <h1 className="text-lg font-black uppercase tracking-[0.2em]">
            Infojobs CRM
          </h1>
          <p className="text-indigo-100 text-[10px] font-bold uppercase mt-2 opacity-80 tracking-widest">
            Acceso Restringido
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <p className="text-[10px] text-red-600 font-bold uppercase">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Contraseña
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#4F46E5] text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Entrar al Sistema"}
          </button>
        </form>

        {/* BOTÓN DE ACCESO RÁPIDO - Solo para desarrollo */}
        <div className="px-8 pb-8 text-center">
          <button
            type="button"
            onClick={fillCredentials}
            className="text-[9px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors border-b border-indigo-100 pb-0.5"
          >
            ⚡ Usar credenciales de Demo
          </button>
          <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest mt-6">
            Sincronizado con Firebase Auth
          </p>
        </div>
      </div>
    </div>
  );
}
