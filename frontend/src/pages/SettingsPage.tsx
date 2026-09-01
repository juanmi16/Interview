import { useAuth } from '../context/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const initials = (user?.name ?? '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const rows = [
    { label: 'Full name', value: user?.name ?? '—' },
    { label: 'Email', value: user?.email ?? '—' },
    { label: 'Role', value: user?.role ?? '—' },
    { label: 'User ID', value: user ? `#${user.id}` : '—' },
  ]

  return (
    <div className="max-w-3xl mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account</p>
      </div>

      {/* profile card */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {initials || '?'}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-slate-800 truncate">{user?.name ?? '—'}</p>
          <p className="text-sm text-slate-400 truncate">{user?.email ?? '—'}</p>
          <span className={`mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${
            isAdmin ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-indigo-50 text-indigo-700 ring-indigo-200'}`}>
            {user?.role ?? '—'}
          </span>
        </div>
      </div>

      {/* account details */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm mt-4 divide-y divide-slate-100">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-slate-500">{r.label}</span>
            <span className="text-sm font-medium text-slate-800">{r.value}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
