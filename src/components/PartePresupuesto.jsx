import { useEffect, useState } from "react";
import PrecioSugeridoIA from "./PrecioSugeridoIA";

export default function PartePresupuesto({
  parte,
  onChange,
  metodoPago,
  precioKilo,
  costoHoraImpresora,
  multiplicador,
}) {
  const [nombre, setNombre] = useState(parte?.nombre || "");
  const [peso, setPeso] = useState(parte?.peso || 0);
  const [tiempo, setTiempo] = useState(parte?.tiempo || 0);
  const [precio, setPrecio] = useState(parte?.precio || 0);
  const [precioEditado, setPrecioEditado] = useState(false);

  useEffect(() => {
    onChange({
      ...parte,
      nombre,
      peso,
      tiempo,
      precio,
    });
  }, [nombre, peso, tiempo, precio]);

  return (
    <div className="p-4 border rounded-xl mb-4 bg-white  shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 ">Nombre de parte</label>
          <input
            type="text"
            className="w-full p-2 rounded border bg-white "
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 ">Peso (g)</label>
          <input
            type="number"
            className="w-full p-2 rounded border bg-white "
            value={peso}
            onChange={(e) => setPeso(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 ">Tiempo (min)</label>
          <input
            type="number"
            className="w-full p-2 rounded border bg-white "
            value={tiempo}
            onChange={(e) => setTiempo(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 ">Precio final ($)</label>
          <input
            type="number"
            className="w-full p-2 rounded border bg-white "
            value={precio}
            onChange={(e) => {
              setPrecioEditado(true);
              setPrecio(parseFloat(e.target.value) || 0);
            }}
          />
        </div>
      </div>

      <div className="mt-4">
        <PrecioSugeridoIA
          peso={peso}
          tiempo={tiempo / 60}
          metodoPago={metodoPago}
          nombre={nombre}
          precioKilo={precioKilo}
          costoHoraImpresora={costoHoraImpresora}
          multiplicador={multiplicador}
          onChangePrecioSugerido={(nuevoPrecio) => {
            if (!precioEditado) {
              setPrecio(nuevoPrecio);
            }
          }}
        />
      </div>
    </div>
  );
}
