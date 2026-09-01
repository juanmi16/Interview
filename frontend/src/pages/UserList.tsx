import { useEffect, useState } from 'react'
import UserService from '../services/UsersService'
import type { User } from '../types/user'
import DetailUser from './DetailUser'
import ConfirmDelete from './ConfirmDelete'
import UserRow from '../components/UserRow'

export default function UserList() {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    const [search, setSearch] = useState('')

    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10   // ← los de ESTA página 


    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await UserService.getAllUsers(page, pageSize,search)
                setUsers(data.items)
                setTotal(data.total)
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        }
        const timer = setTimeout(loadUsers, 400)   // debounce: espera 400ms antes de buscar
        return () => clearTimeout(timer)           // cancela el timer anterior si algo cambia
    }, [page,search,pageSize])

    const totalPages = Math.ceil(total / pageSize)




    return (
        <div className="max-w-6xl mx-auto">

            {/* header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Users</h1>
                    <p className="text-sm text-slate-500">Manage your platform members</p>
                </div>
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}   // ← resetea a página 1
                    placeholder="Search users..."
                    className="w-64 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold ring-1 ring-indigo-100">
                    {users.length} total
                </span>
            </div>

            {/* card + tabla */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Phone</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Joined</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => {

                                return (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        onEdit={setSelectedUser}
                                        onDelete={setUserToDelete}
                                    />
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* footer — acá irían los controles de paginación */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 rounded border disabled:opacity-40">Prev</button>

                        <span>Page {page} of {totalPages}</span>

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 rounded border disabled:opacity-40">Next</button>
                    </div>
                    <span>Showing {users.length} of {total}</span>
                    <span>Admin view</span>
                </div>
            </div>

            {selectedUser && (


                <DetailUser
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onSaved={(updated) => {
                        setUsers(users.map(u => u.id === updated.id ? updated : u))  // ← updated: reemplaza esa fila
                        setSelectedUser(null)                                     // cierra el modal
                    }}
                />
            )}

            {userToDelete && (
                <ConfirmDelete
                    message={`Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}?`}
                    onCancel={() => setUserToDelete(null)}
                    onConfirm={async () => {
                        await UserService.softDelete(userToDelete.id)
                        setUsers(users.filter(u => u.id !== userToDelete.id))
                        setUserToDelete(null)
                    }}
                />
            )}
        </div>
    )
}
