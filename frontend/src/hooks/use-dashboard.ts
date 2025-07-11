import { useQuery } from '@tanstack/react-query'
import { getCurrentUser, getAllUsers, DashboardData, User } from '@/lib/api/dashboard'

// Hook to get current user data
export const useCurrentUser = () => {
  return useQuery<DashboardData>({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

// Hook to get all users (admin functionality)
export const useAllUsers = () => {
  return useQuery<User[]>({
    queryKey: ['all-users'],
    queryFn: getAllUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  })
} 