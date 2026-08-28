type Props = {
  message: string
  onConfirm: () => Promise<void> | void   // 🎓 el que EJECUTA (cualquier endpoint)
  onCancel: () => void
}

export default function ConfirmDelete({ message, onConfirm, onCancel }: Props) {
  return (
    // backdrop
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
    >
      <style>{`
        @keyframes popIn { from { opacity:0; transform: scale(.94) translateY(8px) }
                           to   { opacity:1; transform: scale(1)   translateY(0) } }
      `}</style>

      {/* card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center"
        style={{ animation: 'popIn .18s ease-out' }}
      >
        {/* ícono de peligro */}
        <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-600">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-800">¿Estás seguro?</h3>
        <p className="mt-1 text-sm text-slate-500">{message}</p>

        {/* botones */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
