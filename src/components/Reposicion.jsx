import { useEffect, useState } from "react";
import api from "../services/api";

export default function Reposicion() {
  const [productos, setProductos] = useState([]);
  const [soloDiferentes, setSoloDiferentes] = useState(false);
  const [reponerProducto, setReponerProducto] = useState(null);
  const [cantidadReponer, setCantidadReponer] = useState("");

  const cargarReposicion = async () => {
    const res = await api.get("/productos/sugerir-reposicion-feria");
    setProductos(res.data);
  };

  const aplicarSugerido = async (producto_id, nuevoMinimo) => {
    try {
      await api.put(`/productos/${producto_id}`, {
        stock_minimo: nuevoMinimo,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const aplicarTodos = async () => {
    const cambios = productosFiltrados.filter(
      (p) => p.stock_minimo_sugerido !== p.stock_minimo_actual
    );

    for (const p of cambios) {
      await aplicarSugerido(p.producto_id, p.stock_minimo_sugerido);
    }

    await cargarReposicion();
    alert("✔ Todos los cambios sugeridos fueron aplicados.");
  };

  const confirmarReposicion = async () => {
    const cantidad = parseInt(cantidadReponer);
    if (isNaN(cantidad) || cantidad <= 0) return alert("Cantidad inválida");

    try {
      await api.put(`/productos/${reponerProducto.producto_id}`, {
        stock: reponerProducto.stock_actual + cantidad,
      });
      setReponerProducto(null);
      setCantidadReponer("");
      await cargarReposicion();
    } catch (error) {
      console.error(error);
      alert("Error al reponer");
    }
  };

  useEffect(() => {
    cargarReposicion();
  }, []);

  const productosFiltrados = productos
    .filter((p) =>
      soloDiferentes
        ? p.stock_minimo_sugerido !== p.stock_minimo_actual
        : true
    )
    .map((p) => ({
      ...p,
      faltan: p.stock_minimo_sugerido - p.stock_actual,
    }))
    .sort((a, b) => b.faltan - a.faltan);

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold">📊 Reposición sugerida por ventas en ferias</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={soloDiferentes}
            onChange={(e) => setSoloDiferentes(e.target.checked)}
          />
          <label className="text-sm text-gray-700">
            Mostrar solo los que difieren del stock mínimo actual
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="text-sm text-gray-500 text-right">
            Mostrando {productosFiltrados.length} de {productos.length} productos
          </div>

          <button
            onClick={aplicarTodos}
            className="bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            💾 Aplicar todos los sugeridos
          </button>
        </div>
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Mín. actual</th>
              <th className="px-4 py-2">Vendidos (90d)</th>
              <th className="px-4 py-2">Sugerido</th>
              <th className="px-4 py-2 text-red-600">Faltan</th>
              <th className="px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.producto_id} className="border-t">
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">{p.stock_actual}</td>
                <td className="px-4 py-2">{p.stock_minimo_actual}</td>
                <td className="px-4 py-2">{p.vendidos_feria_90d}</td>
                <td className="px-4 py-2 text-green-600 font-semibold">{p.stock_minimo_sugerido}</td>
                <td className="px-4 py-2 text-red-600">{p.faltan}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() =>
                      aplicarSugerido(p.producto_id, p.stock_minimo_sugerido).then(
                        cargarReposicion
                      )
                    }
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    💾 Aplicar
                  </button>
                  <button
                    onClick={() => {
                      setReponerProducto(p);
                      setCantidadReponer("");
                    }}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    📦 Reponer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de reposición */}
      {reponerProducto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">📦 Reponer producto</h3>
            <p>
              <strong>{reponerProducto.nombre}</strong> — Stock actual:{" "}
              {reponerProducto.stock_actual}
            </p>
            <input
              type="number"
              placeholder="Cantidad a reponer"
              className="w-full border rounded px-3 py-2"
              value={cantidadReponer}
              onChange={(e) => setCantidadReponer(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReponerProducto(null)}
                className="px-3 py-1 rounded border"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarReposicion}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
