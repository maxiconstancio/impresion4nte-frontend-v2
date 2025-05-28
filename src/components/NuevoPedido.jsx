import { useEffect, useState } from "react";
import api from "../services/api";

export default function NuevoPedido() {
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cliente, setCliente] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      const res = await api.get("/productos");
      setProductos(res.data);
    };
    cargarProductos();
  }, []);

  const agregarProducto = (producto) => {
    const yaExiste = seleccionados.find((p) => p.id === producto.id);
    if (!yaExiste) {
      setSeleccionados([
        ...seleccionados,
        { ...producto, cantidad: 1, observaciones: "" },
      ]);
    }
  };

  const actualizarSeleccionado = (id, campo, valor) => {
    setSeleccionados((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  const eliminarProducto = (id) => {
    setSeleccionados((prev) => prev.filter((p) => p.id !== id));
  };

  const guardarPedido = async () => {
    const pedido = {
      cliente,
      comentarios,
      productos: seleccionados.map((p) => ({
        id: p.id,
        cantidad: p.cantidad,
        observaciones: p.observaciones,
      })),
    };
    await api.post("/pedidos", pedido);
    alert("Pedido guardado");
    setCliente("");
    setComentarios("");
    setSeleccionados([]);
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold">📝 Nuevo Pedido</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <textarea
          placeholder="Comentarios"
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {/* Buscador + listado de productos */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Agregar</th>
              </tr>
            </thead>
            <tbody>
              {productos
                .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
                .map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.nombre}</td>
                    <td className="px-4 py-2">{p.descripcion}</td>
                    <td className="px-4 py-2">${parseFloat(p.precio_unitario).toFixed(2)}</td>
                    <td className="px-4 py-2">{p.stock}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => agregarProducto(p)}
                        className="text-blue-600 hover:underline"
                      >
                        ➕
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Productos en el pedido */}
      {seleccionados.length > 0 && (
        <>
          <h3 className="font-semibold">🧾 Productos en el pedido</h3>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Producto</th>
                  <th className="px-4 py-2 text-left">Cantidad</th>
                  <th className="px-4 py-2 text-left">Observaciones</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {seleccionados.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.nombre}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={p.cantidad}
                        min={1}
                        onChange={(e) =>
                          actualizarSeleccionado(p.id, "cantidad", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-20"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={p.observaciones}
                        onChange={(e) =>
                          actualizarSeleccionado(p.id, "observaciones", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => eliminarProducto(p.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={guardarPedido}
            className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
          >
            Confirmar pedido
          </button>
        </>
      )}
    </div>
  );
}
