import { useEffect, useState } from "react";
import api from "../services/api";
import ModalEditarPresupuesto from "./ModalEditarPresupuesto";

export default function ListadoPresupuestos() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [presupuestoEditar, setPresupuestoEditar] = useState(null);

  const cargarPresupuestos = async () => {
    const res = await api.get("/pedidos/presupuestos");
    setPresupuestos(res.data);
  };

  const confirmarPresupuesto = async (id) => {
    const confirmar = window.confirm("¿Confirmar presupuesto como pedido?");
    if (!confirmar) return;
    await api.put(`/pedidos/${id}`, { estado: "pendiente" });
    cargarPresupuestos();
  };

  const cancelarPresupuesto = async (id) => {
    const confirmar = window.confirm("¿Cancelar este presupuesto?");
    if (!confirmar) return;
    await api.put(`/pedidos/${id}`, { estado: "cancelado" });
    cargarPresupuestos();
  };

  const eliminarPresupuesto = async (id) => {
    const confirmar = window.confirm("¿Eliminar este presupuesto permanentemente?");
    if (!confirmar) return;
    await api.delete(`/pedidos/${id}`);
    cargarPresupuestos();
  };

  useEffect(() => {
    cargarPresupuestos();
  }, []);

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold">📋 Presupuestos pendientes</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Cliente</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {presupuestos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.cliente}</td>
                <td className="px-4 py-2">{new Date(p.fecha).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-right">
                  ${p.Productos?.reduce((sum, prod) => {
                    const precio = parseFloat(prod.PedidoProducto?.precio_unitario ?? 0);
                    const cantidad = parseInt(prod.PedidoProducto?.cantidad) || 0;
                    return sum + precio * cantidad;
                  }, 0).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center space-x-1">
                  <button
                    onClick={() => confirmarPresupuesto(p.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    title="Confirmar"
                  >
                    ✅
                  </button>
                  <button
                    onClick={() => setPresupuestoEditar(p)}
                    className="bg-indigo-600 text-white px-2 py-1 rounded"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => cancelarPresupuesto(p.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    title="Cancelar"
                  >
                    ⛔
                  </button>
                  <button
                    onClick={() => eliminarPresupuesto(p.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {presupuestoEditar && (
        <ModalEditarPresupuesto
          presupuesto={presupuestoEditar}
          onClose={() => setPresupuestoEditar(null)}
          onGuardado={cargarPresupuestos}
        />
      )}
    </div>
  );
}
