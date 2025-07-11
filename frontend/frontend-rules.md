 # Frontend Development Rules

## Project Structure and Organization

### Directory Structure
- Follow the established `/src` structure with clear separation of concerns
- Use route groups with parentheses for logical grouping: `(auth)`, `(dashboard)`
- Place reusable components in `/components` with subdirectories by category
- Keep API logic in `/lib/api` with specific service files
- Store custom hooks in `/hooks` with descriptive names

### File Naming Conventions
- Use kebab-case for directories: `auth-tabs`, `login-form`
- Use PascalCase for component files: `AuthTabs.tsx`, `LoginForm.tsx`
- Use camelCase for utility files: `authClient.ts`, `utils.ts`
- Use lowercase with hyphens for page files: `page.tsx`, `layout.tsx`

## Component Development

### Component Architecture
- Create single-purpose components with clear responsibilities
- Use functional components with hooks exclusively
- Implement proper TypeScript interfaces for all props
- Export components as named exports when possible

### Component Structure Template
```typescript
interface ComponentProps {
  // Define all props with proper types
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### UI Components
- Use the established UI component library in `/components/ui`
- Follow shadcn/ui patterns for consistency
- Implement proper accessibility attributes
- Use Tailwind CSS classes for styling

## Authentication Patterns

### Auth Implementation
- Use the established auth-client pattern for authentication
- Implement proper error handling for auth operations
- Use the LogoutButton component for consistent logout behavior
- Follow the auth layout pattern for authenticated routes

### Route Protection
- Use appropriate layouts for auth vs dashboard routes
- Implement proper loading states during auth checks
- Handle unauthenticated states gracefully

## State Management

### Local State
- Use useState for component-level state
- Use useEffect for side effects with proper cleanup
- Implement custom hooks for reusable stateful logic

### Server State
- Use the established API client pattern
- Implement proper error handling for API calls
- Use loading states for async operations

## API Integration

### API Client Usage
- Use the centralized API client from `/lib/api/client.ts`
- Create specific service files for different API endpoints
- Implement proper error handling and type safety
- Follow the established pattern in `dashboard.ts`

### Type Safety
- Define proper TypeScript interfaces for API responses
- Use generic types for reusable API patterns
- Implement proper error types

## Styling Guidelines

### CSS and Styling
- Use Tailwind CSS for all styling
- Follow mobile-first responsive design principles
- Use the established color scheme and design tokens
- Implement proper dark mode support if needed

### Layout Patterns
- Use the established layout components: `AuthLayout`, `DashboardLayout`
- Implement consistent spacing and typography
- Follow the navbar pattern for navigation

## Mobile Optimization & Responsive Design

### Mobile-First Approach
- Design for mobile screens first, then progressively enhance for larger screens
- Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Test on actual devices and various screen sizes regularly
- Ensure touch targets are at least 44px × 44px for accessibility

### Responsive Breakpoints
```css
/* Tailwind responsive breakpoints */
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (laptops) */
xl: 1280px  /* Extra large devices (desktops) */
2xl: 1536px /* Extra extra large devices */
```

### Mobile Navigation
- Use hamburger menus for mobile navigation
- Implement swipe gestures where appropriate
- Ensure navigation is easily accessible with thumb navigation
- Use bottom navigation for primary actions on mobile

### Touch Interactions
- Implement proper touch feedback with hover states
- Use `active:` classes for touch feedback
- Ensure buttons and interactive elements are properly sized
- Implement proper focus states for keyboard navigation

### Performance on Mobile
- Optimize images with proper srcsets and lazy loading
- Use Next.js Image component for automatic optimization
- Minimize bundle size for faster loading on slower connections
- Implement proper loading states for slower networks

## UI Spacing & Padding Guidelines

### Consistent Spacing Scale
Use Tailwind's spacing scale consistently throughout the application:
```css
/* Preferred spacing values */
xs: 0.5rem (8px)   /* Tight spacing */
sm: 0.75rem (12px) /* Small spacing */
md: 1rem (16px)    /* Default spacing */
lg: 1.5rem (24px)  /* Large spacing */
xl: 2rem (32px)    /* Extra large spacing */
2xl: 3rem (48px)   /* Section spacing */
```

### Component Spacing Rules
- **Cards**: Use `p-6` (24px) for card padding, `p-4` (16px) for mobile
- **Forms**: Use `space-y-4` (16px) between form elements
- **Sections**: Use `py-8` (32px) or `py-12` (48px) for section padding
- **Container**: Use `px-4` (16px) for mobile, `px-6` (24px) for desktop
- **Buttons**: Use `px-4 py-2` for standard buttons, `px-6 py-3` for large buttons

### Layout Spacing
```typescript
// Container spacing example
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <div className="space-y-8">
    {/* Content with consistent vertical spacing */}
  </div>
</div>

// Card spacing example
<div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
  <div className="space-y-4">
    {/* Card content */}
  </div>
</div>
```

### Typography Spacing
- Use `leading-relaxed` (1.625) for body text
- Use `space-y-2` (8px) between paragraphs
- Use `mb-4` (16px) after headings
- Use `mb-6` (24px) between sections

## Modern & Clean Interface Design

### Design Principles
- **Minimalism**: Remove unnecessary elements, focus on essential functionality
- **Whitespace**: Use generous whitespace to improve readability and focus
- **Hierarchy**: Establish clear visual hierarchy with typography and spacing
- **Consistency**: Maintain consistent patterns across the entire application

### Color Palette
```css
/* Modern color system */
Primary: Blue/Indigo scale for main actions
Secondary: Gray scale for neutral elements
Success: Green scale for positive actions
Warning: Amber scale for cautionary actions
Error: Red scale for destructive actions
```

### Typography System
```css
/* Heading hierarchy */
h1: text-3xl md:text-4xl font-bold
h2: text-2xl md:text-3xl font-semibold
h3: text-xl md:text-2xl font-semibold
h4: text-lg md:text-xl font-medium
body: text-base leading-relaxed
small: text-sm text-gray-600
```

### Visual Design Elements
- Use subtle shadows: `shadow-sm`, `shadow-md`, `shadow-lg`
- Implement smooth transitions: `transition-all duration-200`
- Use rounded corners consistently: `rounded-lg` for cards, `rounded-md` for inputs
- Apply subtle borders: `border border-gray-200`

### Modern UI Patterns
- **Cards**: Clean cards with subtle shadows and rounded corners
- **Forms**: Floating labels, clear focus states, inline validation
- **Buttons**: Solid primary buttons, outline secondary buttons
- **Navigation**: Clean navigation with proper hover states
- **Loading States**: Skeleton screens and smooth loading indicators

## Component Usage Guidelines

### Button Components
```typescript
// Primary actions
<Button variant="default" size="lg">
  Primary Action
</Button>

// Secondary actions
<Button variant="outline" size="md">
  Secondary Action
</Button>

// Destructive actions
<Button variant="destructive" size="sm">
  Delete
</Button>
```

### Card Components
```typescript
// Standard card usage
<Card className="p-6">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Form Components
```typescript
// Form with proper spacing and validation
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Enter your email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### Layout Components
```typescript
// Dashboard layout with proper spacing
<DashboardLayout>
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Grid items */}
    </div>
  </div>
</DashboardLayout>
```

### Navigation Components
```typescript
// Responsive navigation
<nav className="bg-white shadow-sm border-b">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center space-x-8">
        {/* Navigation items */}
      </div>
      <div className="md:hidden">
        {/* Mobile menu button */}
      </div>
    </div>
  </div>
</nav>
```

### Component Composition
- Build complex components from simple, reusable parts
- Use composition over inheritance for component flexibility
- Implement proper prop forwarding with TypeScript
- Create compound components for complex UI patterns

### State Management in Components
```typescript
// Proper state management example
function ComponentName() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAction = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Action logic
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {/* Component content */}
    </Card>
  );
}
```

## Code Quality & Build Prevention

### TypeScript Standards (Strict Configuration)
```typescript
// tsconfig.json - Enforce strict TypeScript rules
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

#### Type Safety Rules
- **Never use `any`** - Use `unknown` or proper types instead
- **Define interfaces for all props and API responses**
- **Use proper type imports**: `import type { ComponentProps } from 'react'`
- **Implement proper return types** for all functions
- **Use const assertions** for immutable data: `as const`
- **Leverage union types** instead of loose typing

```typescript
// ❌ Bad - Loose typing
function handleData(data: any) {
  return data.someProperty;
}

// ✅ Good - Strict typing
interface UserData {
  id: string;
  email: string;
  name: string;
}

function handleData(data: UserData): string {
  return data.name;
}
```

### Import/Export Best Practices
```typescript
// ❌ Bad - Barrel exports causing circular dependencies
export * from './components'; // Avoid this

// ✅ Good - Specific exports
export { Button } from './Button';
export { Input } from './Input';
export type { ButtonProps } from './Button';

// ❌ Bad - Mixed imports
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

// ✅ Good - Grouped imports
import React, { useState } from 'react';
import type { ComponentProps } from 'react';

import axios from 'axios';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/client';
```

### Dependency Management
```json
// package.json - Lock dependency versions
{
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

#### Dependency Rules
- **Lock major versions** to prevent breaking changes
- **Use exact versions** for critical dependencies
- **Regularly audit dependencies**: `npm audit` or `yarn audit`
- **Remove unused dependencies** before committing
- **Use `peerDependencies`** for shared dependencies
- **Avoid deprecated packages** - check npm advisories

### Build Optimization & Bundle Management
```typescript
// next.config.ts - Optimize build output
const nextConfig = {
  // Enable experimental features carefully
  experimental: {
    optimizePackageImports: ['@/components/ui']
  },
  
  // Bundle analyzer for size monitoring
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  }
};
```

#### Bundle Size Prevention
- **Monitor bundle size** with `@next/bundle-analyzer`
- **Use dynamic imports** for large components
- **Implement code splitting** at route level
- **Optimize images** with Next.js Image component
- **Use tree shaking** - import only what you need
- **Avoid large dependencies** in client-side code

```typescript
// ❌ Bad - Large bundle
import * as _ from 'lodash';

// ✅ Good - Tree shaking
import { debounce } from 'lodash-es';

// ✅ Better - Use built-in alternatives
const debounce = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(null, args), delay);
  };
};
```

### Error Prevention & Handling
```typescript
// Error boundary implementation
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

#### Error Handling Rules
- **Implement error boundaries** for all route components
- **Use try-catch blocks** for all async operations
- **Validate all external data** before use
- **Handle loading and error states** in components
- **Log errors appropriately** for debugging
- **Provide user-friendly error messages**

```typescript
// ❌ Bad - Unhandled async operation
const fetchData = async () => {
  const response = await api.get('/data');
  setData(response.data);
};

// ✅ Good - Proper error handling
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await api.get('/data');
    setData(response.data);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Failed to fetch data');
  } finally {
    setLoading(false);
  }
};
```

### Performance Rules
```typescript
// Performance optimization patterns
const ExpensiveComponent = React.memo(({ data }: { data: ComplexData }) => {
  const memoizedValue = useMemo(() => {
    return computeExpensiveValue(data);
  }, [data]);

  const handleCallback = useCallback((id: string) => {
    onItemSelect(id);
  }, [onItemSelect]);

  return <div>{memoizedValue}</div>;
});
```

#### Build Prevention Checklist
- **Type check passes**: `npm run type-check`
- **Linting passes**: `npm run lint`
- **Tests pass**: `npm run test`
- **Build succeeds**: `npm run build`
- **No console errors** in development
- **Bundle size is acceptable**
- **Security audit passes**: `npm audit`

### Environment Variable Management
```typescript
// env.local - Type-safe environment variables
const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
  DATABASE_URL: process.env.DATABASE_URL!,
} as const;

// Validate environment variables at build time
if (!env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is required');
}
```

### Code Review Checklist
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] All tests pass
- [ ] No console.log statements
- [ ] Proper error handling implemented
- [ ] Performance optimizations applied
- [ ] Accessibility standards met
- [ ] Bundle size impact assessed
- [ ] Security vulnerabilities addressed


## Import/Export Patterns

### Import Organization
- Group imports by: React, third-party, internal
- Use absolute imports from `@/` for internal modules
- Use named imports when possible
- Keep imports alphabetically sorted within groups

### Export Patterns
```typescript
// Preferred named exports
export { ComponentName } from './ComponentName';

// Default exports for pages and layouts
export default function Page() { ... }
```

## Security Best Practices

### Authentication Security
- Never store sensitive data in localStorage
- Use secure HTTP-only cookies when possible
- Implement proper CSRF protection
- Validate all user inputs

### Data Handling
- Sanitize user inputs before display
- Use proper validation for forms
- Implement rate limiting for API calls
- Handle sensitive data appropriately

These rules should be followed consistently across all frontend development to maintain code quality, security, and maintainability.