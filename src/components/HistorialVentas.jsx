import { useEffect, useState } from "react";
import api from "../services/api";

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState("");
  const [filtroDesde, setFiltroDesde] = useState("");
  const [filtroHasta, setFiltroHasta] = useState("");

  const cargarVentas = async () => {
    const res = await api.get("/ventas");
    setVentas(res.data);
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const ventasFiltradas = ventas.filter((v) => {
    const fechaOk =
      (!filtroDesde || v.fecha >= filtroDesde) &&
      (!filtroHasta || v.fecha <= filtroHasta);
    const tipoOk = !filtroTipo || v.tipo === filtroTipo;
    const metodoOk = !filtroMetodo || v.metodo_pago === filtroMetodo;
    return fechaOk && tipoOk && metodoOk;
  });

  const totalGeneral = ventasFiltradas.reduce(
    (sum, v) => sum + parseFloat(v.total),
    0
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">📄 Historial de Ventas</h2>

      <div className="grid md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm mb-1">📅 Desde</label>
          <input
            type="date"
            value={filtroDesde}
            onChange={(e) => setFiltroDesde(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">📅 Hasta</label>
          <input
            type="date"
            value={filtroHasta}
            onChange={(e) => setFiltroHasta(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">🛍️ Tipo</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Todos</option>
            <option value="feria">Feria</option>
            <option value="pedido">Pedido</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">💳 Método</label>
          <select
            value={filtroMetodo}
            onChange={(e) => setFiltroMetodo(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Todos</option>
            <option value="efectivo">Efectivo</option>
            <option value="debito">Débito</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setFiltroDesde("");
              setFiltroHasta("");
              setFiltroTipo("");
              setFiltroMetodo("");
            }}
            className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Método</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Productos</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.map((v) => (
              <tr key={v.id} className="border-t align-top">
                <td className="px-4 py-2 whitespace-nowrap">{v.fecha}</td>
                <td className="px-4 py-2">{v.tipo}</td>
                <td className="px-4 py-2">{v.metodo_pago}</td>
                <td className="px-4 py-2 font-semibold">${parseFloat(v.total).toFixed(2)}</td>
                <td className="px-4 py-2">
                  <ul className="list-disc ml-5 space-y-1">
                    {v.productos.map((vp) => (
                      <li key={vp.id}>
                        {vp.producto?.nombre} × {vp.cantidad} = ${(
                          parseFloat(vp.precio_unitario) * vp.cantidad
                        ).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-right text-lg font-semibold space-y-2">
        <div>🧾 Total ventas filtradas: ${totalGeneral.toFixed(2)}</div>
      </div>
    </div>
  );
}
