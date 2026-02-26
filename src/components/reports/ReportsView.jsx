import React, { useState } from "react";

export default function ReportsView({ leads }) {
  const [mesSeleccionado, setMesSeleccionado] = useState(
    new Date().toISOString().slice(0, 7),
  );

  // --- LÓGICA DE PERIODOS ---
  const mesesDisponibles = [
    ...new Set(
      leads
        .filter((l) => l.status === "finalizado" && l.fechaFinClase)
        .map((l) => l.fechaFinClase.slice(0, 7)),
    ),
  ]
    .sort()
    .reverse();

  if (!mesesDisponibles.includes(mesSeleccionado)) {
    mesesDisponibles.unshift(mesSeleccionado);
  }

  // --- MÉTRICAS DE CIERRE (COMISIÓN) ---
  const ventasFinalizadasMes = leads.filter(
    (l) =>
      l.status === "finalizado" &&
      l.fechaFinClase &&
      l.fechaFinClase.startsWith(mesSeleccionado),
  );

  const puntosPorVenta = 1.5;
  const puntosTotales = ventasFinalizadasMes.length * puntosPorVenta;

  let valorPorPunto = 0;
  let siguienteTramoPts = null;
  let tramoActual = 0;

  if (puntosTotales >= 28) {
    valorPorPunto = 75.0;
    siguienteTramoPts = null;
    tramoActual = 6;
  } else if (puntosTotales >= 24) {
    valorPorPunto = 62.5;
    siguienteTramoPts = 28;
    tramoActual = 5;
  } else if (puntosTotales >= 20) {
    valorPorPunto = 50.0;
    siguienteTramoPts = 24;
    tramoActual = 4;
  } else if (puntosTotales >= 16) {
    valorPorPunto = 37.5;
    siguienteTramoPts = 20;
    tramoActual = 3;
  } else if (puntosTotales >= 12) {
    valorPorPunto = 25.0;
    siguienteTramoPts = 16;
    tramoActual = 2;
  } else if (puntosTotales >= 8) {
    valorPorPunto = 20.0;
    siguienteTramoPts = 12;
    tramoActual = 1;
  } else {
    valorPorPunto = 0;
    siguienteTramoPts = 8;
    tramoActual = 0;
  }

  const comisionTotal = puntosTotales * valorPorPunto;
  const progreso = siguienteTramoPts
    ? Math.min((puntosTotales / siguienteTramoPts) * 100, 100)
    : 100;

  // --- MÉTRICAS DE PROYECCIÓN (CÓMO VIENE EL FUTURO) ---
  const countRegistrados = leads.filter(
    (l) => l.estado === "Registrado",
  ).length;
  const countMatriculados = leads.filter(
    (l) => l.estado === "Inscrito" && l.status === "pendiente",
  ).length;
  const countEnCurso = leads.filter(
    (l) => l.estado === "Inscrito" && l.status === "en curso",
  ).length;

  // --- FUNCIONES DE FECHAS ---
  const formatearMes = (yyyyMM) => {
    const [y, m] = yyyyMM.split("-");
    return new Date(y, m - 1)
      .toLocaleDateString("es-ES", { month: "long", year: "numeric" })
      .toUpperCase();
  };

  const formatearMesPagoN1 = (yyyyMM) => {
    const [y, m] = yyyyMM.split("-");
    const fechaPago = new Date(y, parseInt(m) + 1, 0);
    return fechaPago
      .toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* CABECERA */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-4 px-2">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest italic">
            Análisis de Resultados
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            CLM Turismo - Control de Comisiones
          </p>
        </div>

        <div className="flex flex-col items-end">
          <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">
            Periodo de Cierre
          </label>
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="bg-white text-indigo-700 font-bold text-xs px-4 py-2 rounded-xl border border-indigo-100 outline-none cursor-pointer hover:bg-indigo-50 shadow-sm transition-all"
          >
            {mesesDisponibles.map((m) => (
              <option key={m} value={m}>
                {formatearMes(m)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BLOQUE 1: CIERRES DEL MES (DINERO REAL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Ventas Finalizadas
          </p>
          <div className="flex items-end gap-2 mt-2">
            <h3 className="text-4xl font-black text-slate-800">
              {ventasFinalizadasMes.length}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
              Alumnos
            </span>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">
            Puntos Acumulados
          </p>
          <div className="flex items-end gap-2 mt-2">
            <h3 className="text-4xl font-black text-sky-600">
              {puntosTotales}
            </h3>
            <span className="text-[10px] font-bold text-sky-400 mb-1.5 uppercase">
              Pts
            </span>
          </div>
          <p className="text-[8px] font-bold text-sky-400 uppercase mt-1">
            1 Alumno = 1.5 Puntos
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
            Valor por Punto
          </p>
          <div className="flex items-end gap-1 mt-2">
            <span className="text-lg font-bold text-indigo-400 mb-1">S/.</span>
            <h3 className="text-4xl font-black text-indigo-600">
              {valorPorPunto.toFixed(2)}
            </h3>
          </div>
          <div className="absolute right-4 top-4 bg-indigo-50 text-indigo-500 text-[8px] font-black px-2 py-1 rounded-lg uppercase border border-indigo-100">
            Tramo {tramoActual}
          </div>
        </div>

        <div className="bg-emerald-500 rounded-[2rem] p-6 shadow-xl shadow-emerald-100 flex flex-col justify-center text-white relative">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">
            Comisión Estimada
          </p>
          <div className="flex items-end gap-1 mt-1">
            <span className="text-xl font-bold text-emerald-100 mb-1">S/.</span>
            <h3 className="text-4xl font-black">
              {comisionTotal.toLocaleString("es-PE", {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
          <p className="text-[8px] font-black text-emerald-100 bg-emerald-600/50 px-2 py-1.5 rounded-lg inline-block w-max mt-3 tracking-widest uppercase">
            Pago: {formatearMesPagoN1(mesSeleccionado)}
          </p>
        </div>
      </div>

      {/* BLOQUE 2: PROGRESO AL SIGUIENTE TRAMO */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
              Rendimiento del Periodo
            </h3>
            {siguienteTramoPts ? (
              <p className="text-[10px] font-bold text-slate-400 mt-1">
                Faltan{" "}
                <span className="text-indigo-500">
                  {(siguienteTramoPts - puntosTotales).toFixed(1)} puntos
                </span>{" "}
                para subir tu multiplicador.
              </p>
            ) : (
              <p className="text-[10px] font-bold text-emerald-500 mt-1">
                ¡Objetivo Cumplido! Estás en el multiplicador máximo.
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-600">
              {progreso.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progreso}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* NUEVO BLOQUE 3: PROYECCIÓN DEL NEGOCIO (EL FUTURO) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-50 rounded-[2rem] p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-purple-800 uppercase tracking-widest">
                En Proceso: Registrados
              </h4>
              <p className="text-[8px] font-bold text-purple-400 uppercase tracking-wide">
                Pendientes de Documentación
              </p>
            </div>
          </div>
          <h3 className="text-3xl font-black text-purple-600">
            {countRegistrados}{" "}
            <span className="text-sm font-bold opacity-50">LEADS</span>
          </h3>
        </div>

        <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                En Espera: Matriculados
              </h4>
              <p className="text-[8px] font-bold text-amber-400 uppercase tracking-wide">
                Listos para iniciar clase
              </p>
            </div>
          </div>
          <h3 className="text-3xl font-black text-amber-600">
            {countMatriculados}{" "}
            <span className="text-sm font-bold opacity-50">ALUMNOS</span>
          </h3>
        </div>

        <div className="bg-indigo-50 rounded-[2rem] p-6 border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-indigo-800 uppercase tracking-widest">
                Activos: En Curso
              </h4>
              <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-wide">
                Posibles ingresos futuros
              </p>
            </div>
          </div>
          <h3 className="text-3xl font-black text-indigo-600">
            {countEnCurso}{" "}
            <span className="text-sm font-bold opacity-50">ESTUDIANDO</span>
          </h3>
        </div>
      </div>

      {/* TABLA DE TRAMOS */}
      <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
          Escala de Comisiones Vigente
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { nivel: 1, min: 8, max: "11.5", valor: 20.0 },
            { nivel: 2, min: 12, max: "15.5", valor: 25.0 },
            { nivel: 3, min: 16, max: "19.5", valor: 37.5 },
            { nivel: 4, min: 20, max: "23.5", valor: 50.0 },
            { nivel: 5, min: 24, max: "27.5", valor: 62.5 },
            { nivel: 6, min: 28, max: "Más", valor: 75.0 },
          ].map((tramo) => {
            const isActivo = tramoActual === tramo.nivel;
            return (
              <div
                key={tramo.nivel}
                className={`p-4 rounded-2xl border transition-all text-center ${isActivo ? "bg-white border-emerald-300 shadow-lg scale-105" : "bg-white/50 border-slate-200 opacity-60"}`}
              >
                <p
                  className={`text-[8px] font-black uppercase mb-1 ${isActivo ? "text-emerald-600" : "text-slate-400"}`}
                >
                  Tramo {tramo.nivel}
                </p>
                <p className="text-[11px] font-black text-slate-700 mb-2">
                  {tramo.min} a {tramo.max} pts
                </p>
                <div
                  className={`text-[10px] font-bold py-1.5 rounded-lg ${isActivo ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  S/. {tramo.valor.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
