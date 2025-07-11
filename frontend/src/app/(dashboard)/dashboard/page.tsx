'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCurrentUser } from '@/hooks/use-dashboard'
import { useSession } from '@/lib/auth-client'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: userData, isLoading, error } = useCurrentUser()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your protected dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Hello World from Backend */}
          <Card>
            <CardHeader>
              <CardTitle>Hello from Backend! 👋</CardTitle>
              <CardDescription>
                This message is fetched from your NestJS backend
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : error ? (
                <p className="text-sm text-destructive">
                  Failed to fetch data from backend
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-green-600">
                    ✅ Backend connection successful!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your frontend is successfully communicating with the NestJS backend.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Information from your authenticated session
              </CardDescription>
            </CardHeader>
            <CardContent>
              {session?.user ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-sm text-muted-foreground">
                      {session.user.name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <p className="text-sm text-green-600">
                      ✅ Authenticated
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No user data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Backend Data */}
        {userData && (
          <Card>
            <CardHeader>
              <CardTitle>Backend User Data</CardTitle>
              <CardDescription>
                Additional user information from the backend API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">User ID</label>
                  <p className="text-sm text-muted-foreground font-mono">
                    {userData.user.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email Verified</label>
                  <p className="text-sm text-muted-foreground">
                    {userData.user.emailVerified ? '✅ Yes' : '❌ No'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Account Status</label>
                  <p className="text-sm text-muted-foreground">
                    {userData.user.isActive ? '✅ Active' : '❌ Inactive'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(userData.user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Starter Template Info */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Starter Template</CardTitle>
            <CardDescription>
              You now have a complete authentication starter template!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">
                This template includes:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• ✅ Better Auth integration (frontend + backend)</li>
                <li>• ✅ Protected routes with authentication guards</li>
                <li>• ✅ Form validation with react-hook-form + zod</li>
                <li>• ✅ Modern UI with shadcn/ui components</li>
                <li>• ✅ React Query for data fetching</li>
                <li>• ✅ TypeScript throughout</li>
                <li>• ✅ Responsive design with Tailwind CSS</li>
              </ul>
              <p className="text-sm font-medium text-primary">
                Perfect foundation for any future project! 🎉
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 