import React, { useMemo } from "react";

export default function ReportsView({ leads }) {
  // Lógica de cálculo financiero
  const { totalPuntos, totalFinalizados, pagosAgrupados, desgloseGlobal } =
    useMemo(() => {
      // 1. Filtramos solo a los alumnos que ya terminaron y tienen fecha de fin
      const finalizados = leads.filter(
        (l) => l.status === "finalizado" && l.fechaFinClase,
      );

      let puntos = 0;
      const pagosMes = {};
      const global = {
        CLM: { pts: 0, count: 0 },
        Lideres: { pts: 0, count: 0 },
        Sandetel: { pts: 0, count: 0 },
      };

      finalizados.forEach((lead) => {
        // 2. Asignación de Puntos por Campaña
        const proj = lead.proyecto || "CLM";
        let valorPunto = 1.5; // Por defecto CLM
        if (proj === "Sandetel") valorPunto = 1.0;
        if (proj === "Lideres") valorPunto = 2.5;

        puntos += valorPunto;

        // Suma al global
        if (global[proj]) {
          global[proj].pts += valorPunto;
          global[proj].count += 1;
        }

        // 3. Cálculo de la Fecha de Pago (Último día del MES SIGUIENTE)
        const finDate = new Date(lead.fechaFinClase);
        const year = finDate.getFullYear();
        const month = finDate.getMonth(); // 0-11

        // Calculamos el mes y año de pago (es el mes siguiente)
        const paymentYear = month === 11 ? year + 1 : year;
        const paymentMonth = month === 11 ? 0 : month + 1;

        // Truco JS: Pasarle día 0 al constructor nos da el ÚLTIMO día del mes anterior (es decir, el último del paymentMonth)
        const fechaPagoObj = new Date(paymentYear, paymentMonth + 1, 0);

        const mesNombres = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];
        const key = `${paymentYear}-${String(paymentMonth + 1).padStart(2, "0")}`; // ej: "2026-03"

        if (!pagosMes[key]) {
          pagosMes[key] = {
            id: key,
            mesTexto: `${mesNombres[paymentMonth]} ${paymentYear}`,
            fechaPagoRaw: fechaPagoObj,
            fechaPagoAprox: fechaPagoObj.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }),
            totalPuntos: 0,
            totalAlumnos: 0,
            desglose: {
              CLM: { pts: 0, count: 0 },
              Lideres: { pts: 0, count: 0 },
              Sandetel: { pts: 0, count: 0 },
            },
          };
        }

        // Agregamos los valores al mes correspondiente
        pagosMes[key].totalPuntos += valorPunto;
        pagosMes[key].totalAlumnos += 1;
        if (pagosMes[key].desglose[proj]) {
          pagosMes[key].desglose[proj].pts += valorPunto;
          pagosMes[key].desglose[proj].count += 1;
        }
      });

      // Ordenamos cronológicamente
      const pagosArray = Object.values(pagosMes).sort(
        (a, b) => a.fechaPagoRaw - b.fechaPagoRaw,
      );

      return {
        totalPuntos: puntos,
        totalFinalizados: finalizados.length,
        pagosAgrupados: pagosArray,
        desgloseGlobal: global,
      };
    }, [leads]);

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto custom-scroll-y pb-20 animate-in fade-in duration-300">
      {/* HEADER DE REPORTES */}
      <div className="flex flex-col gap-1 shrink-0 px-2">
        <h2 className="text-xl font-black text-slate-800 uppercase italic leading-none">
          Dashboard Financiero
        </h2>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
          Proyección de Pagos y Rendimiento
        </p>
      </div>

      {/* TARJETAS DE KPIs (Métricas principales) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-2 shrink-0">
        <div className="bg-slate-800 text-white p-5 rounded-[1.5rem] shadow-xl shadow-slate-200 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 z-10">
            Puntos Totales Generados
          </span>
          <span className="text-4xl font-black tracking-tighter z-10">
            {totalPuntos.toFixed(1)}
          </span>
        </div>

        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Total CLM (1.5 pts)
            </span>
            <span className="bg-indigo-50 text-indigo-500 text-[8px] font-black px-2 py-0.5 rounded-lg">
              {desgloseGlobal.CLM.count} Alumnos
            </span>
          </div>
          <span className="text-2xl font-black text-indigo-600">
            {desgloseGlobal.CLM.pts.toFixed(1)}{" "}
            <span className="text-[10px] text-slate-400">pts</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Total Líderes (2.5 pts)
            </span>
            <span className="bg-amber-50 text-amber-500 text-[8px] font-black px-2 py-0.5 rounded-lg">
              {desgloseGlobal.Lideres.count} Alumnos
            </span>
          </div>
          <span className="text-2xl font-black text-amber-500">
            {desgloseGlobal.Lideres.pts.toFixed(1)}{" "}
            <span className="text-[10px] text-slate-400">pts</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Total Sandetel (1.0 pts)
            </span>
            <span className="bg-cyan-50 text-cyan-500 text-[8px] font-black px-2 py-0.5 rounded-lg">
              {desgloseGlobal.Sandetel.count} Alumnos
            </span>
          </div>
          <span className="text-2xl font-black text-cyan-500">
            {desgloseGlobal.Sandetel.pts.toFixed(1)}{" "}
            <span className="text-[10px] text-slate-400">pts</span>
          </span>
        </div>
      </div>

      {/* PROYECCIÓN DE PAGOS MENSUALES */}
      <div className="flex flex-col flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-100 mx-2 p-6 overflow-hidden">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">
          Proyección de Pagos Mensuales
        </h3>

        {pagosAgrupados.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-[10px] font-black uppercase tracking-widest">
              No hay alumnos finalizados aún.
            </p>
            <p className="text-[8px] font-bold mt-2">
              Los pagos se agrupan automáticamente al marcar un curso como
              finalizado.
            </p>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto custom-scroll-y pr-2">
            {pagosAgrupados.map((pago) => {
              // Calcular porcentajes para la barra visual
              const pctCLM =
                (pago.desglose.CLM.pts / pago.totalPuntos) * 100 || 0;
              const pctLideres =
                (pago.desglose.Lideres.pts / pago.totalPuntos) * 100 || 0;
              const pctSandetel =
                (pago.desglose.Sandetel.pts / pago.totalPuntos) * 100 || 0;

              return (
                <div
                  key={pago.id}
                  className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100 flex flex-col md:flex-row gap-6 items-center"
                >
                  {/* Fecha y Resumen */}
                  <div className="w-full md:w-1/3 flex flex-col">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Día de pago: {pago.fechaPagoAprox}
                    </span>
                    <h4 className="text-lg font-black text-slate-800 uppercase leading-none mt-1">
                      Corte {pago.mesTexto}
                    </h4>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                        <span className="text-[9px] font-black text-slate-400 uppercase">
                          Puntos:
                        </span>
                        <span className="text-xs font-black text-slate-800">
                          {pago.totalPuntos.toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                        <span className="text-[9px] font-black text-slate-400 uppercase">
                          Alumnos:
                        </span>
                        <span className="text-xs font-black text-slate-800">
                          {pago.totalAlumnos}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barra Visual y Desglose */}
                  <div className="w-full md:w-2/3 flex flex-col gap-3">
                    {/* Barra de progreso combinada */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                      {pctCLM > 0 && (
                        <div
                          style={{ width: `${pctCLM}%` }}
                          className="h-full bg-indigo-500 transition-all duration-1000"
                        ></div>
                      )}
                      {pctLideres > 0 && (
                        <div
                          style={{ width: `${pctLideres}%` }}
                          className="h-full bg-amber-400 transition-all duration-1000"
                        ></div>
                      )}
                      {pctSandetel > 0 && (
                        <div
                          style={{ width: `${pctSandetel}%` }}
                          className="h-full bg-cyan-500 transition-all duration-1000"
                        ></div>
                      )}
                    </div>

                    {/* Detalle por campaña */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white p-2 rounded-xl border border-slate-100 flex flex-col shadow-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                          <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
                            CLM
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-slate-700">
                          {pago.desglose.CLM.pts.toFixed(1)} pts
                        </span>
                        <span className="text-[7.5px] font-bold text-slate-400">
                          {pago.desglose.CLM.count} alumnos
                        </span>
                      </div>

                      <div className="bg-white p-2 rounded-xl border border-slate-100 flex flex-col shadow-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                          <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
                            Líderes
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-slate-700">
                          {pago.desglose.Lideres.pts.toFixed(1)} pts
                        </span>
                        <span className="text-[7.5px] font-bold text-slate-400">
                          {pago.desglose.Lideres.count} alumnos
                        </span>
                      </div>

                      <div className="bg-white p-2 rounded-xl border border-slate-100 flex flex-col shadow-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                          <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
                            Sandetel
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-slate-700">
                          {pago.desglose.Sandetel.pts.toFixed(1)} pts
                        </span>
                        <span className="text-[7.5px] font-bold text-slate-400">
                          {pago.desglose.Sandetel.count} alumnos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
