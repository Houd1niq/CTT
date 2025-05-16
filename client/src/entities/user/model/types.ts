export interface UserResponse {
  id: number,
  email: string,
  fullName?: string,
  role: {
    id: number,
    name: string
  },
  institute?: {
    id: number,
    name: string
  }
}
