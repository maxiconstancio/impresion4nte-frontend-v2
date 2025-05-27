import { useEffect, useState } from "react";
import api from "../services/api";

export default function Ingresos() {
  const [ingresos, setIngresos] = useState([]);
  const [nuevo, setNuevo] = useState({
    tipo: "",
    fecha: "",
    monto: "",
    metodo_pago: "",
    detalle: ""
  });

  const cargarIngresos = async () => {
    try {
      const res = await api.get("/ingresos");
      setIngresos(res.data);
    } catch (err) {
      console.error("Error cargando ingresos:", err);
    }
  };

  const guardarIngreso = async (e) => {
    e.preventDefault();
    try {
      await api.post("/ingresos", nuevo);
      setNuevo({ tipo: "", fecha: "", monto: "", metodo_pago: "", detalle: "" });
      cargarIngresos();
    } catch (err) {
      console.error("Error guardando ingreso:", err);
    }
  };

  useEffect(() => {
    cargarIngresos();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">📥 Registrar Ingreso</h2>
      <form onSubmit={guardarIngreso} className="grid md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="Tipo"
          value={nuevo.tipo}
          onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="date"
          value={nuevo.fecha}
          onChange={(e) => setNuevo({ ...nuevo, fecha: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="number"
          placeholder="Monto"
          value={nuevo.monto}
          onChange={(e) => setNuevo({ ...nuevo, monto: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Método de pago"
          value={nuevo.metodo_pago}
          onChange={(e) => setNuevo({ ...nuevo, metodo_pago: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Detalle"
          value={nuevo.detalle}
          onChange={(e) => setNuevo({ ...nuevo, detalle: e.target.value })}
          className="border rounded px-3 py-2 md:col-span-2"
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">
          Guardar
        </button>
      </form>

      <h2 className="text-xl font-bold">📄 Ingresos registrados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Monto</th>
              <th className="px-4 py-2">Método</th>
              <th className="px-4 py-2">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map((ingreso) => (
              <tr key={ingreso.id} className="border-t text-sm">
                <td className="px-4 py-2">{ingreso.fecha}</td>
                <td className="px-4 py-2">{ingreso.tipo}</td>
                <td className="px-4 py-2">${parseFloat(ingreso.monto).toFixed(2)}</td>
                <td className="px-4 py-2">{ingreso.metodo_pago}</td>
                <td className="px-4 py-2">{ingreso.detalle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
