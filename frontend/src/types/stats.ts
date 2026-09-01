// Aggregated user metrics returned by GET /api/users/stats
export interface UserStats {
  total: number
  active: number
  inactive: number
  admins: number
  regular: number
}
