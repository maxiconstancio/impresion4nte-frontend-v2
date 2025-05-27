import { useEffect, useState } from "react";
import { obtenerParametros, guardarParametro } from "../services/parametroService";

export default function Parametros() {
  const [parametros, setParametros] = useState([]);

  const cargar = async () => {
    try {
      const data = await obtenerParametros();
      setParametros(data);
    } catch (err) {
      console.error("Error cargando parámetros:", err);
    }
  };

  const actualizar = async (clave, valor) => {
    try {
      await guardarParametro(clave, valor);
      cargar();
    } catch (err) {
      console.error("Error actualizando parámetro:", err);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">⚙️ Parámetros configurables</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {parametros.map(p => (
          <div key={p.id} className="bg-white p-4 shadow rounded">
            <label className="block text-sm text-gray-600 mb-1">{p.clave}</label>
            <input
              type="text"
              value={p.valor}
              onChange={(e) => actualizar(p.clave, e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
