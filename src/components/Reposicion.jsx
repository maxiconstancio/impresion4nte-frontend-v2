import { useEffect, useState } from "react";
import api from "../services/api";

export default function Reposicion() {
  const [productos, setProductos] = useState([]);

  const cargarReposicion = async () => {
    const res = await api.get("/reposicion");
    setProductos(res.data);
  };

  useEffect(() => {
    cargarReposicion();
  }, []);

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold">📦 Productos a reponer</h2>

      {/* Mobile view */}
      <div className="grid gap-4 sm:hidden">
        {productos.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow space-y-2 text-sm">
            <div><strong>{p.nombre}</strong></div>
            <div>Stock actual: <span className="font-semibold">{p.stock}</span></div>
            <div>Mínimo requerido: <span className="text-red-600">{p.stock_minimo}</span></div>
            <div className="text-xs text-gray-500">{p.descripcion}</div>
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Stock mínimo</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">{p.descripcion}</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2 text-red-600">{p.stock_minimo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
