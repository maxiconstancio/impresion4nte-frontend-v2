import { useState, useEffect } from "react";
import api from "../services/api";

export default function ModalEditarPresupuesto({ presupuesto, onClose, onGuardado }) {
  const [cliente, setCliente] = useState(presupuesto.cliente || "");
  const [partes, setPartes] = useState([]);

  useEffect(() => {
    const partesIniciales = presupuesto.Productos?.map((p) => ({
      nombre: p.nombre,
      peso: p.PedidoProducto?.observaciones?.match(/Peso: (\d+)g/)?.[1] || "",
      tiempo: p.PedidoProducto?.observaciones?.match(/Tiempo: (\d+)min/)?.[1] || "",
      precio_unitario: parseFloat(p.PedidoProducto?.precio_unitario || 0),
    })) || [];
    setPartes(partesIniciales);
  }, [presupuesto]);

  const actualizarParte = (index, campo, valor) => {
    const nuevas = [...partes];
    nuevas[index][campo] = valor;
    setPartes(nuevas);
  };

  const calcularSubtotal = (peso, tiempo) => {
    const precioFilamento = 5000; // reemplazar si tenés parámetros
    const costoHora = 200; // idem
    const multiplicador = 3;
    const costoMaterial = (peso / 1000) * precioFilamento;
    const costoImpresora = (tiempo / 60) * costoHora;
    return ((costoMaterial + costoImpresora) * multiplicador).toFixed(2);
  };

  const guardarCambios = async () => {
    const productos = partes.map((p) => ({
      nombre: p.nombre,
      cantidad: 1,
      observaciones: `Peso: ${p.peso}g, Tiempo: ${p.tiempo}min`,
      precio_unitario: parseFloat(calcularSubtotal(p.peso, p.tiempo)),
    }));

    await api.put(`/pedidos/editar/${presupuesto.id}`, {
      cliente,
      comentarios: "Presupuesto editado",
      productos,
    });

    onGuardado();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg space-y-4">
        <h3 className="text-lg font-bold">✏️ Editar Presupuesto</h3>

        <input
          type="text"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Cliente"
        />

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {partes.map((parte, index) => (
            <div key={index} className="border rounded p-3 space-y-2">
              <input
                type="text"
                value={parte.nombre}
                onChange={(e) => actualizarParte(index, "nombre", e.target.value)}
                placeholder="Nombre"
                className="w-full border px-2 py-1 rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={parte.peso}
                  onChange={(e) => actualizarParte(index, "peso", e.target.value)}
                  placeholder="Peso (g)"
                  className="border px-2 py-1 rounded"
                />
                <input
                  type="number"
                  value={parte.tiempo}
                  onChange={(e) => actualizarParte(index, "tiempo", e.target.value)}
                  placeholder="Tiempo (min)"
                  className="border px-2 py-1 rounded"
                />
              </div>
              <div className="text-sm text-gray-500">
                💰 Estimado: ${calcularSubtotal(parte.peso, parte.tiempo)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          <button onClick={guardarCambios} className="bg-blue-600 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
