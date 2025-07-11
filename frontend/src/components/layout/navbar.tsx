'use client'

import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/auth/logout-button'
import Link from 'next/link'

export function Navbar() {
  const { data: session, isPending } = useSession()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Starter Template</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Future: Search component */}
          </div>
          
          <nav className="flex items-center space-x-2">
            {isPending ? (
              <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
            ) : session?.user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <span className="text-sm text-muted-foreground">
                  Welcome, {session.user.name || session.user.email}
                </span>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </nav>
  )
} 