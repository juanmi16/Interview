/**
 * To-do / Price-alert service. Wraps /api/todos: list my items, create,
 * toggle "done", and delete. Every call is scoped to the token user by the API.
 */
import { BaseService } from "./BaseService"
import { http } from "./http"
import type { Todo } from "../types/todo"

const baseUrl = "/todos"

class TodoService extends BaseService<Todo> {
  constructor() {
    super("todos")
  }

  async getMyTodos(): Promise<Todo[]> {
    const res = await http.get<Todo[]>(baseUrl)
    return res.data
  }

  async create(title: string): Promise<Todo> {
    const res = await http.post<Todo>(baseUrl, { title })
    return res.data
  }

  async toggle(id: number): Promise<Todo> {
    const res = await http.put<Todo>(`${baseUrl}/${id}/toggle`, {})
    return res.data
  }

  async remove(id: number): Promise<void> {
    await http.delete(`${baseUrl}/${id}`)
  }
}

export default new TodoService()
