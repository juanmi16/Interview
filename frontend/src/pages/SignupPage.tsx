/**
 * Signup page. Controlled form that registers a NEW user (role "User"). On
 * success the API returns a JWT, so we log the user in automatically and go
 * straight to the dashboard.
 */
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { authService } from '../services/AuthService'
import type { RegisterRequest } from '../types/auth'
import { useAuth } from '../context/AuthContext'

// estrellas del cielo (solo visual)
const stars = [
  { top: '14%', left: '20%', s: 2, d: 0 },
  { top: '26%', left: '72%', s: 3, d: 1.1 },
  { top: '38%', left: '32%', s: 2, d: 0.5 },
  { top: '20%', left: '50%', s: 1.5, d: 1.8 },
  { top: '52%', left: '80%', s: 2.5, d: 0.8 },
  { top: '64%', left: '22%', s: 2, d: 1.5 },
  { top: '74%', left: '62%', s: 3, d: 0.3 },
  { top: '84%', left: '38%', s: 2, d: 1.0 },
  { top: '46%', left: '14%', s: 1.5, d: 2.2 },
  { top: '58%', left: '52%', s: 1.5, d: 0.6 },
  { top: '30%', left: '88%', s: 2, d: 1.7 },
  { top: '88%', left: '70%', s: 2, d: 0.9 },
]

export default function SignupPage() {
  const navigate = useNavigate()

  // estado del form (los campos que pide RegisterRequest → crea usuario NORMAL)
  const [form, setForm] = React.useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [error, setError] = React.useState('')
  const { setToken } = useAuth()

  // actualiza el campo que cambió (un handler para todos)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await authService.register(form).then((response) => {
        console.log('User registered:', response);
        // Auto-login: set token and navigate to dashboard
        setToken(response.token);
        navigate('/dashboard');
      });

    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred during registration.')
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      <style>{`
        @keyframes glow    { 0%,100%{ opacity:.25 } 50%{ opacity:.55 } }
        @keyframes twinkle { 0%,100%{ opacity:.2; transform:scale(.8) } 50%{ opacity:1; transform:scale(1.15) } }
        @keyframes rise    { from{ transform:translateY(14px); opacity:0 } to{ transform:translateY(0); opacity:1 } }
      `}</style>

      {/* ===== IZQUIERDA — cielo de sabiduría ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center
                      bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">

        {/* aurora */}
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-indigo-600/25 blur-3xl"
             style={{ animation: 'glow 8s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 right-1/4 w-[24rem] h-[24rem] rounded-full bg-violet-600/20 blur-3xl"
             style={{ animation: 'glow 10s ease-in-out infinite' }} />
        <div className="absolute top-16 right-16 w-40 h-40 rounded-full bg-amber-200/15 blur-2xl"
             style={{ animation: 'glow 9s ease-in-out infinite' }} />

        {/* estrellas titilando */}
        {stars.map((st, i) => (
          <span key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-amber-200' : 'bg-white'}`}
            style={{
              top: st.top, left: st.left, width: st.s, height: st.s,
              animation: `twinkle ${2.5 + (i % 4)}s ease-in-out ${st.d}s infinite`,
            }} />
        ))}

        {/* contenido central */}
        <div className="relative z-10 text-center px-14 w-full max-w-md" style={{ animation: 'rise .8s ease-out both' }}>
          <div className="relative mx-auto mb-6 w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-2xl"
                 style={{ animation: 'glow 5s ease-in-out infinite' }} />
            <div className="relative scale-125">
              <Logo />
            </div>
          </div>

          <p className="text-amber-200/70 tracking-[0.5em] text-xs font-semibold mb-5">ATENEA</p>

          <h2 className="text-white text-5xl font-black leading-[1.05] tracking-tight">
            Start seeing<br />
            <span className="bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
              clearly.
            </span>
          </h2>

          <p className="text-white/55 mt-5 max-w-xs mx-auto leading-relaxed">
            Create your account and step into Atenea.
          </p>
        </div>
      </div>

      {/* ===== DERECHA — tu form (intacto) ===== */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-slate-300/50 p-8">
          <div className="flex justify-center mb-3">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-800 mb-1">Create your account</h1>
          <p className="text-center text-sm text-slate-400 mb-6">Join Atenea in a few seconds.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 transition">
              Sign up
            </button>
          </form>

          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
