<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# NestJS Backend - Module Architecture Guide

## Overview

This NestJS backend follows a **module-based architecture** with **self-contained modules** that ensure proper separation of concerns. Each module encapsulates its own business logic, DTOs, entities, services, controllers, and tests.

## 📁 Directory Structure

```
src/
├── modules/
│   ├── database/                    # Global database module
│   │   ├── services/
│   │   │   └── prisma.service.ts
│   │   └── database.module.ts
│   ├── common/                      # Shared utilities and configurations
│   │   └── common.module.ts
│   ├── users/                       # Example feature module
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── services/
│   │   │   └── users.service.ts
│   │   ├── controllers/
│   │   │   └── users.controller.ts
│   │   ├── tests/
│   │   │   ├── users.service.spec.ts
│   │   │   └── users.controller.spec.ts
│   │   └── users.module.ts
│   └── auth/                        # Authentication module
│       ├── services/
│       ├── controllers/
│       ├── dto/
│       ├── entities/
│       ├── tests/
│       └── auth.module.ts
├── app.module.ts                    # Root application module
└── main.ts                          # Application entry point
```

## 🏗️ Module Architecture Principles

### 1. **Self-Contained Modules**
Each module should contain all its related components:
- **DTOs** (Data Transfer Objects) - Input/output validation
- **Entities** - Data models
- **Services** - Business logic
- **Controllers** - API endpoints
- **Tests** - Unit and integration tests

### 2. **Separation of Concerns**
- **Controllers** handle HTTP requests/responses
- **Services** contain business logic
- **DTOs** validate and transform data
- **Entities** represent data models
- **Tests** ensure code quality

### 3. **Module Dependencies**
- Modules can import other modules when needed
- Use the `@Global()` decorator sparingly (only for core modules like Database)
- Export services that other modules might need

## 🔧 Technology Stack

- **NestJS** - Progressive Node.js framework
- **Prisma** - Database ORM
- **Jest** - Testing framework
- **TypeScript** - Type safety
- **Class-validator** - DTO validation
- **Class-transformer** - Data transformation

## 📝 Creating New Modules

### Step 1: Create Directory Structure
```bash
mkdir -p src/modules/your-module/{dto,entities,services,controllers,tests}
```

### Step 2: Create Module Files

#### Module File (`your-module.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { YourModuleService } from './services/your-module.service';
import { YourModuleController } from './controllers/your-module.controller';

@Module({
  controllers: [YourModuleController],
  providers: [YourModuleService],
  exports: [YourModuleService], // Export if other modules need it
})
export class YourModuleModule {}
```

#### Service File (`services/your-module.service.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/services/prisma.service';

@Injectable()
export class YourModuleService {
  constructor(private prisma: PrismaService) {}

  // Your business logic methods here
}
```

#### Controller File (`controllers/your-module.controller.ts`)
```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { YourModuleService } from '../services/your-module.service';

@Controller('your-module')
export class YourModuleController {
  constructor(private readonly yourModuleService: YourModuleService) {}

  // Your API endpoints here
}
```

#### DTO File (`dto/create-your-module.dto.ts`)
```typescript
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateYourModuleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // Add more properties with validation
}
```

#### Entity File (`entities/your-module.entity.ts`)
```typescript
export class YourModuleEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Step 3: Add Tests

#### Service Test (`tests/your-module.service.spec.ts`)
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourModuleService } from '../services/your-module.service';
import { PrismaService } from '../../database/services/prisma.service';

describe('YourModuleService', () => {
  let service: YourModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YourModuleService,
        {
          provide: PrismaService,
          useValue: {
            // Mock methods
          },
        },
      ],
    }).compile();

    service = module.get<YourModuleService>(YourModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests
});
```

### Step 4: Register Module in App Module

Add your new module to `src/app.module.ts`:

```typescript
import { YourModuleModule } from './modules/your-module/your-module.module';

@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    YourModuleModule, // Add here
    // ... other modules
  ],
  // ...
})
export class AppModule {}
```

## 🧪 Testing Guidelines

### Testing Structure
- Place all tests in the `tests/` folder within each module
- Use descriptive test names
- Mock external dependencies
- Test both success and error scenarios

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 💾 Database Integration

### Prisma Setup
1. Define your models in `prisma/schema.prisma`
2. Run migrations: `npx prisma migrate dev`
3. Generate client: `npx prisma generate`

### Using Prisma in Services
```typescript
@Injectable()
export class YourService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.yourModel.findMany();
  }
}
```

## 🚀 Development Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run linter
npm run lint

# Format code
npm run format
```

## 📚 Best Practices

1. **Keep modules focused** - Each module should have a single responsibility
2. **Use DTOs for validation** - Always validate input data
3. **Write tests** - Maintain good test coverage
4. **Follow naming conventions** - Use consistent naming patterns
5. **Document your code** - Add JSDoc comments for complex logic
6. **Handle errors gracefully** - Use proper error handling and custom exceptions
7. **Keep dependencies minimal** - Only import what you need

## 🔐 Security Considerations

- Never expose sensitive data in responses
- Use proper authentication and authorization
- Validate all input data
- Store secrets in environment variables
- Use HTTPS in production

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

---

**Note**: This architecture ensures scalability, maintainability, and proper separation of concerns. Each module is independent and can be developed, tested, and deployed separately while maintaining consistency across the application.
