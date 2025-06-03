// /components/PrecioSugeridoIA.jsx

import { useEffect, useState } from "react";
import axios from "axios";

export default function PrecioSugeridoIA({
  peso,
  tiempo,
  metodoPago = "efectivo",
  precioKilo = 8000,
  costoHoraImpresora = 250,
  multiplicador = 3,
  nombre = "",
  onChangePrecioSugerido,
}) {
  const [precioFinal, setPrecioFinal] = useState(0);

  useEffect(() => {
    if (!peso || !tiempo) return;

    const costoMaterial = (peso / 1000) * precioKilo;
    const costoImpresora = tiempo * costoHoraImpresora;
    let totalBase = (costoMaterial + costoImpresora) * multiplicador;

    if (metodoPago === "debito") {
      totalBase *= 1.06;
    }

    const precioRedondeado = Math.round(totalBase * 100) / 100;
    setPrecioFinal(precioRedondeado);
    if (onChangePrecioSugerido) onChangePrecioSugerido(precioRedondeado);

    axios
      .post("/api/preciosugerido", {
        nombre,
        peso,
        tiempo,
        metodoPago,
        precioCalculado: precioRedondeado,
        precioKilo,
        costoHoraImpresora,
        multiplicador,
      })
      .catch((error) => {
        console.error("Error registrando precio sugerido:", error);
      });
  }, [peso, tiempo, metodoPago, precioKilo, costoHoraImpresora, multiplicador]);

  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 mt-4 rounded-lg border">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        💡 Precio sugerido: <span className="font-bold">${precioFinal.toFixed(2)}</span>
        {metodoPago === "debito" && <span className="text-xs"> (incluye 6%)</span>}
      </p>
    </div>
  );
}
