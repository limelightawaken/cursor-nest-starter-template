import { apiClient } from './client'

export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DashboardData {
  message: string
  user: User
}

// Get current user profile (protected endpoint)
export const getCurrentUser = async (): Promise<DashboardData> => {
  return apiClient.get<DashboardData>('/users/me')
}

// Get all users (protected endpoint - admin only potentially)
export const getAllUsers = async (): Promise<User[]> => {
  return apiClient.get<User[]>('/users')
}

// Get hello world message from backend
export const getHelloWorld = async (): Promise<{ message: string }> => {
  return apiClient.get<{ message: string }>('/users/me')
} 