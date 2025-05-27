import { useEffect, useState } from "react";
import api from "../services/api";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: "",
    tipo: "",
    contacto: ""
  });

  const cargarProveedores = async () => {
    try {
      const res = await api.get("/proveedores");
      setProveedores(res.data);
    } catch (error) {
      console.error("Error al cargar proveedores", error);
    }
  };

  const guardarProveedor = async (e) => {
    e.preventDefault();
    try {
      await api.post("/proveedores", nuevo);
      setNuevo({ nombre: "", tipo: "", contacto: "" });
      cargarProveedores();
    } catch (error) {
      console.error("Error al guardar proveedor", error);
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">🏢 Registrar Proveedor</h2>
      <form onSubmit={guardarProveedor} className="grid md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow">
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
          placeholder="Tipo"
          value={nuevo.tipo}
          onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Contacto"
          value={nuevo.contacto}
          onChange={(e) => setNuevo({ ...nuevo, contacto: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">
          Guardar
        </button>
      </form>

      <h2 className="text-xl font-bold">📄 Proveedores registrados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Contacto</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((prov) => (
              <tr key={prov.id} className="border-t">
                <td className="px-4 py-2">{prov.nombre}</td>
                <td className="px-4 py-2">{prov.tipo}</td>
                <td className="px-4 py-2">{prov.contacto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
