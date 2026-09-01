/**
 * Authentication service. Wraps the /api/auth endpoints:
 *  - login    → returns a JWT
 *  - register → creates a user and returns a JWT (auto-login)
 *  - me       → returns the current user, decoded from the token
 * Exported as a singleton (`authService`) so any file can import it.
 */
import { BaseService } from "../services/BaseService"
import { http } from "../services/http"
import type { AuthUser, LoginRequest, RegisterRequest, RegisterResponse } from "../types/auth"

class AuthService extends BaseService<AuthUser> {
  constructor() {
    super('auth') // 👈 llamás al constructor de la clase padre
  }

  async login(data : LoginRequest): Promise<{ token: string }> 
  {
    const res = await http.post<{ token: string }>('/auth/login', data)
    return res.data
  }

  async register(data: RegisterRequest): Promise<RegisterResponse>
  {
    const res = await http.post<RegisterResponse>('/auth/register', data)
    return res.data
  }
  async me (): Promise<AuthUser>
  {
    const res = await http.get<AuthUser>('/auth/me')
    return res.data
  }

}

export const authService = new AuthService()