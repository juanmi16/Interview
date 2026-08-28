import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './components/ProtectedRoute'
import UserList from './pages/UserList'
import DashboardLayout from './layouts/DashboardLayout'


function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Privadas: comparten el layout (Sidebar + botón).
          El layout exige estar autenticado; adentro, cada página se
          pinta en el <Outlet /> del layout. */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={
          <ProtectedRoute requireRole="Admin">
            <UserList />
          </ProtectedRoute>
        } />
      </Route>

      {/* Catch-all al final */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
