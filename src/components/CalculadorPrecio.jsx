import { useEffect, useState } from "react";
import api from "../services/api";
import { obtenerParametros } from "../services/parametroService";

export default function CalculadorPrecio() {
  const [peso, setPeso] = useState("");
  const [tipoVenta, setTipoVenta] = useState("pedido");
  const [precioSugerido, setPrecioSugerido] = useState(null);
  const [parametros, setParametros] = useState({});

  const cargarParametros = async () => {
    const lista = await obtenerParametros();
    const obj = {};
    lista.forEach((p) => {
      obj[p.clave] = parseFloat(p.valor);
    });
    setParametros(obj);
  };

  const calcularPrecio = async () => {
    if (!peso || !parametros.precio_filamento_kg || !parametros.costo_hora_impresora) return;

    const res = await api.post("/productos/recomendar-precio", {
      peso: parseFloat(peso),
      precio_kilo: parametros.precio_filamento_kg,
      costo_impresora: parametros.costo_hora_impresora,
      tipo_venta: tipoVenta,
    });

    setPrecioSugerido(res.data);
  };

  useEffect(() => {
    cargarParametros();
  }, []);

  useEffect(() => {
    calcularPrecio();
  }, [peso, tipoVenta, parametros]);

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h3 className="text-lg font-bold">💡 Cálculo de precio sugerido</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Peso en gramos"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <select
          value={tipoVenta}
          onChange={(e) => setTipoVenta(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="pedido">Pedido</option>
          <option value="feria">Feria</option>
        </select>
      </div>

      {precioSugerido && (
        <div className="space-y-1 text-sm text-gray-700">
          <div>🧪 Costo material: <strong>${precioSugerido.costo_material}</strong></div>
          <div>🧾 Precio base: <strong>${precioSugerido.precio_base}</strong></div>
          <div>🎯 Precio final sugerido: <strong>${precioSugerido.precio_final}</strong></div>
          <div>💳 Con débito (6%): <strong>${precioSugerido.precio_con_debito}</strong></div>
        </div>
      )}
    </div>
  );
}
