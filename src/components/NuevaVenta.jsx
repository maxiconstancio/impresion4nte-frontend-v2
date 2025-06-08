import { useEffect, useState } from "react";
import api from "../services/api";

export default function NuevaVenta() {
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [venta, setVenta] = useState({
    tipo: "feria",
    metodo_pago: "efectivo",
    fecha: new Date().toISOString(),
    items: [],
  });
  const [toast, setToast] = useState("");

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

  const agregarItem = (producto) => {
    if (venta.items.find((i) => i.producto_id === producto.id)) return;
    setVenta({
      ...venta,
      items: [
        ...venta.items,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio_unitario: parseFloat(producto.precio_unitario),
          cantidad: 1,
        },
      ],
    });
    setBusqueda("");
    setSugerencias([]);
  };

  const actualizarCantidad = (producto_id, cantidad) => {
    setVenta({
      ...venta,
      items: venta.items.map((i) =>
        i.producto_id === producto_id
          ? { ...i, cantidad: parseInt(cantidad) }
          : i
      ),
    });
  };

  const actualizarPrecio = (producto_id, precio_unitario) => {
    setVenta({
      ...venta,
      items: venta.items.map((i) =>
        i.producto_id === producto_id
          ? { ...i, precio_unitario: parseFloat(precio_unitario) }
          : i
      ),
    });
  };

  const eliminarItem = (producto_id) => {
    setVenta({
      ...venta,
      items: venta.items.filter((i) => i.producto_id !== producto_id),
    });
  };

  const total = venta.items
    .reduce((sum, i) => sum + i.precio_unitario * i.cantidad, 0)
    .toFixed(2);

  const guardarVenta = async () => {
    await api.post("/ventas", {
      tipo: venta.tipo,
      metodo_pago: venta.metodo_pago,
      fecha: venta.fecha,
      productos: venta.items,
    });

    setVenta({
      tipo: "feria",
      metodo_pago: "efectivo",
      fecha: new Date().toISOString(),
      items: [],
    });

    setBusqueda("");
    setSugerencias([]);
    setToast("✅ Venta guardada correctamente");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="space-y-6 pb-28">
      <h2 className="text-xl font-bold">🛒 Registrar Venta</h2>

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
          onChange={(e) =>
            setVenta({ ...venta, metodo_pago: e.target.value })
          }
          className="border px-3 py-2 rounded"
        >
          <option value="efectivo">Efectivo</option>
          <option value="debito">Débito</option>
          <option value="transferencia">Transferencia</option>
        </select>
        <input
          type="datetime-local"
          value={venta.fecha.slice(0, 16)}
          onChange={(e) => setVenta({ ...venta, fecha: e.target.value })}
          className="border px-3 py-2 rounded"
        />
      </div>

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
                onClick={() => agregarItem(p)}
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

      {venta.items.length > 0 && (
        <div className="bg-white shadow rounded p-4 mt-6">
          <h3 className="text-md font-semibold mb-2">🧾 Detalle de venta</h3>
          <p className="text-sm text-gray-500 mb-3">
            💡 Podés modificar el precio si querés aplicar un descuento manual.
          </p>
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
                      onChange={(e) =>
                        actualizarCantidad(item.producto_id, e.target.value)
                      }
                      className="w-16 border rounded px-2"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.precio_unitario}
                      min={0}
                      step={0.01}
                      onChange={(e) =>
                        actualizarPrecio(item.producto_id, e.target.value)
                      }
                      className="w-20 border rounded px-2"
                    />
                  </td>
                  <td>
                    ${(item.precio_unitario * item.cantidad).toFixed(2)}
                  </td>
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
        </div>
      )}

      {venta.items.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md p-4 flex justify-between items-center z-50">
          <div className="text-lg font-bold">🧾 Total: ${total}</div>
          <button
            onClick={guardarVenta}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Confirmar venta
          </button>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-20 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
