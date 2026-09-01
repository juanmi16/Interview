/**
 * Auth context — the app's single source of truth for the logged-in user.
 *
 * Provides `token` + `user` (and their setters) to the whole tree. When the
 * token changes, an effect calls /auth/me to load the user; no token clears it.
 * Any component reads it with the `useAuth()` hook — no prop drilling.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AuthUser } from '../types/auth'
import { authService } from '../services/AuthService'

// 1️⃣ La forma
interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
  user: AuthUser | null                    // ← AuthUser
  setUser: (u: AuthUser | null) => void
}

// 2️⃣ El contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 3️⃣ El Provider
export function AuthProvider({ children }: { children: ReactNode }) {



  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (!token) { setUser(null); return }        // sin token = sin user
    authService.me()
      .then(setUser)
      .catch((e) => console.error(e))
  }, [token])




  const setToken = (t: string | null) => {
    setTokenState(t)

    if (t != null) {
      localStorage.setItem('token', t)
    } else {
      localStorage.removeItem('token')
    }
  }

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// 4️⃣ El hook
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}