import { useEffect, useState } from "react";
import api from "../services/api";

export default function HistorialPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    const res = await api.get("/pedidos");
    setPedidos(res.data);
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await api.put(`/pedidos/${id}`, { estado: nuevoEstado });

      if (nuevoEstado === "pagado") {
        const pedido = pedidos.find((p) => p.id === id);

        if (pedido && pedido.Productos?.length) {
          const productos = pedido.Productos.map((prod) => ({
            producto_id: prod.id,
            cantidad: prod.PedidoProducto?.cantidad || 1,
            precio_unitario:
              parseFloat(prod.PedidoProducto?.precio_unitario ?? prod.precio_unitario) || 0,
          }));
          console.log(productos)
          await api.post("/ventas", {
            tipo: "pedido",
            metodo_pago: "efectivo",
            fecha: new Date().toISOString(),
            cliente: pedido.cliente,
            comentarios: `Venta generada automáticamente desde pedido #${pedido.id}`,
            productos,
            noAjustarStock: true,
          });
        }
      }

      cargarPedidos();
    } catch (err) {
      console.error("Error al actualizar estado o registrar venta:", err);
    }
  };

  const estados = [
    "pendiente",
    "en_producción",
    "listo",
    "entregado",
    "cancelado",
    "pagado",
  ];

  const obtenerClaseColor = (estado) => {
    return {
      pendiente: "bg-yellow-50",
      en_producción: "bg-blue-50",
      listo: "bg-indigo-50",
      entregado: "bg-green-50",
      cancelado: "bg-red-50",
      pagado: "bg-emerald-50",
    }[estado] || "";
  };

  const estadoBadge = (estado) => {
    const estilos = {
      pendiente: "text-yellow-800 bg-yellow-200",
      en_producción: "text-blue-800 bg-blue-200",
      listo: "text-indigo-800 bg-indigo-200",
      entregado: "text-green-800 bg-green-200",
      cancelado: "text-red-800 bg-red-200",
      pagado: "text-emerald-800 bg-emerald-200",
    };

    const iconos = {
      pendiente: "🕓",
      en_producción: "⚙️",
      listo: "📦",
      entregado: "✅",
      cancelado: "❌",
      pagado: "💵",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${estilos[estado]}`}
      >
        {iconos[estado]} {estado.replaceAll("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold">📦 Seguimiento de Pedidos</h2>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="todos">Todos</option>
          {estados.map((estado) => (
            <option key={estado} value={estado}>
              {estado.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Cliente</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2">Cambiar estado</th>
              <th className="px-4 py-2">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {pedidos
              .filter((p) => filtroEstado === "todos" || p.estado === filtroEstado)
              .map((p) => (
                <tr key={p.id} className={`border-t ${obtenerClaseColor(p.estado)}`}>
                  <td className="px-4 py-2">{p.cliente}</td>
                  <td className="px-4 py-2">
                    {new Date(p.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{estadoBadge(p.estado)}</td>
                  <td className="px-4 py-2 text-right">
                    $
                    {p.Productos?.reduce((sum, prod) => {
                      const precio =
                        parseFloat(
                          prod.PedidoProducto?.precio_unitario ??
                          prod.precio_unitario
                        ) || 0;
                      const cantidad = parseInt(prod.PedidoProducto?.cantidad) || 0;
                      return sum + precio * cantidad;
                    }, 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={p.estado}
                      onChange={(e) => {
                        const nuevoEstado = e.target.value;
                        const confirmar = window.confirm(
                          `¿Cambiar estado a "${nuevoEstado}"?`
                        );
                        if (confirmar) {
                          actualizarEstado(p.id, nuevoEstado);
                        }
                      }}
                      disabled={p.estado === "pagado"|| p.estado === "entregado"}
                      className={`border rounded px-2 py-1 ${p.estado === "pagado" || p.estado === "entregado" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
                        }`}
                    >
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setPedidoDetalle(p);
                        setMostrarDetalle(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      🧾 Ver
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {mostrarDetalle && pedidoDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">🧾 Detalle del pedido</h3>
            <p><strong>Cliente:</strong> {pedidoDetalle.cliente}</p>
            <p><strong>Estado:</strong> {pedidoDetalle.estado}</p>
            <p><strong>Fecha:</strong> {new Date(pedidoDetalle.fecha).toLocaleDateString()}</p>

            <div className="border-t pt-2">
              {pedidoDetalle.Productos?.map((prod) => (
                <div key={prod.id} className="text-sm border-b py-1">
                  <strong>{prod.nombre}</strong> – Cantidad: {prod.PedidoProducto.cantidad}
                  {prod.PedidoProducto.observaciones && (
                    <div className="text-gray-600 text-xs">
                      📝 {prod.PedidoProducto.observaciones}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-right">
              <button
                onClick={() => setMostrarDetalle(false)}
                className="mt-2 bg-gray-200 px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
