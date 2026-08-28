// Frontend User shape — mirrors what GET /api/users returns.
// NOTE: this is the API's SAFE projection, not the raw DB entity:
//   - no PasswordHash (that never leaves the backend)
//   - role is the role NAME (string), not the whole Role object
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string   // C# DateTime -> ISO string in JSON
  isActive: boolean
  role: string        // "Admin" | "User" | ...
}
