import { useEffect, useState } from "react";
import api from "../services/api";
import { obtenerParametros } from "../services/parametroService";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [editado, setEditado] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [nuevo, setNuevo] = useState({
    nombre: "",
    descripcion: "",
    peso: "",
    precio_unitario: "",
    stock: 0,
    activo: true,
    categoria: ""
  });
  const [parametros, setParametros] = useState({});

  const cargarProductos = async () => {
    const res = await api.get("/productos");
    const cats = Array.from(new Set(res.data.map(item => item.categoria || "General")));
    setCategorias(cats);
    setProductos(res.data);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    await api.post("/productos", {
      nombre: nuevo.nombre,
      descripcion: nuevo.descripcion,
      precio_unitario: parseFloat(nuevo.precio_unitario),
      stock: parseInt(nuevo.stock),
      activo: nuevo.activo,
      categoria: nuevo.categoria
    });
    setNuevo({ nombre: "", descripcion: "", peso: "", precio_unitario: "", stock: 0, activo: true, categoria: "" });
    cargarProductos();
  };

  const comenzarEdicion = (producto) => {
    setEditandoId(producto.id);
    setEditado({ ...producto });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditado({});
  };

  const guardarEdicion = async () => {
    await api.put(`/productos/${editandoId}`, {
      ...editado,
      precio_unitario: parseFloat(editado.precio_unitario),
      stock: parseInt(editado.stock),
      categoria: editado.categoria
    });
    cancelarEdicion();
    cargarProductos();
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      await api.delete(`/productos/${id}`);
      cargarProductos();
    }
  };

  useEffect(() => {
    cargarProductos();
    obtenerParametros().then((lista) => {
      const obj = {};
      lista.forEach((p) => {
        obj[p.clave] = parseFloat(p.valor);
      });
      setParametros(obj);
    });
  }, []);

  // Filtrar por estado, búsqueda y categoría
  const productosFiltrados = productos.filter((p) =>
    p.activo &&
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (!filtroCategoria || p.categoria === filtroCategoria)
  );

  return (
    <div className="space-y-8 pb-20">
      <h2 className="text-xl font-bold">📦 Registrar Producto</h2>

      <form
        onSubmit={guardarProducto}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow"
      >
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input
            type="text"
            value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
            className="border rounded px-3 py-2"
          />
        </div>

        {/* Categoría */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <input
            type="text"
            value={nuevo.categoria}
            onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}
            className="border rounded px-3 py-2"
            placeholder="Ej: Juguetes, Llaveros..."
            required
          />
        </div>

        {/* Peso */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Peso (g)</label>
          <input
            type="number"
            value={nuevo.peso}
            onChange={(e) => setNuevo({ ...nuevo, peso: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
        </div>

        {/* Precio */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Precio unitario ($)</label>
          <input
            type="number"
            step="0.01"
            value={nuevo.precio_unitario}
            onChange={(e) => setNuevo({ ...nuevo, precio_unitario: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
        </div>

        {/* Stock */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            value={nuevo.stock}
            onChange={(e) => setNuevo({ ...nuevo, stock: e.target.value })}
            className="border rounded px-3 py-2"
          />
        </div>

        {/* Activo */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Activo</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={nuevo.activo}
              onChange={(e) => setNuevo({ ...nuevo, activo: e.target.checked })}
            />
            <span className="text-sm text-gray-700">Sí</span>
          </div>
        </div>

        <div className="lg:col-span-3 sm:col-span-2 col-span-1">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 w-full"
          >
            Guardar
          </button>
        </div>
      </form>

      {/* Filtro por categoría y búsqueda */}
      <div className="flex flex-wrap items-center space-x-4">
        <div>
          <label className="block text-sm font-medium">Categoría</label>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="p-2 border rounded w-36"
          >
            <option value="">Todas</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Buscar</label>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Listado de productos filtrados */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Activo</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>            
            {productosFiltrados.map((p) => (
              editandoId === p.id ? (
                <tr key={p.id} className="border-t">
                  <td><input className="border px-2 w-full" value={editado.nombre} onChange={(e) => setEditado({ ...editado, nombre: e.target.value })} /></td>
                  <td><input className="border px-2 w-full" value={editado.descripcion} onChange={(e) => setEditado({ ...editado, descripcion: e.target.value })} /></td>
                  <td><input className="border px-2 w-full" value={editado.categoria} onChange={(e) => setEditado({ ...editado, categoria: e.target.value })} /></td>
                  <td><input type="number" className="border px-2 w-full" value={editado.precio_unitario} onChange={(e) => setEditado({ ...editado, precio_unitario: e.target.value })} /></td>
                  <td><input type="number" className="border px-2 w-full" value={editado.stock} onChange={(e) => setEditado({ ...editado, stock: e.target.value })} /></td>
                  <td><input type="checkbox" className="m-auto block" checked={editado.activo} onChange={(e) => setEditado({ ...editado, activo: e.target.checked })} /></td>
                  <td className="space-x-2">
                    <button onClick={guardarEdicion} className="text-green-600">💾</button>
                    <button onClick={cancelarEdicion} className="text-gray-600">❌</button>
                  </td>
                </tr>
              ) : (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{p.nombre}</td>
                  <td className="px-4 py-2">{p.descripcion}</td>
                  <td className="px-4 py-2">{p.categoria}</td>
                  <td className="px-4 py-2">${parseFloat(p.precio_unitario).toFixed(2)}</td>
                  <td className="px-4 py-2">{p.stock}</td>
                  <td className="px-4 py-2">{p.activo ? '✅' : '❌'}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => comenzarEdicion(p)} className="text-blue-600">✏️</button>
                    <button onClick={() => eliminarProducto(p.id)} className="text-red-600">🗑️</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
