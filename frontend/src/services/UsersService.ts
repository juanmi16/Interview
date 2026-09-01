/**
 * User service. Wraps the admin /api/users endpoints: a paginated + searchable
 * list, update, soft-delete, and the aggregated stats for the dashboard.
 */
import { BaseService } from "../services/BaseService"
import { http } from "../services/http"
import type { AuthUser } from "../types/auth"
import type { PagedResult } from "../types/pagedResult";
import type { User } from "../types/user"
import type { UserStats } from "../types/stats"

const baseUrl = "/users";   // el http ya tiene baseURL .../api → NO repetir "api"
class UserService extends BaseService<AuthUser> {
  constructor() {
    super('auth')
  }

  async getAllUsers(page: number, pageSize: number, search : string): Promise<PagedResult<User>> {
  const res = await http.get<PagedResult<User>>(baseUrl, { params: { page, pageSize, search } })
  return res.data;
}
  async update(id: number, data: Partial<User>): Promise<User> {
    const res = await http.put<User>(`${baseUrl}/${id}`, data);
    return res.data;
  }

  async softDelete(id: number): Promise<boolean> {

    return await http.delete(`${baseUrl}/${id}`);
  }

  async getStats(): Promise<UserStats> {
    const res = await http.get<UserStats>(`${baseUrl}/stats`);
    return res.data;
  }


}

export default new UserService();