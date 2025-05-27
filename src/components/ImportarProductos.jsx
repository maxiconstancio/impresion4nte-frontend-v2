import { useState } from "react";
import api from "../services/api";

export default function ImportarProductos() {
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const subirCSV = async (e) => {
    e.preventDefault();
    if (!archivo) return;

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const res = await api.post("/productos/importar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResultado(res.data);
      setError("");
    } catch (err) {
      setError("Error al importar el archivo");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">📥 Importar productos desde CSV</h2>

      <form onSubmit={subirCSV} className="space-y-4 bg-white p-4 rounded shadow">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setArchivo(e.target.files[0])}
          className="block border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Importar
        </button>
      </form>

      {resultado && (
        <div className="bg-green-100 text-green-800 p-4 rounded">
          <p>✅ {resultado.importados} productos importados correctamente.</p>
          {resultado.errores.length > 0 && (
            <ul className="mt-2 text-sm text-red-600 list-disc pl-4">
              {resultado.errores.map((e, i) => (
                <li key={i}>Error en fila: {JSON.stringify(e.fila)} ({e.error})</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
