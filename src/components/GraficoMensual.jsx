import { useEffect, useState } from "react";
import { obtenerEvolucionMensual } from "../services/dashboardService";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

export default function GraficoMensual() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerEvolucionMensual();
        setDatos(data);
      } catch (error) {
        console.error("Error cargando evolución mensual:", error);
      }
    }
    cargarDatos();
  }, []);

  if (datos.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">📊 Evolución mensual</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ingresos" stroke="#16a34a" name="Ingresos" />
          <Line type="monotone" dataKey="gastos" stroke="#dc2626" name="Gastos" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
