import React, { useEffect, useReducer, useState } from 'react'
import TodoService from '../services/TodoService'
import type { Todo } from '../types/todo'
import Loader from '../components/Loader'

/**
 * PRICE ALERTS
 * A per-user list of price targets ("BTC above $70,000"). The user can add
 * targets, check them off when they hit, and delete them. It's backed by the
 * generic /api/todos resource (Title = the alert text, IsDone = "hit").
 *
 * State is managed with `useReducer`: instead of many setState calls, ONE
 * reducer handles every change to the list based on dispatched actions.
 */

// 1) The "vocabulary": every way the list can change is described as an action.
type Action =
  | { type: 'SET'; alerts: Todo[] }   // replace the whole list (initial load)
  | { type: 'ADD'; alert: Todo }      // prepend a new alert
  | { type: 'TOGGLE'; alert: Todo }   // replace one alert with its updated version
  | { type: 'REMOVE'; id: number }    // drop one alert by id

// 2) The reducer: a PURE function (state, action) => new state.
//    It never mutates `state`; it always returns a brand-new array.
function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'SET':
      return action.alerts
    case 'ADD':
      return [action.alert, ...state]                                   // newest first
    case 'TOGGLE':
      return state.map(a => (a.id === action.alert.id ? action.alert : a)) // swap the toggled one
    case 'REMOVE':
      return state.filter(a => a.id !== action.id)                      // keep everyone else
    default:
      return state
  }
}

export default function AlertsPage() {
  // 3) useReducer gives us [state, dispatch]. We change state by dispatching actions.
  const [alerts, dispatch] = useReducer(reducer, [])
  const [title, setTitle] = useState('')   // controlled input for the new alert
  const [loading, setLoading] = useState(true)

  // Load the user's alerts once, on mount.
  useEffect(() => {
    TodoService.getMyTodos()
      .then(data => dispatch({ type: 'SET', alerts: data }))
      .catch(err => console.error('Error loading alerts:', err))
      .finally(() => setLoading(false))
  }, [])

  // Create: persist on the server, then add the returned row to the list.
  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    const created = await TodoService.create(title.trim())
    dispatch({ type: 'ADD', alert: created })
    setTitle('')
  }

  // Toggle "hit": the server flips IsDone and returns the updated row.
  const toggle = async (id: number) => {
    const updated = await TodoService.toggle(id)
    dispatch({ type: 'TOGGLE', alert: updated })
  }

  // Delete: remove on the server, then drop it from the list.
  const remove = async (id: number) => {
    await TodoService.remove(id)
    dispatch({ type: 'REMOVE', id })
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  const hit = alerts.filter(a => a.isDone).length

  return (
    <div className="max-w-3xl mx-auto">

      {/* header */}
      <div className="mb-6 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Price Alerts</h1>
          <p className="text-sm text-slate-500">Track your target prices — check them off when they hit.</p>
        </div>
      </div>

      {/* new-alert form */}
      <form onSubmit={add} className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-4 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. BTC above $70,000"
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
          Add
        </button>
      </form>

      {/* summary */}
      <p className="text-xs text-slate-400 mt-3 mb-2 px-1">
        {alerts.length} alert{alerts.length !== 1 ? 's' : ''} · {hit} hit
      </p>

      {/* list */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {alerts.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-10">No alerts yet. Add your first target above.</p>
        ) : (
          alerts.map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/70 transition">
              {/* toggle "hit" */}
              <input
                type="checkbox"
                checked={a.isDone}
                onChange={() => toggle(a.id)}
                className="w-5 h-5 accent-emerald-600 cursor-pointer shrink-0"
              />
              {/* the alert text (struck through once it hit) */}
              <span className={`flex-1 text-sm ${a.isDone ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {a.title}
              </span>
              {/* delete */}
              <button
                onClick={() => remove(a.id)}
                title="Delete"
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
