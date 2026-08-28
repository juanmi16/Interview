// Loader temático de Atenea: un búho volando (aletea + flota) con destellos.
// Uso: {user ? <Content/> : <Loader />}

export default function Loader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <style>{`
        @keyframes bob      { 0%,100%{ transform: translateY(0) }    50%{ transform: translateY(-10px) } }
        @keyframes flapL    { 0%,100%{ transform: rotate(6deg) }     50%{ transform: rotate(-34deg) } }
        @keyframes flapR    { 0%,100%{ transform: rotate(-6deg) }    50%{ transform: rotate(34deg) } }
        @keyframes tw       { 0%,100%{ opacity:.2; transform:scale(.7) } 50%{ opacity:1; transform:scale(1) } }
        @keyframes bounceDot{ 0%,80%,100%{ transform: translateY(0); opacity:.35 } 40%{ transform: translateY(-7px); opacity:1 } }
      `}</style>

      {/* búho que flota */}
      <div className="relative" style={{ animation: 'bob 1.6s ease-in-out infinite' }}>
        {/* destellos */}
        <span className="absolute -left-3 top-3 w-1.5 h-1.5 rounded-full bg-amber-400" style={{ animation: 'tw 1.8s ease-in-out infinite' }} />
        <span className="absolute -right-2 top-8 w-1 h-1 rounded-full bg-amber-300" style={{ animation: 'tw 2.2s ease-in-out .4s infinite' }} />
        <span className="absolute right-3 -bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ animation: 'tw 2s ease-in-out .8s infinite' }} />

        <svg viewBox="0 0 120 110" className="w-28 h-28">
          <defs>
            <linearGradient id="owlBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
          </defs>

          {/* alas (aletean) */}
          <g style={{ transformBox: 'fill-box', transformOrigin: 'top right', animation: 'flapL .6s ease-in-out infinite' }}>
            <path d="M40 50 Q14 56 24 84 Q38 72 42 60 Z" fill="#4f46e5" />
          </g>
          <g style={{ transformBox: 'fill-box', transformOrigin: 'top left', animation: 'flapR .6s ease-in-out infinite' }}>
            <path d="M80 50 Q106 56 96 84 Q82 72 78 60 Z" fill="#4f46e5" />
          </g>

          {/* orejitas */}
          <path d="M46 30 L40 14 L54 26 Z" fill="#4338ca" />
          <path d="M74 30 L80 14 L66 26 Z" fill="#4338ca" />

          {/* cuerpo */}
          <ellipse cx="60" cy="60" rx="30" ry="34" fill="url(#owlBody)" />

          {/* ojos */}
          <circle cx="49" cy="52" r="12" fill="#fff" />
          <circle cx="71" cy="52" r="12" fill="#fff" />
          <circle cx="49" cy="52" r="12" fill="none" stroke="#fcd34d" strokeWidth="2.5" />
          <circle cx="71" cy="52" r="12" fill="none" stroke="#fcd34d" strokeWidth="2.5" />
          <circle cx="49" cy="52" r="4.5" fill="#312e81" />
          <circle cx="71" cy="52" r="4.5" fill="#312e81" />

          {/* pico */}
          <path d="M55 62 L65 62 L60 71 Z" fill="#f59e0b" />

          {/* patitas */}
          <path d="M52 92 l-3 6 M56 93 l0 6 M64 93 l0 6 M68 92 l3 6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* texto + puntos */}
      <div className="flex items-center text-slate-500 font-medium">
        {label}
        <span className="flex gap-1 ml-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" style={{ animation: 'bounceDot 1.2s ease-in-out infinite' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" style={{ animation: 'bounceDot 1.2s ease-in-out .2s infinite' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" style={{ animation: 'bounceDot 1.2s ease-in-out .4s infinite' }} />
        </span>
      </div>
    </div>
  )
}
