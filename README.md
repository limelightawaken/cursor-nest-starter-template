# Cursor NestJS + Next.js Starter Template

A production-ready full-stack starter template built with **NestJS** (backend) and **Next.js** (frontend), featuring modern authentication, clean architecture, and TypeScript throughout.

## 🚀 Features

### Backend (NestJS)
- **TypeScript** with strict type checking
- **NestJS** framework with modular architecture
- **Prisma** ORM for database management
- **Better-Auth** for authentication
- **Swagger** API documentation
- **JWT** authentication with secure session handling
- **PostgreSQL** database support
- **Environment-based configuration**
- **Comprehensive error handling**
- **Clean architecture** with separation of concerns

### Frontend (Next.js)
- **Next.js 15** with App Router
- **TypeScript** with strict type checking
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Responsive design** with mobile-first approach
- **Authentication** with login/register forms
- **Modern UI components** with clean design
- **Client-side routing** with protected routes
- **API integration** with type-safe client

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better-Auth
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class Validator
- **Testing**: Jest

### Frontend
- **Framework**: Next.js 15.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: React hooks
- **Forms**: React Hook Form
- **HTTP Client**: Fetch API

## 📦 Project Structure

```
starter-template/
├── backend/                    # NestJS backend application
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/         # Authentication module
│   │   │   ├── users/        # User management module
│   │   │   ├── database/     # Database module
│   │   │   └── common/       # Shared/common module
│   │   ├── config/           # Configuration files
│   │   ├── lib/              # Shared libraries
│   │   └── main.ts           # Application entry point
│   ├── prisma/               # Database schema and migrations
│   └── test/                 # Test files
├── frontend/                  # Next.js frontend application
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── (auth)/       # Authentication pages
│   │   │   └── (dashboard)/  # Dashboard pages
│   │   ├── components/       # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── layout/       # Layout components
│   │   │   └── ui/           # UI components (shadcn/ui)
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utilities and configurations
│   └── public/               # Static assets
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/limelightawaken/cursor-nest-starter-template.git
   cd cursor-nest-starter-template
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Environment Configuration

1. **Backend Environment**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/starter_template"
   
   # Authentication
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3001"
   
   # Server
   PORT=3001
   NODE_ENV=development
   
   # CORS
   CORS_ORIGIN="http://localhost:3000"
   ```

2. **Frontend Environment**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
   
   Update the `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

### Database Setup

1. **Start PostgreSQL** (ensure it's running)

2. **Run Database Migrations**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   npm run start:dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`
   - API Documentation: `http://localhost:3001/api`

## 📋 Available Scripts

### Backend
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run tests
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔧 Development

### Database Changes
When making database schema changes:

1. Update the Prisma schema in `backend/prisma/schema.prisma`
2. Create and apply migration:
   ```bash
   npx prisma migrate dev --name description_of_change
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

### Adding New Features

1. **Backend**: Create new modules in `backend/src/modules/`
2. **Frontend**: Add components in `frontend/src/components/`
3. **Follow the established patterns** for consistency

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Test coverage
```

### Frontend Testing
```bash
cd frontend
npm run test          # Run tests
npm run test:watch    # Watch mode
```

## 🔒 Authentication

The template includes a complete authentication system:

- **User Registration** with email verification
- **User Login** with secure session handling
- **JWT tokens** for API authentication
- **Protected routes** on both frontend and backend
- **Logout functionality** with session cleanup

## 📚 API Documentation

When running the backend in development mode, visit `http://localhost:3001/api` to access the interactive Swagger API documentation.

## 🎨 UI Components

The frontend uses **shadcn/ui** components built on top of **Radix UI** primitives:

- Fully accessible components
- Consistent design system
- Customizable with Tailwind CSS
- Dark mode support ready

## 📈 Performance

- **Server-side rendering** with Next.js
- **Code splitting** for optimal bundle sizes
- **Image optimization** with Next.js Image component
- **Database query optimization** with Prisma
- **Caching strategies** for better performance

## 🔧 Customization

### Styling
- Modify `frontend/src/app/globals.css` for global styles
- Update `frontend/tailwind.config.js` for theme customization
- Customize components in `frontend/src/components/ui/`

### Configuration
- Backend configuration in `backend/src/config/`
- Frontend configuration in `frontend/next.config.ts`

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set environment variables for production
3. Run database migrations: `npx prisma migrate prod`
4. Start the server: `npm run start:prod`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to your preferred platform (Vercel, Netlify, etc.)
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

If you have any questions or need help with the template:

- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the code examples in the template

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework for production
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Better-Auth](https://better-auth.com/) - Authentication library
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

**Happy coding!** 🎉 