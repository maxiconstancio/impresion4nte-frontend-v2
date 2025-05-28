import { useEffect, useState } from "react";
import api from "../services/api";
import { obtenerParametros } from "../services/parametroService";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [editado, setEditado] = useState({});
  const [nuevo, setNuevo] = useState({
    nombre: "",
    descripcion: "",
    peso: "",
    precio_unitario: "",
    stock: 0,
    activo: true,
  });
  const [busqueda, setBusqueda] = useState("");
  const [parametros, setParametros] = useState({});

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
    setNuevo({ nombre: "", descripcion: "", peso: "", precio_unitario: "", stock: 0, activo: true });
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
    obtenerParametros().then((lista) => {
      const obj = {};
      lista.forEach((p) => {
        obj[p.clave] = parseFloat(p.valor);
      });
      setParametros(obj);
    });
  }, []);

  useEffect(() => {
    const calcularPrecioSugerido = async () => {
      if (
        nuevo.peso &&
        parametros.precio_filamento_kg &&
        parametros.costo_hora_impresora
      ) {
        try {
          const res = await api.post("/productos/recomendar-precio", {
            peso: parseFloat(nuevo.peso),
            precio_kilo: parametros.precio_filamento_kg,
            costo_impresora: parametros.costo_hora_impresora,
            tipo_venta: "pedido",
          });

          setNuevo((prev) => ({
            ...prev,
            precio_unitario: parseFloat(res.data.precio_final),
          }));
        } catch (err) {
          console.error("Error al calcular precio sugerido:", err);
        }
      } else {
        console.log("Faltan datos para sugerir precio:", {
          peso: nuevo.peso,
          parametros,
        });
      }
    };

    calcularPrecioSugerido();
  }, [nuevo.peso, parametros]);


  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <h2 className="text-xl font-bold">📦 Registrar Producto</h2>

      <form
  onSubmit={guardarProducto}
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow"
>
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Nombre</label>
    <input type="text" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} className="border rounded px-3 py-2" required />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Descripción</label>
    <input type="text" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} className="border rounded px-3 py-2" />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Peso (g)</label>
    <input type="number" value={nuevo.peso} onChange={(e) => setNuevo({ ...nuevo, peso: e.target.value })} className="border rounded px-3 py-2" required />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Precio unitario ($)</label>
    <input type="number" step="0.01" value={nuevo.precio_unitario} onChange={(e) => setNuevo({ ...nuevo, precio_unitario: e.target.value })} className="border rounded px-3 py-2" required />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Stock</label>
    <input type="number" value={nuevo.stock} onChange={(e) => setNuevo({ ...nuevo, stock: e.target.value })} className="border rounded px-3 py-2" />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Activo</label>
    <div className="flex items-center space-x-2">
      <input type="checkbox" checked={nuevo.activo} onChange={(e) => setNuevo({ ...nuevo, activo: e.target.checked })} />
      <span className="text-sm text-gray-700">Sí</span>
    </div>
  </div>

  <div className="lg:col-span-3 sm:col-span-2 col-span-1">
    <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 w-full">
      Guardar
    </button>
  </div>
</form>




      <h2 className="text-xl font-bold">📄 Productos disponibles</h2>
      <input type="text" placeholder="Buscar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="mb-4 px-3 py-2 border rounded w-full sm:w-1/2" />

      <div className="overflow-x-auto">
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
                  <td><input className="border px-2 w-full" value={editado.nombre} onChange={(e) => setEditado({ ...editado, nombre: e.target.value })} /></td>
                  <td><input className="border px-2 w-full" value={editado.descripcion} onChange={(e) => setEditado({ ...editado, descripcion: e.target.value })} /></td>
                  <td><input type="number" className="border px-2 w-full" value={editado.precio_unitario} onChange={(e) => setEditado({ ...editado, precio_unitario: e.target.value })} /></td>
                  <td><input type="number" className="border px-2 w-full" value={editado.stock} onChange={(e) => setEditado({ ...editado, stock: e.target.value })} /></td>
                  <td><input type="checkbox" checked={editado.activo} onChange={(e) => setEditado({ ...editado, activo: e.target.checked })} /></td>
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
