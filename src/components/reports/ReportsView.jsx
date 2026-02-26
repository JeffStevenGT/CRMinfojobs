import React from "react";

export default function ReportsView({ leads }) {
  // 1. LÓGICA DE FILTRADO (Solo cuenta el estatus "finalizado")
  const leadsFinalizados = leads.filter((l) => l.status === "finalizado");

  // 2. MATEMÁTICAS DE PUNTOS
  const puntosPorInscripcion = 1.5;
  const puntosTotales = leadsFinalizados.length * puntosPorInscripcion;

  // 3. MATEMÁTICAS DE TRAMOS Y VALOR POR PUNTO
  let valorPorPunto = 0;
  let siguienteTramoPts = null;
  let tramoActual = 0;

  // Lógica exacta de escalado
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
    // Al ser de 1.5 en 1.5, esto se activa al llegar a 9 puntos (6 leads)
    valorPorPunto = 20.0;
    siguienteTramoPts = 12;
    tramoActual = 1;
  } else {
    // Aún no llega al mínimo para comisionar
    valorPorPunto = 0;
    siguienteTramoPts = 8;
    tramoActual = 0;
  }

  // 4. COMISIÓN TOTAL
  const comisionTotal = puntosTotales * valorPorPunto;

  // 5. BARRA DE PROGRESO
  const progreso = siguienteTramoPts
    ? Math.min((puntosTotales / siguienteTramoPts) * 100, 100)
    : 100;

  // Definición de Tramos para la tabla de referencia
  const tablaTramos = [
    { nivel: 1, min: 8, max: "11.5", valor: 20.0 },
    { nivel: 2, min: 12, max: "15.5", valor: 25.0 },
    { nivel: 3, min: 16, max: "19.5", valor: 37.5 },
    { nivel: 4, min: 20, max: "23.5", valor: 50.0 },
    { nivel: 5, min: 24, max: "27.5", valor: 62.5 },
    { nivel: 6, min: 28, max: "Más", valor: 75.0 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* CABECERA */}
      <div className="border-b border-slate-100 pb-4 px-2">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest italic">
          Panel de Rendimiento
        </h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
          Andina - CLM Mainjobs (Soles)
        </p>
      </div>

      {/* DASHBOARD PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TARJETA 1: VENTAS FINALIZADAS */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Ventas Cerradas
          </p>
          <div className="flex items-end gap-2 mt-2">
            <h3 className="text-4xl font-black text-slate-800">
              {leadsFinalizados.length}
            </h3>
            <span className="text-xs font-bold text-slate-400 mb-1.5">
              Finalizados
            </span>
          </div>
        </div>

        {/* TARJETA 2: PUNTOS TOTALES */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">
            Puntos Acumulados
          </p>
          <div className="flex items-end gap-2 mt-2">
            <h3 className="text-4xl font-black text-sky-600">
              {puntosTotales}
            </h3>
            <span className="text-xs font-bold text-sky-400 mb-1.5">Pts.</span>
          </div>
          <p className="text-[8px] font-bold text-sky-400 uppercase mt-1">
            1 Venta = 1.5 Puntos
          </p>
        </div>

        {/* TARJETA 3: MULTIPLICADOR (VALOR POR PUNTO) */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest relative z-10">
            Valor por Punto
          </p>
          <div className="flex items-end gap-2 mt-2 relative z-10">
            <span className="text-lg font-bold text-indigo-400 mb-1">S/.</span>
            <h3 className="text-4xl font-black text-indigo-600">
              {valorPorPunto.toFixed(2)}
            </h3>
          </div>
          {tramoActual > 0 && (
            <div className="absolute right-4 top-4 bg-indigo-50 text-indigo-500 text-[8px] font-black px-2 py-1 rounded-lg uppercase">
              Tramo {tramoActual}
            </div>
          )}
        </div>

        {/* TARJETA 4: COMISIÓN TOTAL */}
        <div className="bg-emerald-500 rounded-[2rem] p-6 shadow-xl shadow-emerald-200 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 relative z-10">
            Comisión Total
          </p>
          <div className="flex items-end gap-2 mt-2 relative z-10">
            <span className="text-xl font-bold text-emerald-100 mb-1">S/.</span>
            <h3 className="text-4xl font-black">
              {comisionTotal.toLocaleString("es-PE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE PROGRESO */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest">
              Rumbo al siguiente Tramo
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
                ¡Felicidades! Has alcanzado el tramo máximo de multiplicador.
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-indigo-600">
              {progreso.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* BARRA ANIMADA */}
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-indigo-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progreso}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* TABLA DE ESCALA DE COMISIONES (REFERENCIA) */}
      <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">
          Escala de Comisiones (Soles)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {tablaTramos.map((tramo) => {
            const isActivo = tramoActual === tramo.nivel;
            return (
              <div
                key={tramo.nivel}
                className={`p-4 rounded-2xl border transition-all text-center ${
                  isActivo
                    ? "bg-emerald-100 border-emerald-300 shadow-sm scale-105"
                    : "bg-white border-slate-200 opacity-70"
                }`}
              >
                <p
                  className={`text-[9px] font-black uppercase mb-1 ${isActivo ? "text-emerald-600" : "text-slate-400"}`}
                >
                  Tramo {tramo.nivel}
                </p>
                <p
                  className={`text-sm font-black mb-1 ${isActivo ? "text-emerald-800" : "text-slate-700"}`}
                >
                  {tramo.min} a {tramo.max} pts
                </p>
                <div
                  className={`text-[11px] font-bold py-1 rounded-lg ${isActivo ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  S/. {tramo.valor.toFixed(2)} / pt
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
