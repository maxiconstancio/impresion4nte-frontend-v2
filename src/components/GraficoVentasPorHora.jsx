import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function GraficoVentasPorHora() {
  const [data, setData] = useState([]);
  const [tipo, setTipo] = useState("feria");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const cargarVentasAgrupadas = async () => {
    try {
      const params = {};
      if (tipo && tipo !== "todos") params.tipo = tipo;
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;

      const res = await api.get("/ventas/por-hora", { params });
      setData(res.data);
    } catch (err) {
      console.error("Error al cargar ventas por hora", err);
    }
  };

  useEffect(() => {
    cargarVentasAgrupadas();
  }, []);

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold">📊 Ventas por hora del día</h2>

      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div>
          <label className="text-sm font-medium">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="todos">Todos</option>
            <option value="feria">Feria</option>
            <option value="pedido">Pedido</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <button
          onClick={cargarVentasAgrupadas}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filtrar
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hora" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
