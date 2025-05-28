import { NavLink } from "react-router-dom";

const navItems = [
  {
    title: "Inicio",
    items: [{ to: "/dashboard", label: "Dashboard", icon: "🏠" }],
  },
  {
    title: "Ventas",
    items: [
      { to: "/ventas", label: "Nueva venta", icon: "🛒" },
      { to: "/historial", label: "Historial", icon: "📜" },
      { to: "/ventas-horas", label: "Ventas por hora", icon: "⏱️" },
      { to: "/pedidos/nuevo", label: "Nuevo Pedido", icon: "📝" },
      { to: "/presupuestos", label: "Presupuestos", icon: "📝" },
      { to: "/pedidos", label: "Historial Pedidos", icon: "📦" }, // ← este
    ],
  },
  {
    title: "Productos",
    items: [
      { to: "/productos", label: "Listado", icon: "📦" },
      { to: "/importar", label: "Importar", icon: "📁" },
      { to: "/reposicion", label: "Reposicion", icon: "♻️" },
      { to: "/presupuestos/nuevo", label: "Nuevo Presupuesto", icon: "📐" },
      { to: "/pedidos/nuevo", label: "Nuevo Pedido", icon: "📝" },
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
    items: [{ to: "/parametros", label: "Parámetros", icon: "⚙️" }],
  },
];

export default function Sidebar({ abierto, onClose }) {
  return (
    <>
      {/* Mobile sidebar (overlay) */}
      {abierto && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden" onClick={onClose}>
          <div
            className="bg-white w-64 h-full p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">🧠 Impresion4nte</h2>
              <button onClick={onClose} className="text-gray-500 text-2xl leading-none">×</button>
            </div>
            <Navegacion onClickItem={onClose} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 min-h-screen bg-white shadow-md">
        <div className="p-4 text-xl font-bold border-b">🧠 Impresion4nte</div>
        <Navegacion />
      </aside>
    </>
  );
}

function Navegacion({ onClickItem = () => {} }) {
  return (
    <nav className="p-4 space-y-6 text-sm">
      {navItems.map((section) => (
        <div key={section.title}>
          <div className="text-xs text-gray-400 uppercase font-semibold mb-1">{section.title}</div>
          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClickItem}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 ${
                      isActive ? "bg-gray-200 font-semibold" : "text-gray-700"
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
