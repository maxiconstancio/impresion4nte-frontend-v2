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

    // Enviar al backend
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
    <div className="p-4 bg-white  rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">💡 Precio sugerido con IA</h3>
      <p className="text-2xl font-bold">
        ${precioFinal.toFixed(2)}{" "}
        {metodoPago === "debito" && (
          <span className="text-sm">(incluye 6%)</span>
        )}
      </p>
    </div>
  );
}
