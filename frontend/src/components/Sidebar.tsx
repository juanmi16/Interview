import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

type NavItem = {
  label: string
  path: string
  icon: ReactNode
  active?: boolean
  isAdminOnly?: boolean
}

const nav: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: 'Users',
    path: '/users',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    isAdminOnly: true,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="4" y1="8" x2="20" y2="8" />
        <circle cx="9" cy="8" r="2.4" fill="currentColor" stroke="none" />
        <line x1="4" y1="16" x2="20" y2="16" />
        <circle cx="15" cy="16" r="2.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const { user, setToken, setUser } = useAuth()
  const initials = user?.name?.split(' ').map(w => w[0]).join('')
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col overflow-hidden text-white
                      bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950
                      border-r border-white/10">

      {/* glow decorativo */}
      <div className="pointer-events-none absolute -top-20 -left-16 w-64 h-64 rounded-full bg-violet-600/25 blur-3xl" />

      {/* logo */}
      <div className="relative z-10 flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black shadow-lg shadow-violet-900/40">
          A
        </div>
        <span className="font-black tracking-tight text-lg">Atenea</span>
        <span className="ml-auto text-[10px] font-semibold tracking-[0.25em] text-white/40">PORTAL</span>
      </div>

      {/* navegación */}
      <nav className="relative z-10 flex-1 px-3 py-5 space-y-1" >
        {nav.map((item) => {
          // ocultar items admin-only si el usuario NO es Admin
          if (item.isAdminOnly && user?.role !== 'Admin') return null

          const isActive = item.path === location.pathname

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
        ${isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-violet-900/40'
                  : 'text-white/55 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              {item.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/90" />}
            </Link>
          )
        })}
      </nav>

      {/* tarjeta de usuario */}
      <div className="relative z-10 border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-slate-900">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
              {user?.role}
            </span>
          </div>
        </div>

        <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium
                           text-white/50 hover:text-white hover:bg-white/5 transition"
          onClick={() => {

            setToken(null)   // limpia estado + localStorage
            setUser(null)
            navigate('/login', { replace: true });

          }}

        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M15 12H4" />
            <path d="M8 8l-4 4 4 4" />
            <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  )
}
