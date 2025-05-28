import { useState } from "react";
import api from "../services/api";

export default function ModalEditarVenta({ venta, onClose, onGuardado }) {
  const [ventaEditada, setVentaEditada] = useState({
    id: venta.id,
    tipo: venta.tipo,
    metodo_pago: venta.metodo_pago,
    fecha: venta.fecha.slice(0, 16),
    productos: venta.productos.map((p) => ({
      id: p.id,
      producto_id: p.producto_id,
      nombre: p.producto?.nombre,
      cantidad: p.cantidad,
      precio_unitario: p.precio_unitario,
    })),
  });

  const [totalManual, setTotalManual] = useState("");

  const actualizarProducto = (id, campo, valor) => {
    setVentaEditada((prev) => ({
      ...prev,
      productos: prev.productos.map((p) =>
        p.id === id ? { ...p, [campo]: parseFloat(valor) || 0 } : p
      ),
    }));
  };

  const eliminarProducto = (id) => {
    setVentaEditada((prev) => ({
      ...prev,
      productos: prev.productos.filter((p) => p.id !== id),
    }));
  };

  const calcularTotal = () =>
    ventaEditada.productos.reduce(
      (sum, p) => sum + p.precio_unitario * p.cantidad,
      0
    );

    const guardarCambios = async () => {
        try {
          const totalCalculado = calcularTotal();
          const totalFinal = isNaN(parseFloat(totalManual))
            ? totalCalculado
            : parseFloat(totalManual);
      
          const payload = {
            tipo: ventaEditada.tipo,
            metodo_pago: ventaEditada.metodo_pago,
            fecha: ventaEditada.fecha,
            total: totalFinal,
            productos: ventaEditada.productos.map((p) => ({
              id: p.id,
              producto_id: p.producto_id,
              cantidad: p.cantidad,
              precio_unitario: p.precio_unitario,
            })),
          };
      
          await api.put(`/ventas/${venta.id}`, payload);
          onGuardado();
          onClose();
        } catch (err) {
          console.error("Error al guardar:", err);
          alert("Ocurrió un error al guardar la venta.");
        }
      };
      

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full h-full md:h-auto md:max-w-2xl md:rounded-xl shadow-lg overflow-y-auto">

        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">✏️ Editar Venta #{venta.id}</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">×</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={ventaEditada.tipo}
              onChange={(e) =>
                setVentaEditada({ ...ventaEditada, tipo: e.target.value })
              }
              className="border px-3 py-2 rounded"
            >
              <option value="feria">Feria</option>
              <option value="pedido">Pedido</option>
            </select>
            <select
              value={ventaEditada.metodo_pago}
              onChange={(e) =>
                setVentaEditada({ ...ventaEditada, metodo_pago: e.target.value })
              }
              className="border px-3 py-2 rounded"
            >
              <option value="efectivo">Efectivo</option>
              <option value="debito">Débito</option>
              <option value="transferencia">Transferencia</option>
            </select>
            <input
              type="datetime-local"
              value={ventaEditada.fecha}
              onChange={(e) =>
                setVentaEditada({ ...ventaEditada, fecha: e.target.value })
              }
              className="border px-3 py-2 rounded"
            />
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ventaEditada.productos.map((p) => (
                <tr key={p.id} className="border-t">
                  <td>{p.nombre}</td>
                  <td>
                    <input
                      type="number"
                      value={p.cantidad}
                      min={1}
                      onChange={(e) =>
                        actualizarProducto(p.id, "cantidad", e.target.value)
                      }
                      className="w-16 border rounded px-2"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={p.precio_unitario}
                      min={0}
                      step={0.01}
                      onChange={(e) =>
                        actualizarProducto(p.id, "precio_unitario", e.target.value)
                      }
                      className="w-20 border rounded px-2"
                    />
                  </td>
                  <td>
                    ${(p.cantidad * p.precio_unitario).toFixed(2)}
                  </td>
                  <td>
                    <button
                      onClick={() => eliminarProducto(p.id)}
                      className="text-red-500"
                      title="Eliminar producto"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-4">
            <div className="text-lg font-semibold">
              Total actual: ${calcularTotal().toFixed(2)}
            </div>
            <input
              type="number"
              step="0.01"
              placeholder="Modificar total manualmente"
              value={totalManual}
              onChange={(e) => setTotalManual(e.target.value)}
              className="border px-3 py-2 rounded w-full sm:w-72"
            />
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={guardarCambios}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
