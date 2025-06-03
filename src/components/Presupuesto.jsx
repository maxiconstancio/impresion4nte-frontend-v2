import { useEffect, useState } from "react";
import api from "../services/api";
import { obtenerParametros } from "../services/parametroService";
import PartePresupuesto from "../components/PartePresupuesto";

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
        setPartes([...partes, { nombre: "", peso: 0, tiempo: 0, precio: 0 }]);
    };

    const actualizarParte = (index, nuevaParte) => {
        const nuevas = [...partes];
        nuevas[index] = nuevaParte;
        setPartes(nuevas);
    };

    const total = partes.reduce((acc, p) => acc + (parseFloat(p.precio) || 0), 0);

    const confirmarPedido = async () => {
        const productos = partes.map((p) => ({
            nombre: p.nombre,
            cantidad: 1,
            observaciones: `Peso: ${p.peso}g, Tiempo: ${p.tiempo}min`,
            precio_unitario: parseFloat(p.precio),
        }));

        const res = await api.post("/pedidos", {
            cliente,
            estado: "presupuesto",
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
                    <div key={index} className="relative">
                        <PartePresupuesto
                            parte={parte}
                            metodoPago="efectivo"
                            precioKilo={parametros.precio_filamento_kg}
                            costoHoraImpresora={parametros.costo_hora_impresora}
                            multiplicador={parametros.multiplicador_venta}
                            onChange={(nuevaParte) => actualizarParte(index, nuevaParte)}
                        />
                        <button
                            onClick={() =>
                                setPartes(partes.filter((_, i) => i !== index))
                            }
                            className="absolute top-2 right-2 text-red-500"
                        >
                            ✕
                        </button>
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
