import { useEffect, useState } from "react";
import { obtenerResumenCompleto, obtenerProximasCuotas } from "../services/dashboardService";
import api from "../services/api";
import GraficoMensual from "./GraficoMensual";
import GraficoVentasPorHora from "./GraficoVentasPorHora";

export default function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [cuotas, setCuotas] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const resumenData = await obtenerResumenCompleto();

        const cuotasData = await obtenerProximasCuotas();
        setResumen(resumenData);
        setCuotas(cuotasData);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      }
    }
    cargarDatos();
  }, []);

  const pagarCuota = async (id) => {
    try {
      await api.put(`/cuotas/pagar/${id}`);
      const cuotasData = await obtenerProximasCuotas();
      setCuotas(cuotasData);
    } catch (error) {
      console.error("Error al marcar cuota como pagada", error);
      alert("Error al registrar el pago.");
    }
  };

  if (!resumen) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 space-y-8 animate-fade">
      <h1 className="text-2xl font-bold">📊 Dashboard Financiero</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          color="bg-green-200"
          icon="💼"
          title="Ingresos Totales"
          value={resumen.ingresosTotales}
          textColor="text-green-800"
        />
        <Card
          color="bg-green-100"
          icon="💰"
          title="Ingresos del Mes"
          value={resumen.ingresosMes}
          textColor="text-green-700"
        />
        <Card
          color="bg-red-100"
          icon="💸"
          title="Gastos del Mes"
          value={resumen.gastosMes}
          textColor="text-red-700"
        />
        <Card
          color="bg-gray-100"
          icon="📈"
          title="Neto del Mes"
          value={resumen.netoMes}
          textColor="text-gray-800"
        />
        {/*<Card
          color="bg-blue-100"
          icon="🧾"
          title="Cuotas Pagadas"
          value={resumen.totalCuotasPagadas}
          textColor="text-blue-700"
        />*/}
        <Card
          color="bg-orange-100"
          icon="📆"
          title="Cuotas Pendientes"
          value={resumen.totalCuotasPendientes}
          textColor="text-orange-700"
        />
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">📅 Cuotas próximas a vencer</h2>
        {cuotas.length === 0 ? (
          <p className="text-gray-500">No hay cuotas próximas a vencer.</p>
        ) : (
          <ul className="space-y-2">
            {cuotas.map(cuota => (
              <li
                key={cuota.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b py-2"
              >
                <div>
                  <div className="font-medium">
                    #{cuota.numero_cuota} - {cuota.Gasto?.descripcion}
                  </div>
                  <div className="text-sm text-gray-500">
                    Vence: {cuota.fecha_vencimiento}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  {cuota.pagado ? (
                    <span className="text-green-600 text-sm font-semibold">
                      ✅ Pagado
                    </span>
                  ) : (
                    <>
                      <span className="text-yellow-600 text-sm">⏳ Pendiente</span>
                      <button
                        onClick={() => pagarCuota(cuota.id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Marcar como pagada
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <GraficoVentasPorHora />
      <GraficoMensual />
    </div>
  );
}

function Card({ icon, title, value, color, textColor }) {
  const safeValue = typeof value === "number" ? value : 0;

  return (
    <div className={`${color} rounded-xl shadow p-4 flex flex-col items-center text-center`}>
      <div className="text-3xl">{icon}</div>
      <h2 className="text-sm text-gray-500 mt-2">{title}</h2>
      <p className={`text-2xl font-bold mt-1 ${textColor}`}>${safeValue.toFixed(2)}</p>
    </div>
  );
}
