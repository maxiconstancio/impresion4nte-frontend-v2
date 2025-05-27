import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function GraficoVentasPorHora() {
  const [data, setData] = useState([]);

  useEffect(() => {
    cargarVentasAgrupadas();
  }, []);

  const cargarVentasAgrupadas = async () => {
    const res = await api.get("/ventas");
    const agrupadas = Array(24).fill(0);

    res.data.forEach((venta) => {
      const hora = new Date(venta.fecha).getHours(); // usa la hora real
      agrupadas[hora] += parseFloat(venta.total);
    });

    const formateado = agrupadas.map((valor, i) => ({
      hora: `${i}:00`,
      total: valor
    }));

    setData(formateado);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">📊 Ventas por hora del día</h2>
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
