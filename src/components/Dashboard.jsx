import { useEffect, useState } from "react";
import { obtenerResumen, obtenerProximasCuotas } from "../services/dashboardService";
import GraficoMensual from "./GraficoMensual";
import GraficoVentasPorHora from "./GraficoVentasPorHora";

export default function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [cuotas, setCuotas] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const resumenData = await obtenerResumen();
        const cuotasData = await obtenerProximasCuotas();
        setResumen(resumenData);
        setCuotas(cuotasData);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      }
    }
    cargarDatos();
  }, []);

  if (!resumen) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 space-y-8 animate-fade">
      <h1 className="text-2xl font-bold">📊 Dashboard Financiero</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          color="bg-green-100"
          icon="💰"
          title="Total Ingresos"
          value={resumen.totalIngresos}
          textColor="text-green-700"
        />
        <Card
          color="bg-red-100"
          icon="💸"
          title="Total Gastos"
          value={resumen.totalGastos}
          textColor="text-red-700"
        />
        <Card
          color="bg-gray-100"
          icon="💼"
          title="Total Neto"
          value={resumen.totalNeto}
          textColor="text-gray-800"
        />
        <Card
          color="bg-blue-100"
          icon="🧾"
          title="Cuotas Pagadas"
          value={resumen.totalCuotasPagadas}
          textColor="text-blue-700"
        />
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
          <ul className="space-y-1">
            {cuotas.map(cuota => (
              <li key={cuota.id} className="flex justify-between border-b pb-1">
                <span>Cuota #{cuota.numero_cuota} - {cuota.Gasto?.descripcion}</span>
                <span className="text-sm text-gray-600">{cuota.fecha_vencimiento}</span>
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
  return (
    <div className={`${color} rounded-xl shadow p-4 flex flex-col items-center text-center`}>
      <div className="text-3xl">{icon}</div>
      <h2 className="text-sm text-gray-500 mt-2">{title}</h2>
      <p className={`text-2xl font-bold mt-1 ${textColor}`}>${value.toFixed(2)}</p>
    </div>
  );
}
