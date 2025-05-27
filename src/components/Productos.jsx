import { useEffect, useState } from "react";
import api from "../services/api";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [editado, setEditado] = useState({});
  const [nuevo, setNuevo] = useState({
    nombre: "",
    descripcion: "",
    precio_unitario: "",
    stock: 0,
    activo: true,
  });
  const [busqueda, setBusqueda] = useState("");

  const cargarProductos = async () => {
    const res = await api.get("/productos");
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
    });
    setNuevo({ nombre: "", descripcion: "", precio_unitario: "", stock: 0, activo: true });
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
  }, []);
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">📦 Registrar Producto</h2>
      <form onSubmit={guardarProducto} className="grid md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Precio unitario"
          value={nuevo.precio_unitario}
          onChange={(e) => setNuevo({ ...nuevo, precio_unitario: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={nuevo.stock}
          onChange={(e) => setNuevo({ ...nuevo, stock: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={nuevo.activo}
            onChange={(e) => setNuevo({ ...nuevo, activo: e.target.checked })}
          />
          <span>Activo</span>
        </label>
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">Guardar</button>
      </form>

      <h2 className="text-xl font-bold">📄 Productos disponibles</h2>
      <div className="overflow-x-auto">
      <div>
  <input
    type="text"
    placeholder="Buscar por nombre..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    className="mb-4 px-3 py-2 border rounded w-full md:w-1/3"
  />
</div>
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Activo</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) =>
              editandoId === p.id ? (
                <tr key={p.id} className="border-t">
                  <td><input className="border px-2" value={editado.nombre} onChange={(e) => setEditado({ ...editado, nombre: e.target.value })} /></td>
                  <td><input className="border px-2" value={editado.descripcion} onChange={(e) => setEditado({ ...editado, descripcion: e.target.value })} /></td>
                  <td><input type="number" className="border px-2" value={editado.precio_unitario} onChange={(e) => setEditado({ ...editado, precio_unitario: e.target.value })} /></td>
                  <td><input type="number" className="border px-2" value={editado.stock} onChange={(e) => setEditado({ ...editado, stock: e.target.value })} /></td>
                  <td>
                    <input type="checkbox" checked={editado.activo} onChange={(e) => setEditado({ ...editado, activo: e.target.checked })} />
                  </td>
                  <td>
                    <button className="text-green-600 mr-2" onClick={guardarEdicion}>💾</button>
                    <button className="text-gray-600" onClick={cancelarEdicion}>❌</button>
                  </td>
                </tr>
              ) : (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{p.nombre}</td>
                  <td className="px-4 py-2">{p.descripcion}</td>
                  <td className="px-4 py-2">${parseFloat(p.precio_unitario).toFixed(2)}</td>
                  <td className="px-4 py-2">{p.stock}</td>
                  <td className="px-4 py-2">{p.activo ? "✅" : "❌"}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => comenzarEdicion(p)} className="text-blue-600">✏️</button>
                    <button onClick={() => eliminarProducto(p.id)} className="text-red-600">🗑️</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
