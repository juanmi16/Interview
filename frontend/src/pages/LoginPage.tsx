/**
 * Login page. Split screen: a decorative "night sky" panel (Atenea's owl) on
 * the left, and the login form on the right. On submit it calls authService.login,
 * stores the token via the auth context, and navigates to the dashboard.
 */
import React from 'react';
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/AuthService'

// --- estrellas del cielo (solo visual) ---
const stars = [
  { top: '12%', left: '18%', s: 2, d: 0 },
  { top: '22%', left: '70%', s: 3, d: 1.2 },
  { top: '35%', left: '30%', s: 2, d: 0.5 },
  { top: '18%', left: '45%', s: 1.5, d: 2 },
  { top: '48%', left: '80%', s: 2.5, d: 0.8 },
  { top: '60%', left: '20%', s: 2, d: 1.6 },
  { top: '72%', left: '60%', s: 3, d: 0.3 },
  { top: '82%', left: '35%', s: 2, d: 1.1 },
  { top: '30%', left: '88%', s: 1.5, d: 2.2 },
  { top: '55%', left: '48%', s: 1.5, d: 0.6 },
  { top: '68%', left: '85%', s: 2, d: 1.9 },
  { top: '88%', left: '72%', s: 2.5, d: 0.9 },
  { top: '8%', left: '60%', s: 1.5, d: 1.4 },
  { top: '42%', left: '12%', s: 2, d: 2.5 },
  { top: '78%', left: '15%', s: 1.5, d: 0.4 },
  { top: '15%', left: '82%', s: 2, d: 1.7 },
  { top: '50%', left: '65%', s: 1.5, d: 2.1 },
  { top: '90%', left: '50%', s: 2, d: 0.7 },
]

// --- constelación: puntos conectados (solo visual) ---
const constPoints = [
  [60, 80], [110, 50], [165, 88], [215, 58],
  [150, 140], [95, 175], [185, 200], [130, 235],
]
const constLines = [
  [0, 1], [1, 2], [2, 3], [1, 4], [2, 4], [4, 5], [4, 6], [5, 7], [6, 7],
]

export default function LoginPage() {

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const emailValido = /\S+@\S+\.\S+/.test(email);

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* animaciones */}
      <style>{`
        @keyframes glow    { 0%,100%{ opacity:.25 } 50%{ opacity:.55 } }
        @keyframes twinkle { 0%,100%{ opacity:.2; transform:scale(.8) } 50%{ opacity:1; transform:scale(1.15) } }
        @keyframes drift   { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-10px) } }
        @keyframes shoot   { 0%{ transform:translate(0,0); opacity:0 } 8%{ opacity:1 } 100%{ transform:translate(240px,150px); opacity:0 } }
        @keyframes rise    { from{ transform:translateY(14px); opacity:0 } to{ transform:translateY(0); opacity:1 } }
      `}</style>

      {/* ===== IZQUIERDA — cielo de sabiduría ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center
                      bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">

        {/* aurora de fondo */}
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-indigo-600/25 blur-3xl"
             style={{ animation: 'glow 8s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 right-1/4 w-[24rem] h-[24rem] rounded-full bg-violet-600/20 blur-3xl"
             style={{ animation: 'glow 10s ease-in-out infinite' }} />

        {/* luna (glow suave) */}
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

        {/* estrella fugaz */}
        <div className="absolute top-24 left-10 w-16 h-px bg-gradient-to-r from-white to-transparent -rotate-[25deg]"
             style={{ animation: 'shoot 6s ease-in-out 2s infinite' }} />

        {/* constelación dorada */}
        <svg viewBox="0 0 280 280" className="absolute left-10 top-1/2 -translate-y-1/2 w-72 opacity-40"
             style={{ animation: 'drift 12s ease-in-out infinite' }}>
          {constLines.map(([a, b], i) => (
            <line key={i}
              x1={constPoints[a][0]} y1={constPoints[a][1]}
              x2={constPoints[b][0]} y2={constPoints[b][1]}
              stroke="#fcd34d" strokeWidth="1" strokeOpacity="0.5" />
          ))}
          {constPoints.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 3 : 2} fill="#fde68a"
              style={{ filter: 'drop-shadow(0 0 4px #fcd34d)' }} />
          ))}
        </svg>

        {/* contenido central */}
        <div className="relative z-10 text-center px-14 w-full max-w-md" style={{ animation: 'rise .8s ease-out both' }}>

          {/* búho con halo */}
          <div className="relative mx-auto mb-6 w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-2xl"
                 style={{ animation: 'glow 5s ease-in-out infinite' }} />
            <div className="relative scale-125">
              <Logo />
            </div>
          </div>

          <p className="text-amber-200/70 tracking-[0.5em] text-xs font-semibold mb-5">ATENEA</p>

          <h2 className="text-white text-5xl font-black leading-[1.05] tracking-tight">
            See what<br />
            <span className="bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
              others miss.
            </span>
          </h2>

          <p className="text-white/55 mt-5 max-w-xs mx-auto leading-relaxed">
            Sharp insight, calm decisions — clarity in every step.
          </p>
        </div>
      </div>

      {/* ===== DERECHA — tu form (intacto) ===== */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-slate-300/50 p-8">
          <div className="flex justify-center mb-3">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-800 mb-1">
            Log in to Atenea
          </h1>
          <p className="text-center text-sm text-slate-400 mb-6">Welcome back — good to see you again.</p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const { token } = await authService.login({ email, password })
                setToken(token)
                navigate('/dashboard')

              } catch (error) {
                setError("An error while setting the Token has occured ")
              }
            }}
            className="space-y-4"
          >

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {emailValido && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}

            {emailValido && password.length > 0 && (
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 transition">
                Log in
              </button>
            )}

          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{' '}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>

          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </div>
      </div>
    </div>
  )
}
