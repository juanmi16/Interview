import { useEffect, useState } from 'react'
import Loader from '../components/Loader'

// Binance public market-data endpoint (no API key, CORS-friendly, not geo-blocked).
const API = 'https://data-api.binance.vision/api/v3/klines'

const COINS = [
  { symbol: 'BTCUSDT', name: 'Bitcoin', ticker: 'BTC', badge: 'bg-amber-100 text-amber-700' },
  { symbol: 'ETHUSDT', name: 'Ethereum', ticker: 'ETH', badge: 'bg-indigo-100 text-indigo-700' },
  { symbol: 'LINKUSDT', name: 'Chainlink', ticker: 'LINK', badge: 'bg-sky-100 text-sky-700' },
  { symbol: 'SOLUSDT', name: 'Solana', ticker: 'SOL', badge: 'bg-violet-100 text-violet-700' },
]

type Market = {
  symbol: string
  name: string
  ticker: string
  badge: string
  price: number
  changePct: number
  closes: number[]
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: n < 1 ? 4 : 2 })

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    const load = async () => {
      try {
        const results = await Promise.all(
          COINS.map(async (coin) => {
            const res = await fetch(`${API}?symbol=${coin.symbol}&interval=1h&limit=24`)
            const klines: any[] = await res.json()
            const closes = klines.map((k) => parseFloat(k[4])) // index 4 = close price
            const firstOpen = parseFloat(klines[0][1])         // index 1 = open price
            const price = closes[closes.length - 1]
            const changePct = ((price - firstOpen) / firstOpen) * 100
            return { ...coin, price, changePct, closes }
          })
        )
        if (alive) {
          setMarkets(results)
          setLoading(false)
        }
      } catch (e) {
        console.error('Error fetching markets:', e)
        if (alive) setLoading(false)
      }
    }

    load()
    const timer = setInterval(load, 30000) // refresh every 30s → feels live
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Markets</h1>
          <p className="text-sm text-slate-500">Live prices — last 24h · powered by Binance</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* coin cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {markets.map((m) => {
          const up = m.changePct >= 0
          const color = up ? '#10b981' : '#ef4444'

          // build the area chart path from the close prices
          const W = 320, H = 90
          const min = Math.min(...m.closes)
          const max = Math.max(...m.closes)
          const range = max - min || 1
          const stepX = W / (m.closes.length - 1)
          const pts = m.closes.map(
            (v, i) => `${(i * stepX).toFixed(1)},${(H - ((v - min) / range) * H).toFixed(1)}`
          )
          const line = 'M' + pts.join(' L')
          const area = `${line} L${W},${H} L0,${H} Z`

          return (
            <div key={m.symbol} className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-5 overflow-hidden">
              {/* top row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${m.badge}`}>
                    {m.ticker}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {m.ticker}<span className="text-slate-400 font-normal">/USDT</span>
                    </p>
                    <p className="text-xs text-slate-400">{m.name}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {up ? '▲' : '▼'} {Math.abs(m.changePct).toFixed(2)}%
                </span>
              </div>

              {/* price */}
              <div className="mt-3 text-2xl font-bold text-slate-800">${fmt(m.price)}</div>

              {/* chart */}
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-24 mt-3">
                <defs>
                  <linearGradient id={`grad-${m.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={area} fill={`url(#grad-${m.symbol})`} />
                <path
                  d={line}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
                />
              </svg>
            </div>
          )
        })}
      </div>
    </div>
  )
}
