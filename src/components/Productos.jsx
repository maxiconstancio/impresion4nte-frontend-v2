import { useEffect, useState } from "react";
import api from "../services/api";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [parametros, setParametros] = useState({});
  const [usarTarjeta, setUsarTarjeta] = useState(false);

  const [nuevo, setNuevo] = useState({
    nombre: "",
    descripcion: "",
    peso_gramos: "",
    horas_impresion: "",
    precio_unitario: "",
    stock: 0,
    activo: true,
  });

  const cargarProductos = async () => {
    const res = await api.get("/productos");
    setProductos(res.data);
  };

  const cargarParametros = async () => {
    const res = await api.get("/parametros");
    const mapa = {};
    res.data.forEach(p => mapa[p.clave] = parseFloat(p.valor));
    setParametros(mapa);
  };

  const calcularPrecioSugerido = () => {
    const peso = parseFloat(nuevo.peso_gramos);
    const horas = parseFloat(nuevo.horas_impresion);
    if (!peso || !horas || !parametros.precio_filamento_kg || !parametros.costo_hora_impresora || !parametros.multiplicador_venta) {
      return "";
    }

    const precioFilamento = (parametros.precio_filamento_kg / 1000) * peso;
    const costoImpresora = parametros.costo_hora_impresora * horas;
    let base = (precioFilamento + costoImpresora) * parametros.multiplicador_venta;

    if (usarTarjeta && parametros.porcentaje_tarjeta) {
      base *= 1 + parametros.porcentaje_tarjeta / 100;
    }

    return base.toFixed(2);
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
    setNuevo({
      nombre: "",
      descripcion: "",
      peso_gramos: "",
      horas_impresion: "",
      precio_unitario: "",
      stock: 0,
      activo: true
    });
    setUsarTarjeta(false);
    cargarProductos();
  };

  useEffect(() => {
    cargarProductos();
    cargarParametros();
  }, []);

  useEffect(() => {
    const sugerido = calcularPrecioSugerido();
    if (sugerido) {
      setNuevo((prev) => ({
        ...prev,
        precio_unitario: sugerido
      }));
    }
  }, [nuevo.peso_gramos, nuevo.horas_impresion, usarTarjeta, parametros]);

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
          placeholder="Peso (g)"
          value={nuevo.peso_gramos}
          onChange={(e) => setNuevo({ ...nuevo, peso_gramos: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Horas impresión"
          value={nuevo.horas_impresion}
          onChange={(e) => setNuevo({ ...nuevo, horas_impresion: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={usarTarjeta}
            onChange={(e) => setUsarTarjeta(e.target.checked)}
          />
          <span>Pago con débito</span>
        </label>
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
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">
          Guardar
        </button>
      </form>

      <h2 className="text-xl font-bold">📄 Productos disponibles</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Activo</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">{p.descripcion}</td>
                <td className="px-4 py-2">${parseFloat(p.precio_unitario).toFixed(2)}</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2">{p.activo ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
