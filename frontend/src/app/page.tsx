'use client'

import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, isPending } = useSession()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Starter Template
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern authentication starter template built with Next.js, NestJS, and Better Auth.
              Perfect foundation for your next project.
            </p>
          </div>

          {/* CTA Section */}
          {isPending ? (
            <div className="w-40 h-10 bg-muted animate-pulse rounded-md mx-auto" />
          ) : session?.user ? (
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Welcome back, {session.user.name || session.user.email}!
              </p>
              <Link href="/dashboard">
                <Button size="lg">
                  Go to Dashboard →
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          )}

          {/* Features Section */}
          <div className="grid gap-6 md:grid-cols-3 mt-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔐 Secure Auth
                </CardTitle>
                <CardDescription>
                  Production-ready authentication with Better Auth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Email & password authentication</li>
                  <li>• Session management</li>
                  <li>• Rate limiting & security</li>
                  <li>• Password hashing</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚡ Modern Stack
                </CardTitle>
                <CardDescription>
                  Built with the latest technologies and best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Next.js 15 with App Router</li>
                  <li>• NestJS backend</li>
                  <li>• TypeScript throughout</li>
                  <li>• Tailwind CSS + shadcn/ui</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚀 Developer Ready
                </CardTitle>
                <CardDescription>
                  Everything you need to start building immediately
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Form validation with Zod</li>
                  <li>• React Query integration</li>
                  <li>• Protected route patterns</li>
                  <li>• Component-based architecture</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Tech Stack */}
          <div className="mt-16 p-6 bg-muted/50 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Built With</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                'Next.js', 'NestJS', 'Better Auth', 'TypeScript', 
                'Tailwind CSS', 'shadcn/ui', 'React Query', 'Prisma',
                'PostgreSQL', 'React Hook Form', 'Zod'
              ].map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1 bg-background border rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
