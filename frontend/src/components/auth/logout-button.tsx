'use client'

import { useState } from 'react'
import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function LogoutButton({ variant = "outline", size = "default" }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      toast.loading('Signing out...')
      await signOut()
      toast.success('Successfully signed out!')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to sign out')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
} 