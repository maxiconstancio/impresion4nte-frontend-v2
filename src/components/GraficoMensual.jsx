import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList, Cell, ReferenceLine
} from "recharts";

export default function GraficoMensual() {
  const [datos, setDatos] = useState([]);
  const [agrupado, setAgrupado] = useState("mes");

  useEffect(() => {
    async function cargarDatos() {
      try {
        const res = await api.get("/dashboard/resumen-mensual-financiero");
        setDatos(res.data);
      } catch (error) {
        console.error("Error al cargar gráfico mensual:", error);
      }
    }

    cargarDatos();
  }, []);

  const agruparDatos = (datos) => {
    const agrupados = {};

    datos.forEach(({ mes, ingresos, gastos, neto }) => {
      const [anio, mesNum] = mes.split("-");
      let clave;

      if (agrupado === "mes") {
        clave = mes;
      } else if (agrupado === "trimestre") {
        const trimestre = Math.floor((parseInt(mesNum) - 1) / 3) + 1;
        clave = `${anio}-T${trimestre}`;
      } else if (agrupado === "anio") {
        clave = anio;
      }

      if (!agrupados[clave]) {
        agrupados[clave] = { mes: clave, ingresos: 0, gastos: 0, neto: 0 };
      }

      agrupados[clave].ingresos += ingresos;
      agrupados[clave].gastos += gastos;
      agrupados[clave].neto += neto;
    });

    return Object.values(agrupados)
      .map(d => ({
        ...d,
        porcentajeGasto: d.ingresos > 0 ? ((d.gastos / d.ingresos) * 100).toFixed(1) : null,
        porcentajeNeto: d.ingresos > 0 ? ((d.neto / d.ingresos) * 100).toFixed(1) : null,
      }))
      .sort((a, b) => a.mes.localeCompare(b.mes));
  };

  const datosAGraficar = agruparDatos(datos);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">📆 Resumen Financiero</h2>
        <select
          value={agrupado}
          onChange={(e) => setAgrupado(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="mes">Mensual</option>
          <option value="trimestre">Trimestral</option>
          <option value="anio">Anual</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datosAGraficar}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="4 4" />
          <Bar dataKey="ingresos" fill="#16a34a" name="Ingresos" />
          <Bar dataKey="gastos" fill="#dc2626" name="Gastos">
            <LabelList
              dataKey="porcentajeGasto"
              position="top"
              content={({ value }) => value ? `${value}%` : ""}
            />
          </Bar>
          <Bar dataKey="neto" name="Neto">
            {datosAGraficar.map((entry, index) => (
              <Cell
                key={`cell-neto-${index}`}
                fill={entry.neto >= 0 ? "#2563eb" : "#b91c1c"}
              />
            ))}
            <LabelList
              dataKey="porcentajeNeto"
              position="top"
              content={({ value }) => value ? `${value}%` : ""}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
