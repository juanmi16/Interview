import { http } from '../services/http'

export class BaseService<T> {
  protected endpoint: string          // 👈 declarás el campo

  constructor(endpoint: string) {
    this.endpoint = endpoint          // 👈 lo asignás a mano
  }

  async getAll(): Promise<T[]> {
    const res = await http.get<T[]>(`/${this.endpoint}`)
    return res.data
  }

  async getById(id: number): Promise<T> {
    const res = await http.get<T>(`/${this.endpoint}/${id}`)
    return res.data
  }

  async post(data: unknown): Promise<T> {
    const res = await http.post<T>(`/${this.endpoint}`, data)
    return res.data
  }

  async put(id: number, data: unknown): Promise<T> {
    const res = await http.put<T>(`/${this.endpoint}/${id}`, data)
    return res.data
  }

  async delete(id: number): Promise<void> {
    await http.delete(`/${this.endpoint}/${id}`)
  }
}