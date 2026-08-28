import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

// Shared layout for all private pages: the Sidebar + toggle button stay
// mounted, and each page renders inside <Outlet /> (so the menu never
// disappears when you navigate between /dashboard, /users, etc.).
export default function DashboardLayout() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex min-h-screen">

      {/* MENÚ fijo a la izquierda — SOLO si open */}
      {open && <Sidebar />}

      {/* contenido + botón (el botón SIEMPRE visible) */}
      <main className="flex-1 p-6">
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition text-xl">
          ☰
        </button>

        {/* Outlet: acá se renderiza la página hija (Dashboard, Users...) */}
        <Outlet />
      </main>

    </div>
  )
}
