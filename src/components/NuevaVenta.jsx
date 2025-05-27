import { useEffect, useState } from "react";
import api from "../services/api";

export default function NuevaVenta() {
  const [productos, setProductos] = useState([]);
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

        <div>
          <h3 className="text-md font-semibold mb-2">📦 Productos disponibles</h3>
          <div className="grid md:grid-cols-4 gap-2">
            {productos.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => agregarItem(p)}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                {p.nombre}
              </button>
            ))}
          </div>
        </div>

        {venta.items.length > 0 && (
          <div className="bg-white shadow rounded p-4">
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

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
          Guardar venta
        </button>
      </form>
    </div>
  );
}
