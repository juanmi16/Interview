/**
 * App entry point. Mounts React into #root and wraps the whole app in:
 *  - <BrowserRouter>  enables client-side routing
 *  - <AuthProvider>   makes the auth context (token + user) available everywhere
 */
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
    
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
)