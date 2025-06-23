import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppShell() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  console.log(import.meta.env.VITE_API_URL)
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <Sidebar abierto={sidebarAbierto} onClose={() => setSidebarAbierto(false)} />

      <main className="flex-1 p-4 md:p-8 overflow-auto w-full">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarAbierto(true)}
            className="px-3 py-2 bg-gray-800 text-white rounded shadow"
          >
            ☰ Menú
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
