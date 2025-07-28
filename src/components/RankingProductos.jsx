import { useEffect, useState } from "react";
import api from "../services/api";

export default function RankingProductos() {
  const [ranking, setRanking] = useState([]);
  const [tipo, setTipo] = useState("todos");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [ordenCategoriaAsc, setOrdenCategoriaAsc] = useState(true);

  const obtenerRanking = async () => {
    try {
      const params = {};
      if (tipo !== "todos") params.tipo = tipo;
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;

      const res = await api.get("/ventas/ranking", { params });
      setRanking(res.data);
      // extraer categorías únicas
      const cats = Array.from(new Set(res.data.map(item => item.categoria || "General")));
      setCategorias(cats);
    } catch (err) {
      console.error("Error al obtener ranking", err);
    }
  };

  useEffect(() => {
    obtenerRanking();
  }, []);

  // filtrar por categoría
  const rankingFiltrado = ranking.filter(item =>
    !filtroCategoria || (item.categoria || "General") === filtroCategoria
  );

  // ordenar por categoría si se desea
  const rankingOrdenado = rankingFiltrado.slice().sort((a, b) => {
    const catA = a.categoria || "";
    const catB = b.categoria || "";
    return ordenCategoriaAsc
      ? catA.localeCompare(catB)
      : catB.localeCompare(catA);
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🏆 Ranking de Productos Vendidos</h2>

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium">Tipo de Venta</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="p-2 border rounded w-36"
          >
            <option value="todos">Todos</option>
            <option value="feria">Feria</option>
            <option value="pedido">Pedido</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={obtenerRanking}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filtrar
        </button>
      </div>

      {/* Filtro y orden por categoría */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium">Categoría</label>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="p-2 border rounded w-36"
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setOrdenCategoriaAsc(!ordenCategoriaAsc)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Ordenar por categoría {ordenCategoriaAsc ? '⬆️' : '⬇️'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-left">Categoría</th>
              <th className="px-4 py-2 text-right">Cantidad Vendida</th>
            </tr>
          </thead>
          <tbody>
            {rankingOrdenado.map((item, index) => (
              <tr key={item.producto_id} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.nombre}</td>
                <td className="px-4 py-2">{item.categoria || 'General'}</td>
                <td className="px-4 py-2 text-right">{item.cantidad_total}</td>
              </tr>
            ))}
            {rankingOrdenado.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  No hay datos para el filtro seleccionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
