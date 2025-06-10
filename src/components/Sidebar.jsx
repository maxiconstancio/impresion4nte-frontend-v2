import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import logo from "../assets/logo_claro.png"; // asegurate que el logo esté en esta ruta

const navItems = [
  {
    title: "Inicio",
    items: [{ to: "/dashboard", label: "Dashboard", icon: "🏠" }],
  },
  {
    title: "Productos",
    key: "productos",
    items: [
      { to: "/productos", label: "Listado", icon: "📦" },
      { to: "/ranking", label: "Ranking", icon: "🏅" },
      { to: "/reposicion", label: "Reposición", icon: "♻️", badgeKey: "reposicion" },
    ],
  },
  {
    title: "Ventas",
    items: [
      { to: "/ventas", label: "Nueva venta", icon: "🛒" },
      { to: "/historial", label: "Historial", icon: "📜" },
      { to: "/ventas-horas", label: "Ventas por hora", icon: "⏱️" },
    ],
  },
  {
    title: "Presupuestos",
    items: [
      { to: "/presupuestos/nuevo", label: "Nuevo presupuesto", icon: "📐" },
      { to: "/presupuestos", label: "Listado", icon: "📝" },
    ],
  },
  {
    title: "Pedidos",
    items: [
      { to: "/pedidos/nuevo", label: "Nuevo pedido", icon: "➕" },
      { to: "/pedidos", label: "Historial", icon: "📦" },
    ],
  },
  {
    title: "Finanzas",
    items: [
      { to: "/ingresos", label: "Ingresos", icon: "💵" },
      { to: "/gastos", label: "Gastos", icon: "💸" },
      { to: "/proveedores", label: "Proveedores", icon: "👥" },
    ],
  },
  {
    title: "Ajustes",
    items: [
      { to: "/parametros", label: "Parámetros", icon: "⚙️" },
      { to: "/importar", label: "Importar", icon: "📁" },
    ],
  },
];

export default function Sidebar({ abierto, onClose }) {
  return (
    <>
      {/* Mobile */}
      {abierto && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden" onClick={onClose}>
          <div
            className="bg-white w-64 h-full p-4 shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">🧠 Impresion4nte</h2>
              <button onClick={onClose} className="text-gray-500 text-2xl leading-none">×</button>
            </div>
            <Navegacion mobile onClickItem={onClose} />
          </div>
        </div>
      )}

      {/* Desktop */}
      <aside className="hidden md:block w-64 min-h-screen bg-white shadow-md text-gray-800 font-sans antialiased">
        <div className="p-4 flex items-center gap-3 border-b">
          <img src={logo} alt="Logo Impresion4nte" className="w-10 h-10 rounded-md" />
          <span className="text-lg font-extrabold tracking-tight">Impresion4nte</span>
        </div>
        <Navegacion />
      </aside>
    </>
  );
}

function Navegacion({ onClickItem = () => {}, mobile = false }) {
  const [expanded, setExpanded] = useState(null);
  const [alertas, setAlertas] = useState({ reposicion: false });

  useEffect(() => {
    const verificarReposicion = async () => {
      try {
        const res = await api.get("/productos/sugerir-reposicion-feria");
        const mostrar = res.data?.some(
          (p) => p.stock_minimo_sugerido !== p.stock_minimo_actual
        );
        setAlertas((prev) => ({ ...prev, reposicion: mostrar }));
      } catch (error) {
        console.error("Error verificando sugerencias de reposición");
      }
    };
    verificarReposicion();
  }, []);

  return (
    <nav className="p-4 space-y-6 text-sm">
      {navItems.map((section, i) => (
        <div key={section.title}>
          <div
            className="text-[11px] text-gray-500 uppercase font-semibold tracking-wider mb-2 pl-2"
            onClick={() => (mobile ? setExpanded((prev) => (prev === i ? null : i)) : null)}
          >
            {section.title}
          </div>

          {(mobile ? expanded === i : true) && (
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClickItem}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="bg-gray-200 text-gray-800 w-7 h-7 flex items-center justify-center rounded-full text-base">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badgeKey && alertas[item.badgeKey] && (
                      <span className="ml-auto text-xs text-red-600 font-bold">🔥</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
}
