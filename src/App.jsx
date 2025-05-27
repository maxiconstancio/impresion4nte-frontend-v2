import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Ingresos from "./components/Ingresos";
import Gastos from "./components/Gastos";
import Proveedores from "./components/Proveedores";
import Productos from "./components/Productos";
import Parametros from "./components/Parametros";
import NuevaVenta from "./components/NuevaVenta";
import ImportarProductos from "./components/ImportarProductos";
import HistorialVentas from "./components/HistorialVentas";
import GraficoVentasPorHora from "./components/GraficoVentasPorHora";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wide">Impresion4nte</h1>
          <nav className="flex gap-6 text-sm">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/ventas"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"
              }
            >
              Ventas
            </NavLink>
            <NavLink
              to="/historial"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"
              }
            >
              Historial
            </NavLink>
            <NavLink
              to="/ventas-horas"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"
              }
            >
              Ventas por hora
            </NavLink>
            <NavLink
              to="/productos"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"
              }
            >
              Productos
            </NavLink>
            <NavLink
              to="/ingresos"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"
              }
            >
              Ingresos
            </NavLink>
            <NavLink
              to="/gastos"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"
              }
            >
              Gastos
            </NavLink>
            <NavLink
              to="/proveedores"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"
              }
            >
              Proveedores
            </NavLink>
            <NavLink
              to="/parametros"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"
              }
            >
              Parametros
            </NavLink>
            <NavLink
              to="/importar"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"
              }
            >
              Importar
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ingresos" element={<Ingresos />} />
          <Route path="/gastos" element={<Gastos />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/parametros" element={<Parametros />} />
          <Route path="/importar" element={<ImportarProductos />} />
          <Route path="/ventas" element={<NuevaVenta />} />
          <Route path="/historial" element={<HistorialVentas />} />
          <Route path="/ventas-horas" element={<GraficoVentasPorHora />} />
          <Route path="*" element={<div className="text-center text-gray-500">Página no encontrada</div>} />
        </Routes>
      </main>
    </div>
  );
}
