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
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Financiero</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">💰 Total Ingresos</h2>
          <p className="text-xl font-semibold text-green-600">${resumen.totalIngresos.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">💸 Total Gastos</h2>
          <p className="text-xl font-semibold text-red-600">${resumen.totalGastos.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">💼 Neto</h2>
          <p className="text-xl font-semibold">${resumen.totalNeto.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">🧾 Cuotas Pagadas</h2>
          <p className="text-xl font-semibold text-green-600">${resumen.totalCuotasPagadas.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm text-gray-500">📆 Cuotas Pendientes</h2>
          <p className="text-xl font-semibold text-orange-500">${resumen.totalCuotasPendientes.toFixed(2)}</p>
        </div>
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
