/**
 * Dashboard — the landing page after login. Fetches aggregated user stats
 * (GET /api/users/stats) and shows KPI cards + status/role breakdown bars.
 */
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import UserService from '../services/UsersService'
import type { UserStats } from '../types/stats'
import Loader from '../components/Loader'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await UserService.getStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    loadStats()
  }, [])

  if (!stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  const firstName = user?.name?.split(' ')[0] ?? 'there'
  const activePct = stats.total ? Math.round((stats.active / stats.total) * 100) : 0
  const adminPct = stats.total ? Math.round((stats.admins / stats.total) * 100) : 0

  const cards = [
    {
      label: 'Total users',
      value: stats.total,
      iconBg: 'bg-indigo-50', iconText: 'text-indigo-600',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: 'Active',
      value: stats.active,
      hint: `${activePct}% of total`,
      iconBg: 'bg-emerald-50', iconText: 'text-emerald-600',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4 12 14.01l-3-3" />
        </svg>
      ),
    },
    {
      label: 'Inactive',
      value: stats.inactive,
      iconBg: 'bg-slate-100', iconText: 'text-slate-500',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
    {
      label: 'Admins',
      value: stats.admins,
      hint: `${adminPct}% of total`,
      iconBg: 'bg-amber-50', iconText: 'text-amber-600',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">

      {/* header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome back, {firstName} 👋</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{c.label}</span>
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.iconBg} ${c.iconText}`}>
                {c.icon}
              </span>
            </div>
            <div className="mt-3 text-3xl font-bold text-slate-800">{c.value}</div>
            <div className="mt-1 text-xs text-slate-400">{c.hint ?? ' '}</div>
          </div>
        ))}
      </div>

      {/* breakdown */}
      <div className="grid lg:grid-cols-2 gap-4 mt-6">

        {/* user status */}
        <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-4">User status</h3>
          <div className="flex h-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500" style={{ width: `${activePct}%` }} />
            <div className="bg-slate-200 flex-1" />
          </div>
          <div className="mt-4 flex gap-6 text-sm">
            <Legend color="bg-emerald-500" label="Active" value={stats.active} />
            <Legend color="bg-slate-300" label="Inactive" value={stats.inactive} />
          </div>
        </div>

        {/* roles */}
        <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Roles</h3>
          <div className="flex h-3 rounded-full overflow-hidden">
            <div className="bg-amber-400" style={{ width: `${adminPct}%` }} />
            <div className="bg-indigo-500 flex-1" />
          </div>
          <div className="mt-4 flex gap-6 text-sm">
            <Legend color="bg-amber-400" label="Admins" value={stats.admins} />
            <Legend color="bg-indigo-500" label="Regular" value={stats.regular} />
          </div>
        </div>

      </div>
    </div>
  )
}

// small legend item for the breakdown bars
function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  )
}
