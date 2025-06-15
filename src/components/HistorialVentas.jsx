
import { useEffect, useState } from "react";
import api from "../services/api";
import ModalEditarVenta from "./ModalEditarVenta";

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState("");
  const [filtroDesde, setFiltroDesde] = useState("");
  const [filtroHasta, setFiltroHasta] = useState("");

  const cargarVentas = async () => {
    const res = await api.get("/ventas");
    setVentas(res.data);
  };

  const eliminarVenta = async (id) => {
    if (confirm("¿Estás seguro de que querés eliminar esta venta?")) {
      await api.delete(`/ventas/${id}`);
      await cargarVentas();
    }
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
      <h2 className="text-2xl font-bold text-gray-800">📄 Historial de Ventas</h2>

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
            <option value="mercadopago">Transferencia</option>
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

      {/* VISTA DESKTOP */}
      <div className="hidden sm:block overflow-x-auto rounded-xl shadow border border-gray-200">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">🕒 Fecha</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Método</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2">🧾 Productos</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.map((v) => (
              <tr key={v.id} className="border-t odd:bg-gray-50 hover:bg-blue-50">
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(v.fecha).toLocaleString("es-AR", {
                    timeZone: "America/Argentina/Buenos_Aires",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    v.tipo === "feria" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>{v.tipo}</span>
                </td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    v.metodo_pago === "efectivo" ? "bg-yellow-100 text-yellow-800"
                      : v.metodo_pago === "debito" ? "bg-indigo-100 text-indigo-800"
                      : "bg-purple-100 text-purple-800"
                  }`}>{v.metodo_pago}</span>
                </td>
                <td className="px-4 py-2 text-right font-semibold">
                  ${parseFloat(v.total).toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  <ul className="ml-2 space-y-1 list-disc text-sm">
                    {v.productos.map((vp) => (
                      <li key={vp.id}>
                        {vp.producto?.nombre} × {vp.cantidad} ={" "}
                        <strong>${(vp.precio_unitario * vp.cantidad).toFixed(2)}</strong>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 text-center whitespace-nowrap space-x-2">
                  <button onClick={() => setVentaSeleccionada(v)} className="text-blue-600 text-sm">✏️</button>
                  <button onClick={() => eliminarVenta(v.id)} className="text-red-600 text-sm">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VISTA MOBILE */}
      <div className="sm:hidden space-y-4">
        {ventasFiltradas.map((v) => (
          <div key={v.id} className="border rounded shadow p-3 bg-white">
            <div className="text-sm text-gray-500 mb-1">
              {new Date(v.fecha).toLocaleString("es-AR", {
                timeZone: "America/Argentina/Buenos_Aires",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                v.tipo === "feria" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}>{v.tipo}</span>
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                v.metodo_pago === "efectivo" ? "bg-yellow-100 text-yellow-800"
                  : v.metodo_pago === "debito" ? "bg-indigo-100 text-indigo-800"
                  : "bg-purple-100 text-purple-800"
              }`}>{v.metodo_pago}</span>
              <span className="text-sm font-bold text-right">
                ${parseFloat(v.total).toFixed(2)}
              </span>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {v.productos.map((vp) => (
                <li key={vp.id}>
                  {vp.producto?.nombre} × {vp.cantidad} ={" "}
                  <strong>${(vp.precio_unitario * vp.cantidad).toFixed(2)}</strong>
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-3 mt-3">
              <button onClick={() => setVentaSeleccionada(v)} className="text-blue-600 text-sm">✏️ Editar</button>
              <button onClick={() => eliminarVenta(v.id)} className="text-red-600 text-sm">🗑️ Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right text-lg font-semibold space-y-2">
        <div>🧾 Total ventas filtradas: ${totalGeneral.toFixed(2)}</div>
      </div>

      {ventaSeleccionada && (
        <ModalEditarVenta
          venta={ventaSeleccionada}
          onClose={() => setVentaSeleccionada(null)}
          onGuardado={cargarVentas}
        />
      )}
    </div>
  );
}
