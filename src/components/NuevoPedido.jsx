import { useEffect, useState } from "react";
import api from "../services/api";

export default function NuevoPedido() {
  const [sugerencias, setSugerencias] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cliente, setCliente] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (busqueda.length >= 3) {
        const res = await api.get(`/productos?search=${busqueda}`);
        setSugerencias(res.data);
      } else {
        setSugerencias([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [busqueda]);

  const agregarProducto = (producto) => {
    const yaExiste = seleccionados.find((p) => p.id === producto.id);
    if (!yaExiste) {
      setSeleccionados([
        ...seleccionados,
        { ...producto, cantidad: 1, observaciones: "" },
      ]);
    }
    setBusqueda("");
    setSugerencias([]);
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
        nombre: p.nombre, // 🔹 agregado
        cantidad: p.cantidad,
        observaciones: p.observaciones,
        precio_unitario: parseFloat(p.precio_unitario),
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

      {/* Autocompletado */}
      <div className="relative w-full md:w-1/2">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        {sugerencias.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
            {sugerencias.map((p) => (
              <li
                key={p.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                onClick={() => agregarProducto(p)}
              >
                <span>{p.nombre}</span>
                <span className="text-sm text-gray-500">
                  ${parseFloat(p.precio_unitario).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
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
            <th className="px-4 py-2 text-left">Precio</th>
            <th className="px-4 py-2 text-left">Subtotal</th>
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
                ${parseFloat(p.precio_unitario).toFixed(2)}
              </td>
              <td className="px-4 py-2">
                ${(p.cantidad * p.precio_unitario).toFixed(2)}
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

    <div className="text-right mt-2 text-lg font-semibold">
      💰 Total: $
      {seleccionados
        .reduce((acc, p) => acc + p.cantidad * p.precio_unitario, 0)
        .toFixed(2)}
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
