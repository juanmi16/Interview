import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'
import Loader from './Loader';

export default function ProtectedRoute({ children, requireRole }: { children: ReactNode; requireRole?: string }) {
  const { token, user } = useAuth()        // ← ¿qué revisamos? el token

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requireRole) {
    if (!user) return <Loader />                    
    if (user.role !== requireRole) return <Navigate to="/dashboard" replace />   // ← requireRole
  }

  return children
}