import React, { useState } from 'react'
import type { User } from '../types/user'
import UserService from '../services/UsersService'


export default function DetailUser({ user, onClose, onSaved }: { user: User, onClose: () => void, onSaved: (updated: User) => void }) {

    const [form, setForm] = useState(user)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setForm({ ...form, [e.target.name]: value })
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const updated = await UserService.update(form.id, form)
        onSaved(updated)
    }

    return (
        // backdrop (cubre todo, click afuera cierra)
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            {/* card (frená el click para que NO cierre) */}
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-4xl">
                <button onClick={onClose} className="float-right">✕</button>



                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        className="border border-slate-300 rounded-lg p-2"
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className="border border-slate-300 rounded-lg p-2"
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="border border-slate-300 rounded-lg p-2"
                    />

                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="border border-slate-300 rounded-lg p-2"
                    />
                    <input
                        type="text"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="border border-slate-300 rounded-lg p-2"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 rounded-full relative transition peer-checked:bg-emerald-500
                                        after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5
                                        after:bg-white after:rounded-full after:transition peer-checked:after:translate-x-5" />
                        <span className="text-sm text-slate-600">{form.isActive ? 'Active' : 'Inactive'}</span>
                    </label>

                    <button type="submit" className="col-span-2 bg-indigo-500 text-white rounded-lg p-2 hover:bg-indigo-600 transition">Save</button>

                </form>
                <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                <p>{user.email}</p>
            </div>
        </div>
    )
}
