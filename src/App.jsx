import { Routes, Route } from "react-router-dom";
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
import AppShell from "./components/AppShell";
import Reposicion from "./components/Reposicion";
import NuevoPedido from "./components/NuevoPedido";
import Presupuesto from "./components/Presupuesto";
import HistorialPedidos from "./components/HistorialPedidos";
import ListadoPresupuestos from "./components/ListadoPresupuestos";
import RankingProductos from "./components/RankingProductos";
import StockValorizado from "./components/StockValorizado";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="productos" element={<Productos />} />
        <Route path="ingresos" element={<Ingresos />} />
        <Route path="gastos" element={<Gastos />} />
        <Route path="proveedores" element={<Proveedores />} />
        <Route path="parametros" element={<Parametros />} />
        <Route path="importar" element={<ImportarProductos />} />
        <Route path="ventas" element={<NuevaVenta />} />
        <Route path="historial" element={<HistorialVentas />} />
        <Route path="ventas-horas" element={<GraficoVentasPorHora />} />
        <Route path="/pedidos/nuevo" element={<NuevoPedido />} />
        <Route path="/presupuestos" element={<ListadoPresupuestos />} />
        <Route path="/presupuestos/nuevo" element={<Presupuesto />} />
        <Route path="/pedidos" element={<HistorialPedidos />} />
        <Route path="/reposicion" element={<Reposicion />} />
        <Route path="/ranking" element={<RankingProductos />}/> 
        <Route path="/stock-valorizado" element={<StockValorizado />}/> 
        <Route path="*" element={<div className="p-6 text-center">Página no encontrada</div>} />
      </Route>
    </Routes>
  );
}
