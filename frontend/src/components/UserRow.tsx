import React, { memo } from 'react';
import type { User } from '../types/user';

type Props = {
  user: User
  onEdit: (u: User) => void
  onDelete: (u: User) => void
}

export default memo ( function UserRow({ user, onEdit, onDelete }: Props) {

    // iniciales para el avatar (ej. "Juanmi Angulo" -> "JA")
    const initials = (u: User) =>
        `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase()
    const isAdmin = user.role === 'Admin'

    return (

       <tr className="hover:bg-slate-50/70 transition">
                                        {/* user */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                    {initials(user)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 truncate">{user.firstName} {user.lastName}</p>
                                                    <p className="text-slate-400 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* phone */}
                                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{user.phone || '—'}</td>
                                        {/* role */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${isAdmin ? 'bg-amber-50 text-amber-700 ring-amber-200'
                                                : 'bg-slate-50 text-slate-600 ring-slate-200'}`}>
                                                {isAdmin && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                                                {user.role ?? '—'}
                                            </span>
                                        </td>
                                        {/* status */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-slate-600 whitespace-nowrap">
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        {/* joined */}
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                : '—'}
                                        </td>
                                        {/* actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() =>
                                                    onEdit(user)
                                                } title="Edit"
                                                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                        <path d="M12 20h9" />
                                                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() =>
                                                    onDelete(user)
                                                } title="Delete"
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                        <path d="M3 6h18" />
                                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                        <path d="M10 11v6M14 11v6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
    )
})