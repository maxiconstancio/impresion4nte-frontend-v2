import { useEffect, useState } from "react";
import api from "../services/api";

export default function NuevaVenta() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [venta, setVenta] = useState({
    tipo: "feria",
    metodo_pago: "efectivo",
    fecha: new Date().toISOString().slice(0, 10),
    items: []
  });

  const cargarProductos = async () => {
    const res = await api.get("/productos");
    setProductos(res.data.filter(p => p.activo && p.stock > 0));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarItem = (producto) => {
    if (venta.items.find(i => i.producto_id === producto.id)) return;
    setVenta({
      ...venta,
      items: [
        ...venta.items,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio_unitario: parseFloat(producto.precio_unitario),
          cantidad: 1
        }
      ]
    });
  };

  const actualizarCantidad = (producto_id, cantidad) => {
    setVenta({
      ...venta,
      items: venta.items.map(i =>
        i.producto_id === producto_id ? { ...i, cantidad: parseInt(cantidad) } : i
      )
    });
  };

  const eliminarItem = (producto_id) => {
    setVenta({ ...venta, items: venta.items.filter(i => i.producto_id !== producto_id) });
  };

  const total = venta.items.reduce((sum, i) => sum + i.precio_unitario * i.cantidad, 0).toFixed(2);

  const guardarVenta = async (e) => {
    e.preventDefault();
    await api.post("/ventas", {
      tipo: venta.tipo,
      metodo_pago: venta.metodo_pago,
      fecha: venta.fecha,
      productos: venta.items
    });
    alert("Venta guardada");
    setVenta({
      tipo: "feria",
      metodo_pago: "efectivo",
      fecha: new Date().toISOString().slice(0, 10),
      items: []
    });
    cargarProductos();
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">🛒 Registrar Venta</h2>

      <form onSubmit={guardarVenta} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={venta.tipo}
            onChange={(e) => setVenta({ ...venta, tipo: e.target.value })}
            className="border px-3 py-2 rounded"
          >
            <option value="feria">Feria</option>
            <option value="pedido">Pedido</option>
          </select>
          <select
            value={venta.metodo_pago}
            onChange={(e) => setVenta({ ...venta, metodo_pago: e.target.value })}
            className="border px-3 py-2 rounded"
          >
            <option value="efectivo">Efectivo</option>
            <option value="debito">Débito</option>
            <option value="transferencia">Transferencia</option>
          </select>
          <input
            type="date"
            value={venta.fecha}
            onChange={(e) => setVenta({ ...venta, fecha: e.target.value })}
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-md font-semibold">📦 Productos disponibles</h3>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/3"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {productosFiltrados.map((p) => (
              <div key={p.id} className="border rounded p-3 bg-white shadow text-sm space-y-1">
                <div className="font-semibold truncate">{p.nombre}</div>
                <div>💲 ${parseFloat(p.precio_unitario).toFixed(2)}</div>
                <div>📦 Stock: {p.stock}</div>
                <button
                  type="button"
                  onClick={() => agregarItem(p)}
                  className="mt-2 w-full bg-blue-600 text-white px-2 py-1 rounded text-sm"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {venta.items.length > 0 && (
          <div className="bg-white shadow rounded p-4 mt-6">
            <h3 className="text-md font-semibold mb-2">🧾 Detalle de venta</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {venta.items.map((item) => (
                  <tr key={item.producto_id} className="border-t">
                    <td>{item.nombre}</td>
                    <td>
                      <input
                        type="number"
                        value={item.cantidad}
                        min={1}
                        onChange={(e) => actualizarCantidad(item.producto_id, e.target.value)}
                        className="w-16 border rounded px-2"
                      />
                    </td>
                    <td>${item.precio_unitario.toFixed(2)}</td>
                    <td>${(item.precio_unitario * item.cantidad).toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => eliminarItem(item.producto_id)}
                        className="text-red-500"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-4 font-bold text-lg">Total: ${total}</div>
          </div>
        )}

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
          Guardar venta
        </button>
      </form>
    </div>
  );
}
