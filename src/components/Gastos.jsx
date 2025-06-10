import { useEffect, useState } from "react";
import api from "../services/api";

export default function Gastos() {
  const [proveedores, setProveedores] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);

  const [nuevo, setNuevo] = useState({
    tipo: "",
    descripcion: "",
    fecha: "",
    monto_total: "",
    proveedor_id: "",
    en_cuotas: false,
    cantidad_cuotas: "",
  });

  const [cuotas, setCuotas] = useState([]);

  const cargarProveedores = async () => {
    const res = await api.get("/proveedores");
    setProveedores(res.data);
  };

  const cargarGastos = async () => {
    const res = await api.get("/gastos");
    setGastos(res.data);
  };

  const generarCuotas = () => {
    const num = parseInt(nuevo.cantidad_cuotas);
    const monto = parseFloat(nuevo.monto_total) / num;
    const hoy = new Date(nuevo.fecha || new Date());

    const nuevas = [];
    for (let i = 0; i < num; i++) {
      const fecha = new Date(hoy);
      fecha.setMonth(fecha.getMonth() + i);
      nuevas.push({
        numero_cuota: i + 1,
        monto,
        fecha_vencimiento: fecha.toISOString().split("T")[0],
      });
    }
    setCuotas(nuevas);
  };

  const guardarGasto = async (e) => {
    e.preventDefault();
    const data = {
      ...nuevo,
      monto_total: parseFloat(nuevo.monto_total),
      cantidad_cuotas: nuevo.en_cuotas ? parseInt(nuevo.cantidad_cuotas) : null,
      cuotas: nuevo.en_cuotas ? cuotas : [],
    };

    if (modoEdicion && idEdicion) {
      await api.put(`/gastos/${idEdicion}`, data);
    } else {
      await api.post("/gastos", data);
    }

    setNuevo({
      tipo: "",
      descripcion: "",
      fecha: "",
      monto_total: "",
      proveedor_id: "",
      en_cuotas: false,
      cantidad_cuotas: "",
    });
    setModoEdicion(false);
    setIdEdicion(null);
    setCuotas([]);
    cargarGastos();
  };

  const editarGasto = (g) => {
    setNuevo({
      tipo: g.tipo,
      descripcion: g.descripcion,
      fecha: g.fecha,
      monto_total: g.monto_total,
      proveedor_id: g.proveedor_id,
      en_cuotas: g.en_cuotas,
      cantidad_cuotas: g.cantidad_cuotas || "",
    });
    setModoEdicion(true);
    setIdEdicion(g.id);
    setCuotas(g.Cuota || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarGasto = async (id) => {
    if (window.confirm("¿Seguro que querés eliminar este gasto?")) {
      await api.delete(`/gastos/${id}`);
      cargarGastos();
    }
  };

  const determinarPeriodo = (g) => {
    const hoy = new Date();
    const fechaReferencia = g.en_cuotas
      ? new Date(g.Cuota?.[0]?.fecha_vencimiento)
      : new Date(g.fecha);

    const esMismoMes = fechaReferencia.getMonth() === hoy.getMonth() &&
                       fechaReferencia.getFullYear() === hoy.getFullYear();

    const esMesSiguiente = fechaReferencia.getMonth() === (hoy.getMonth() + 1) % 12 &&
                           (fechaReferencia.getFullYear() === hoy.getFullYear() ||
                            (hoy.getMonth() === 11 && fechaReferencia.getFullYear() === hoy.getFullYear() + 1));

    if (fechaReferencia < hoy) return "Vencido";
    if (esMismoMes) return "Actual";
    if (esMesSiguiente) return "Mes próximo";
    return "Futuro";
  };

  const gastosFiltrados = gastos.filter((g) => {
    const periodo = determinarPeriodo(g);
    if (filtroPeriodo === "todos") return true;
    return periodo === filtroPeriodo;
  });

  useEffect(() => {
    cargarProveedores();
    cargarGastos();
  }, []);

  useEffect(() => {
    if (nuevo.en_cuotas && nuevo.cantidad_cuotas && nuevo.monto_total && nuevo.fecha) {
      generarCuotas();
    } else {
      setCuotas([]);
    }
  }, [nuevo.en_cuotas, nuevo.cantidad_cuotas, nuevo.monto_total, nuevo.fecha]);
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">{modoEdicion ? "✏️ Editar Gasto" : "💸 Registrar Gasto"}</h2>
      <form onSubmit={guardarGasto} className="grid md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="Tipo"
          value={nuevo.tipo}
          onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevo.descripcion}
          onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
          className="border rounded px-3 py-2"
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
          placeholder="Monto total"
          value={nuevo.monto_total}
          onChange={(e) => setNuevo({ ...nuevo, monto_total: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <select
          value={nuevo.proveedor_id}
          onChange={(e) => setNuevo({ ...nuevo, proveedor_id: e.target.value })}
          className="border rounded px-3 py-2"
          required
        >
          <option value="">Seleccionar proveedor</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={nuevo.en_cuotas}
            onChange={(e) => setNuevo({ ...nuevo, en_cuotas: e.target.checked })}
          />
          <span>En cuotas</span>
        </label>
        {nuevo.en_cuotas && (
          <input
            type="number"
            placeholder="Cantidad de cuotas"
            value={nuevo.cantidad_cuotas}
            onChange={(e) => setNuevo({ ...nuevo, cantidad_cuotas: e.target.value })}
            className="border rounded px-3 py-2"
            required
          />
        )}
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 md:col-span-1">
          {modoEdicion ? "Actualizar" : "Guardar"}
        </button>
      </form>

      {cuotas.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-md font-semibold mb-2">🧾 Cuotas generadas</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {cuotas.map((c, i) => (
              <li key={i}>Cuota #{c.numero_cuota} - ${c.monto.toFixed(2)} - Vence: {c.fecha_vencimiento}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-xl font-bold">📄 Gastos registrados</h2>

      <div className="flex items-center space-x-4 mb-4">
        <label>Filtrar por período:</label>
        <select
          value={filtroPeriodo}
          onChange={(e) => setFiltroPeriodo(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="todos">Todos</option>
          <option value="Actual">Actual</option>
          <option value="Mes próximo">Mes próximo</option>
          <option value="Vencido">Vencidos</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Proveedor</th>
              <th className="px-4 py-2">Monto</th>
              <th className="px-4 py-2">Cuotas</th>
              <th className="px-4 py-2">Período</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gastosFiltrados.map((g) => (
              <tr key={g.id} className="border-t">
                <td className="px-4 py-2">{g.fecha}</td>
                <td className="px-4 py-2">{g.tipo}</td>
                <td className="px-4 py-2">{g.descripcion}</td>
                <td className="px-4 py-2">{g.Proveedor?.nombre}</td>
                <td className="px-4 py-2">${parseFloat(g.monto_total).toFixed(2)}</td>
                <td className="px-4 py-2">
                  {g.en_cuotas ? `${g.cantidad_cuotas} cuotas` : "Pago único"}
                </td>
                <td className="px-4 py-2">
                  {(() => {
                    const periodo = determinarPeriodo(g);
                    const clases = {
                      "Vencido": "bg-red-100 text-red-800",
                      "Actual": "bg-green-100 text-green-800",
                      "Mes próximo": "bg-blue-100 text-blue-800",
                      "Futuro": "bg-gray-100 text-gray-800",
                    };
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${clases[periodo]}`}>
                        {periodo}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => editarGasto(g)} className="text-blue-600 hover:underline">✏️</button>
                  <button onClick={() => eliminarGasto(g.id)} className="text-red-600 hover:underline">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
