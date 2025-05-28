import { useEffect, useState } from "react";
import api from "../services/api";
import { obtenerParametros } from "../services/parametroService";

export default function Presupuesto() {
  const [partes, setPartes] = useState([]);
  const [cliente, setCliente] = useState("");
  const [parametros, setParametros] = useState({});

  useEffect(() => {
    obtenerParametros().then((lista) => {
      const obj = {};
      lista.forEach((p) => (obj[p.clave] = parseFloat(p.valor)));
      setParametros(obj);
    });
  }, []);

  const agregarParte = () => {
    setPartes([
      ...partes,
      { nombre: "", peso: "", tiempo: "", subtotal: 0 },
    ]);
  };

  const actualizarParte = (index, campo, valor) => {
    const nuevas = [...partes];
    nuevas[index][campo] = valor;
    setPartes(nuevas);
  };

  const calcularSubtotal = (peso, tiempo) => {
    const precioFilamento = parametros.precio_filamento_kg || 0;
    const costoHora = parametros.costo_hora_impresora || 0;
    const multiplicador = parametros.multiplicador_venta || 3;

    const costoMaterial = (peso / 1000) * precioFilamento;
    const costoImpresora = (tiempo / 60) * costoHora;
    return ((costoMaterial + costoImpresora) * multiplicador).toFixed(2);
  };

  const total = partes.reduce((acc, p) => {
    const sub = parseFloat(calcularSubtotal(p.peso, p.tiempo));
    return acc + (isNaN(sub) ? 0 : sub);
  }, 0);

  const confirmarPedido = async () => {
    const productos = partes.map((p) => {
      const precio = calcularSubtotal(p.peso, p.tiempo);
      return {
        nombre: p.nombre,
        cantidad: 1,
        observaciones: `Peso: ${p.peso}g, Tiempo: ${p.tiempo}min`,
        precio_unitario: parseFloat(precio),
      };
    });

    const res = await api.post("/pedidos", {
        cliente,
        estado: "presupuesto", // 👈 clave
        comentarios: "Presupuesto convertido en pedido",
        productos,
      });   

    alert("Pedido generado desde presupuesto");
    setPartes([]);
    setCliente("");
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold">💡 Crear presupuesto</h2>

      <input
        type="text"
        placeholder="Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        className="border px-3 py-2 rounded w-full sm:w-1/2"
      />

      <div className="space-y-4">
        {partes.map((parte, index) => (
          <div key={index} className="bg-white rounded p-4 shadow space-y-2">
            <input
              type="text"
              placeholder="Nombre de parte"
              value={parte.nombre}
              onChange={(e) => actualizarParte(index, "nombre", e.target.value)}
              className="border rounded px-3 py-1 w-full"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Peso (g)"
                value={parte.peso}
                onChange={(e) => actualizarParte(index, "peso", e.target.value)}
                className="border rounded px-3 py-1"
              />
              <input
                type="number"
                placeholder="Tiempo (min)"
                value={parte.tiempo}
                onChange={(e) => actualizarParte(index, "tiempo", e.target.value)}
                className="border rounded px-3 py-1"
              />
            </div>
            <div className="text-sm text-gray-600">
              💰 Subtotal sugerido: ${calcularSubtotal(parte.peso, parte.tiempo)}
            </div>
          </div>
        ))}
      </div>

      <button onClick={agregarParte} className="bg-gray-200 px-4 py-2 rounded">
        ➕ Agregar parte
      </button>

      {partes.length > 0 && (
        <div className="space-y-4">
          <div className="text-lg font-semibold">
            💵 Total sugerido: ${total.toFixed(2)}
          </div>
          <button
            onClick={confirmarPedido}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Confirmar como pedido
          </button>
        </div>
      )}
    </div>
  );
}
