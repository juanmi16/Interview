// Data shapes shared across the app (mirror the backend DTOs).

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  role: string
  name: string
}

// What the backend returns after POST /auth/register
export interface RegisterResponse {
  token: string
  id: number
  firstName: string
  email: string
  message: string
}
