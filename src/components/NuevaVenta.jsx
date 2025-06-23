import { useEffect, useState } from "react";
import api from "../services/api";

export default function NuevaVenta() {
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [venta, setVenta] = useState({
    tipo: "feria",
    metodo_pago: "efectivo",
    fecha: getFechaLocalParaInput(),
    items: [],
    noAjustarStock: false,
  });
  const [toast, setToast] = useState("");

  // 👇 NEW: matches y modal state
  const [matches, setMatches] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
          stock: producto.stock,
        },
      ],
    });
    setBusqueda("");
    setSugerencias([]);
  };

  function getFechaLocalParaInput() {
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset();
    const local = new Date(ahora.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  }

  const actualizarCantidad = (producto_id, cantidad) => {
    setVenta((prev) => {
      const items = prev.items.map((i) => {
        if (i.producto_id === producto_id) {
          let nuevaCantidad = parseInt(cantidad);
          if (nuevaCantidad > i.stock) {
            nuevaCantidad = i.stock;
            mostrarToast(`⚠️ Stock insuficiente: máximo disponible ${i.stock}`);
          } else if (nuevaCantidad < 1) {
            nuevaCantidad = 1;
          }
          return { ...i, cantidad: nuevaCantidad };
        }
        return i;
      });
      return { ...prev, items };
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
      productos: venta.items.map((i) => ({
        producto_id: i.producto_id,
        cantidad: i.cantidad,
        precio_unitario: i.precio_unitario,
      })),
      ajustar_stock: !venta.noAjustarStock,
    });

    setVenta({
      tipo: "feria",
      metodo_pago: "efectivo",
      fecha: getFechaLocalParaInput(),
      items: [],
      noAjustarStock: false,
    });

    setBusqueda("");
    setSugerencias([]);
    mostrarToast("✅ Venta guardada correctamente");
  };

  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(""), 3000);
  };

  // 📸 NUEVO: Manejar foto subida/sacada
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/productos/search-by-photo-local", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { matches } = res.data;

      if (matches && matches.length > 0) {
        setMatches(matches);
        setShowModal(true);
      } else {
        mostrarToast("⚠️ No se encontraron productos coincidentes");
      }
    } catch (err) {
      console.error(err);
      mostrarToast("❌ Error al buscar producto");
    }

    e.target.value = "";
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
          <option value="mercadopago">Transferencia</option>
        </select>
        <input
          type="datetime-local"
          value={venta.fecha.slice(0, 16)}
          onChange={(e) => setVenta({ ...venta, fecha: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <label className="flex items-center space-x-2 col-span-full">
          <input
            type="checkbox"
            checked={venta.noAjustarStock}
            onChange={(e) =>
              setVenta({ ...venta, noAjustarStock: e.target.checked })
            }
          />
          <span>Registrar venta sin mover stock</span>
        </label>
      </div>

      {/* 📸 BOTÓN PARA SACAR/SUBIR FOTO */}
      <div className="flex items-center gap-4 mb-4">
        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">
          📷 Sacar/Subir Foto
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
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
                      max={item.stock}
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

      {/* 📌 MODAL PARA ELEGIR MATCH */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Selecciona el producto correcto
            </h3>
            <ul className="space-y-2">
              {matches.map((m) => (
                <li
                  key={m.producto.id}
                  className="border p-3 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    agregarItem(m.producto);
                    mostrarToast(`✅ Producto agregado: ${m.producto.nombre}`);
                    setShowModal(false);
                  }}
                >
                  <div className="font-semibold">{m.producto.nombre}</div>
                  <div className="text-sm text-gray-500">
                    Similitud: {(m.score * 100).toFixed(1)}%
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
