import { useEffect, useState } from "react";
import api from "../services/api";

export default function StockValorizado() {
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [orden, setOrden] = useState({ campo: "nombre", asc: true });

  useEffect(() => {
    async function cargarDatos() {
      try {
        const res = await api.get("/productos/stock-valorizado");
        setProductos(res.data.productos);
        setTotal(res.data.total);
      } catch (error) {
        console.error("Error al cargar stock valorizado:", error);
      }
    }

    cargarDatos();
  }, []);

  const ordenar = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true,
    }));
  };

  const productosOrdenados = [...productos].sort((a, b) => {
    const dir = orden.asc ? 1 : -1;
    if (typeof a[orden.campo] === "string") {
      return a[orden.campo].localeCompare(b[orden.campo]) * dir;
    }
    return (a[orden.campo] - b[orden.campo]) * dir;
  });

  const iconoOrden = (campo) => {
    if (orden.campo !== campo) return "⇅";
    return orden.asc ? "↑" : "↓";
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">📦 Stock Valorizado</h1>

      {/* Card de total valorizado */}
      <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl p-4 shadow text-lg font-semibold flex items-center justify-between">
        <span>Total valorizado en stock:</span>
        <span className="text-2xl">${total.toFixed(2)}</span>
      </div>

      {/* Tabla en escritorio */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-md border">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b">
            <tr>
              <th className="px-4 py-3 cursor-pointer text-left" onClick={() => ordenar("nombre")}>
                Producto {iconoOrden("nombre")}
              </th>
              <th className="px-4 py-3 cursor-pointer text-right" onClick={() => ordenar("stock")}>
                Stock {iconoOrden("stock")}
              </th>
              <th className="px-4 py-3 cursor-pointer text-right" onClick={() => ordenar("precio_unitario")}>
                Precio Unitario {iconoOrden("precio_unitario")}
              </th>
              <th className="px-4 py-3 cursor-pointer text-right" onClick={() => ordenar("valor_total")}>
                Valor Total {iconoOrden("valor_total")}
              </th>
            </tr>
          </thead>
          <tbody>
            {productosOrdenados.map((p, i) => (
              <tr
                key={p.id}
                className={`border-b hover:bg-gray-50 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-4 py-3 font-medium">{p.nombre}</td>
                <td className="px-4 py-3 text-right">{p.stock}</td>
                <td className="px-4 py-3 text-right">${p.precio_unitario.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                  ${p.valor_total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas en mobile */}
      <div className="md:hidden space-y-4">
        {productosOrdenados.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4 border space-y-1">
            <h2 className="text-base font-semibold text-gray-800">{p.nombre}</h2>
            <p className="text-sm">📦 Stock: <span className="font-medium">{p.stock}</span></p>
            <p className="text-sm">💲 Precio unitario: ${p.precio_unitario.toFixed(2)}</p>
            <p className="text-sm font-bold text-indigo-700">
              💰 Valor total: ${p.valor_total.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
