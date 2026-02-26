import React, { useState } from "react";

export default function ReportsView({ leads }) {
  const [mesSeleccionado, setMesSeleccionado] = useState(
    new Date().toISOString().slice(0, 7),
  );

  // --- LÓGICA DE PUNTOS POR CAMPAÑA ---
  const calcularPuntos = (venta) => {
    const proy = venta.proyecto?.toUpperCase();
    if (proy === "LIDERES") return 2.5;
    if (proy === "SANDETEL") return 1.0;
    return 1.5; // Por defecto CLM
  };

  const ventasFinalizadasMes = leads.filter(
    (l) =>
      l.status === "finalizado" &&
      l.fechaFinClase &&
      l.fechaFinClase.startsWith(mesSeleccionado),
  );

  const puntosTotales = ventasFinalizadasMes.reduce(
    (acc, current) => acc + calcularPuntos(current),
    0,
  );

  // Escala de comisiones (Jeff, puedes ajustar estos valores según el tramo de cada campaña)
  let valorPorPunto = 0;
  if (puntosTotales >= 28) valorPorPunto = 75.0;
  else if (puntosTotales >= 24) valorPorPunto = 62.5;
  else if (puntosTotales >= 20) valorPorPunto = 50.0;
  else if (puntosTotales >= 16) valorPorPunto = 37.5;
  else if (puntosTotales >= 12) valorPorPunto = 25.0;
  else if (puntosTotales >= 8) valorPorPunto = 20.0;

  const comisionTotal = puntosTotales * valorPorPunto;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase italic">
            Rendimiento: {mesSeleccionado}
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase">
            Consolidado de Campañas Jeff
          </p>
        </div>
        <input
          type="month"
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="bg-white text-indigo-700 font-bold text-xs px-4 py-2 rounded-xl border border-indigo-100 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase">
            Ventas Totales
          </p>
          <h3 className="text-4xl font-black text-slate-800 mt-2">
            {ventasFinalizadasMes.length}
          </h3>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-indigo-500 uppercase">
            Puntos Logrados
          </p>
          <h3 className="text-4xl font-black text-indigo-600 mt-2">
            {puntosTotales.toFixed(1)}
          </h3>
        </div>
        <div className="bg-emerald-500 rounded-[2rem] p-6 shadow-xl text-white col-span-2">
          <p className="text-[10px] font-black uppercase text-emerald-100">
            Comisión Estimada (Total)
          </p>
          <h3 className="text-4xl font-black mt-2">
            S/. {comisionTotal.toLocaleString("es-PE")}
          </h3>
        </div>
      </div>

      {/* Desglose por Proyecto */}
      <div className="grid grid-cols-3 gap-4">
        {["CLM", "Lideres", "Sandetel"].map((p) => {
          const v = ventasFinalizadasMes.filter(
            (l) => (l.proyecto || "CLM") === p,
          );
          const pts = v.reduce((acc, curr) => acc + calcularPuntos(curr), 0);
          return (
            <div
              key={p}
              className="bg-slate-50 p-5 rounded-3xl border border-slate-100 text-center"
            >
              <p className="text-[9px] font-black text-slate-400 uppercase mb-2">
                {p}
              </p>
              <p className="text-xl font-black text-slate-700">
                {v.length}{" "}
                <span className="text-[10px] opacity-50">Ventas</span>
              </p>
              <p className="text-xs font-bold text-indigo-500">
                {pts.toFixed(1)} pts
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
