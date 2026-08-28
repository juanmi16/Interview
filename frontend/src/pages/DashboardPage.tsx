import { useEffect, useState } from 'react'
import { authService } from '../services/AuthService'
import type { AuthUser } from '../types/auth'
import Loader from '../components/Loader'

// Ahora esta página es SOLO el contenido. El Sidebar y el botón ☰
// los pone el DashboardLayout (compartido), así el menú no desaparece
// al navegar a otras rutas.
export default function DashboardPage() {
    const [user, setUser] = useState<AuthUser | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await authService.me()
                await new Promise(r => setTimeout(r, 5000))   // ⏳ demo: 5s para ver el loader (quitar luego)
                console.log('User data fetched:', data)
                setUser(data)

            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }

        fetchUser()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            {user
                ? <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}!</h1>
                : <Loader />}
        </div>
    )
}
