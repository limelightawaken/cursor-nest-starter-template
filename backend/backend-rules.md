# Backend Development Rules

## Project Architecture & Structure

### NestJS Module Organization
- Follow the established modular structure with clear separation of concerns
- Use feature-based modules: `auth`, `users`, `database`, `common`
- Each module should have its own `controllers`, `services`, `dto`, `entities`, `guards`, `tests` directories
- Use `@Global()` decorator only for truly global modules like `DatabaseModule`, `ConfigModule`

### Directory Structure Standards
```
src/
├── modules/
│   ├── auth/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── dto/
│   │   ├── entities/
│   │   └── tests/
│   └── users/
│       ├── controllers/
│       ├── services/
│       ├── dto/
│       ├── entities/
│       └── tests/
├── config/
├── lib/
├── common/
└── main.ts
```

### File Naming Conventions
- Use kebab-case for file names: `auth.controller.ts`, `user.service.ts`
- Use PascalCase for class names: `AuthController`, `UserService`
- Use camelCase for method names: `findUserById`, `createUser`
- Use descriptive names that clearly indicate purpose

## TypeScript Standards (Zero `any` Types)

### Strict TypeScript Configuration
```typescript
// tsconfig.json - Maximum strictness
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  }
}
```

### Type Safety Rules
- **NEVER use `any` type** - Use proper types, unions, or `unknown` instead
- **Define interfaces for all data structures** including DTOs, entities, and API responses
- **Use generic types** for reusable patterns
- **Implement proper return types** for all methods
- **Use type guards** for runtime type checking
- **Leverage discriminated unions** for complex type scenarios

```typescript
// ❌ BAD - Using any type
function processData(data: any): any {
  return data.someProperty;
}

// ✅ GOOD - Proper typing
interface UserData {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
}

function processUserData(data: UserData): Pick<UserData, 'id' | 'email'> {
  return {
    id: data.id,
    email: data.email,
  };
}

// ✅ GOOD - Using generics
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

function createApiResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}
```

### Prisma Type Integration
```typescript
// ✅ GOOD - Use Prisma generated types
import { User, Prisma } from '@prisma/client';

type UserWithSessions = Prisma.UserGetPayload<{
  include: { sessions: true };
}>;

type UserCreateInput = Prisma.UserCreateInput;
type UserUpdateInput = Prisma.UserUpdateInput;
type UserWhereInput = Prisma.UserWhereInput;

// ✅ GOOD - Custom types based on Prisma
type PublicUser = Omit<User, 'password' | 'emailVerified'>;
type UserProfile = Pick<User, 'id' | 'name' | 'email' | 'createdAt'>;
```

## NestJS Best Practices

### Controller Design
```typescript
// ✅ GOOD - Proper controller structure
@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ type: [UserEntity] })
  async findAll(
    @Query() query: GetUsersQueryDto,
  ): Promise<ApiResponse<UserEntity[]>> {
    const users = await this.usersService.findAll(query);
    return {
      success: true,
      data: users,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ type: UserEntity })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<UserEntity>> {
    const user = await this.usersService.findOne(id);
    return {
      success: true,
      data: user,
    };
  }
}
```

### Service Layer Architecture
```typescript
// ✅ GOOD - Service with proper error handling
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async findAll(query: GetUsersQueryDto): Promise<UserEntity[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: this.buildWhereClause(query),
        orderBy: { createdAt: 'desc' },
        take: query.limit,
        skip: query.offset,
      });

      return users.map(user => new UserEntity(user));
    } catch (error) {
      this.logger.error('Failed to fetch users', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  private buildWhereClause(query: GetUsersQueryDto): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {
      isActive: true,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }
}
```

### Dependency Injection Best Practices
```typescript
// ✅ GOOD - Constructor injection with proper typing
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    @Inject('AUTH_CONFIG') private readonly authConfig: AuthConfig,
  ) {}
}

// ✅ GOOD - Factory providers for complex dependencies
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService): Promise<Redis> => {
        const redisClient = new Redis({
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        });
        await redisClient.ping();
        return redisClient;
      },
      inject: [ConfigService],
    },
  ],
})
export class CacheModule {}
```

## Database Management with Prisma

### Prisma Schema Best Practices
```prisma
// ✅ GOOD - Well-structured schema
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  emailVerified Boolean  @default(false)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  sessions      Session[]
  accounts      Account[]
  
  @@map("users")
  @@index([email])
  @@index([isActive])
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime @default(now())
  
  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
  @@index([userId])
  @@index([expiresAt])
}
```

### Database Query Best Practices
```typescript
// ✅ GOOD - Efficient query with proper typing
async findUserWithSessions(userId: string): Promise<UserWithSessions | null> {
  return await this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      sessions: {
        where: {
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

// ✅ GOOD - Pagination with proper typing
async findManyWithPagination(
  query: PaginationQueryDto,
): Promise<{ users: User[]; total: number }> {
  const [users, total] = await Promise.all([
    this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    }),
    this.prisma.user.count({
      where: { isActive: true },
    }),
  ]);

  return { users, total };
}

// ✅ GOOD - Transaction usage
async createUserWithProfile(
  userData: CreateUserDto,
  profileData: CreateProfileDto,
): Promise<User> {
  return await this.prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData,
    });

    await tx.profile.create({
      data: {
        ...profileData,
        userId: user.id,
      },
    });

    return user;
  });
}
```

### Database Migration Best Practices
```typescript
// ✅ GOOD - Migration scripts with proper error handling
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateUserData(): Promise<void> {
  try {
    console.log('Starting user data migration...');
    
    const users = await prisma.user.findMany({
      where: { isActive: { equals: null } },
    });

    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isActive: true },
      });
    }

    console.log(`Migration completed for ${users.length} users`);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
```

## Security & Authentication

### Authentication Guard Implementation
```typescript
// ✅ GOOD - Comprehensive auth guard
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    try {
      // 1. Extract and validate session
      const session = await auth.api.getSession({ 
        headers: request.headers 
      });

      if (!session?.session || !session?.user) {
        throw new UnauthorizedException('Invalid session');
      }

      // 2. Verify user is active
      const user = await this.prisma.user.findUnique({
        where: { id: session.session.userId },
        select: { id: true, isActive: true, email: true },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // 3. Attach user data to request
      request.user = session.user;
      request.session = session.session;

      return true;
    } catch (error) {
      this.logger.warn('Authentication failed', { error: error.message });
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
```

### Role-Based Access Control
```typescript
// ✅ GOOD - Role-based authorization
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// Custom decorator for roles
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

// Usage in controllers
@Get('admin')
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard, RoleGuard)
async getAdminData(): Promise<AdminData> {
  return this.adminService.getData();
}
```

### Input Validation & Sanitization
```typescript
// ✅ GOOD - Comprehensive DTO validation
export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: 'John Doe', minLength: 2, maxLength: 50 })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  @Transform(({ value }) => value.trim())
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;
}
```

## API Design & Documentation

### RESTful API Standards
```typescript
// ✅ GOOD - RESTful endpoint design
@Controller('api/v1/users')
export class UsersController {
  // GET /api/v1/users - List users
  @Get()
  async findAll(@Query() query: GetUsersQueryDto): Promise<ApiResponse<User[]>> {}

  // GET /api/v1/users/:id - Get specific user
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponse<User>> {}

  // POST /api/v1/users - Create user
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<User>> {}

  // PATCH /api/v1/users/:id - Update user
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<User>> {}

  // DELETE /api/v1/users/:id - Delete user
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {}
}
```

### Swagger/OpenAPI Documentation
```typescript
// ✅ GOOD - Comprehensive API documentation
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieve a paginated list of users with optional filtering',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: [UserEntity],
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid or missing authentication',
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Number of items per page',
    example: 10,
  })
  async findAll(@Query() query: GetUsersQueryDto): Promise<ApiResponse<User[]>> {}
}
```

### Response Standardization
```typescript
// ✅ GOOD - Standardized API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
  path: string;
}

// Response helper functions
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: ApiResponse<T>['meta'],
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    meta,
  };
}

export function createErrorResponse(
  code: string,
  message: string,
  path: string,
  details?: Record<string, unknown>,
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
    path,
  };
}
```

## Error Handling & Logging

### Global Exception Filter
```typescript
// ✅ GOOD - Comprehensive exception filter
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || message;
        code = (exceptionResponse as any).code || code;
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Unique constraint violation';
          code = 'DUPLICATE_ENTRY';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          code = 'NOT_FOUND';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Database error';
          code = 'DATABASE_ERROR';
      }
    }

    const errorResponse = createErrorResponse(
      code,
      message,
      request.url,
      process.env.NODE_ENV === 'development' ? { stack: exception } : undefined,
    );

    this.logger.error(
      `Exception thrown: ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
      {
        statusCode: status,
        path: request.url,
        method: request.method,
        userId: request.user?.id,
      },
    );

    response.status(status).json(errorResponse);
  }
}
```

### Structured Logging
```typescript
// ✅ GOOD - Structured logging service
@Injectable()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

  logApiRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    userId?: string,
  ): void {
    this.logger.log(
      `${method} ${url} ${statusCode} - ${responseTime}ms`,
      {
        method,
        url,
        statusCode,
        responseTime,
        userId,
        timestamp: new Date().toISOString(),
      },
    );
  }

  logDatabaseQuery(
    query: string,
    executionTime: number,
    affectedRows?: number,
  ): void {
    this.logger.debug(
      `Database query executed in ${executionTime}ms`,
      {
        query,
        executionTime,
        affectedRows,
        timestamp: new Date().toISOString(),
      },
    );
  }

  logSecurityEvent(
    event: string,
    userId?: string,
    ip?: string,
    additionalData?: Record<string, unknown>,
  ): void {
    this.logger.warn(
      `Security event: ${event}`,
      {
        event,
        userId,
        ip,
        ...additionalData,
        timestamp: new Date().toISOString(),
      },
    );
  }
}
```

## Testing Standards & Mocking Strategies

### Testing Philosophy & Decision Framework

#### When to Edit Code vs Tests
Use this decision framework when tests fail:

**🔴 Edit the CODE when:**
- **Requirements changed** and tests reflect old requirements
- **Bug discovered** in the implementation that tests correctly identify
- **Performance issues** identified by tests
- **Security vulnerability** found in the code
- **Business logic is incorrect** according to specifications

**🔵 Edit the TEST when:**
- **Test expectations are wrong** but code behavior is correct
- **Test setup is incorrect** (wrong mocks, invalid data)
- **Test is too brittle** and breaks on acceptable changes
- **Test doesn't match current requirements**
- **Test is flaky** due to timing or environment issues

```typescript
// ❌ BAD - Editing code to make wrong test pass
// Test expects user.name to be uppercase, but business rule says lowercase
it('should return user with uppercase name', async () => {
  const result = await service.findUser('123');
  expect(result.name).toBe('JOHN DOE'); // Wrong expectation
});

// ✅ GOOD - Fix the test expectation
it('should return user with proper name casing', async () => {
  const result = await service.findUser('123');
  expect(result.name).toBe('John Doe'); // Correct expectation
});
```

#### Test-Driven Development (TDD) Guidelines
1. **Red** - Write a failing test first
2. **Green** - Write minimal code to make test pass
3. **Refactor** - Improve code while keeping tests green

```typescript
// ✅ GOOD - TDD approach
describe('UserService.validateEmail', () => {
  // Step 1: Write failing test
  it('should return false for invalid email format', () => {
    const result = service.validateEmail('invalid-email');
    expect(result).toBe(false);
  });

  // Step 2: Implement minimal code to pass
  validateEmail(email: string): boolean {
    return email.includes('@');
  }

  // Step 3: Add more tests and refactor
  it('should return true for valid email format', () => {
    const result = service.validateEmail('test@example.com');
    expect(result).toBe(true);
  });
});
```

### Mocking Strategies & Best Practices

#### When to Mock vs When Not to Mock

**✅ DO Mock:**
- **External dependencies** (HTTP calls, third-party APIs)
- **Database connections** in unit tests
- **File system operations**
- **Time-dependent operations** (dates, timers)
- **Network requests**
- **Complex dependencies** that slow down tests

**❌ DON'T Mock:**
- **Value objects** and simple data structures
- **Pure functions** with no side effects
- **Configuration objects**
- **Constants and enums**
- **Simple utility functions**

```typescript
// ✅ GOOD - Mock external HTTP service
describe('NotificationService', () => {
  let service: NotificationService;
  let httpService: HttpService;

  beforeEach(() => {
    const mockHttpService = {
      post: jest.fn(),
      get: jest.fn(),
    };

    service = new NotificationService(mockHttpService);
    httpService = mockHttpService;
  });

  it('should send email notification', async () => {
    jest.spyOn(httpService, 'post').mockResolvedValue({ status: 200 });

    await service.sendEmail('test@example.com', 'Subject', 'Body');

    expect(httpService.post).toHaveBeenCalledWith(
      '/send-email',
      expect.objectContaining({
        to: 'test@example.com',
        subject: 'Subject',
        body: 'Body',
      }),
    );
  });
});

// ❌ BAD - Don't mock simple utilities
describe('UserService', () => {
  it('should format user display name', () => {
    // DON'T mock this simple function
    const formatted = formatDisplayName('john', 'doe');
    expect(formatted).toBe('John Doe');
  });
});
```

#### Database Mocking Strategies

**Unit Tests - Mock Database:**
```typescript
// ✅ GOOD - Mock Prisma for unit tests
describe('UsersService (Unit)', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should find user by id', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test' };
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

    const result = await service.findOne('1');

    expect(result).toEqual(mockUser);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
});
```

**Integration Tests - Use Test Database:**
```typescript
// ✅ GOOD - Real database for integration tests
describe('UsersService (Integration)', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    // Use test database
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean database before each test
    await prismaService.user.deleteMany();
  });

  it('should create and find user', async () => {
    const userData = { email: 'test@example.com', name: 'Test User' };
    
    const createdUser = await service.create(userData);
    const foundUser = await service.findOne(createdUser.id);

    expect(foundUser).toBeDefined();
    expect(foundUser.email).toBe(userData.email);
  });
});
```

#### Advanced Mocking Patterns

**Mock Return Values Based on Input:**
```typescript
// ✅ GOOD - Dynamic mock behavior
describe('UserService', () => {
  it('should handle different user types', async () => {
    jest.spyOn(prismaService.user, 'findUnique')
      .mockImplementation(async (args) => {
        if (args.where.id === 'admin-123') {
          return { id: 'admin-123', role: 'admin', email: 'admin@example.com' };
        }
        if (args.where.id === 'user-456') {
          return { id: 'user-456', role: 'user', email: 'user@example.com' };
        }
        return null;
      });

    const admin = await service.findOne('admin-123');
    const user = await service.findOne('user-456');

    expect(admin.role).toBe('admin');
    expect(user.role).toBe('user');
  });
});
```

**Mock Sequences and State Changes:**
```typescript
// ✅ GOOD - Mock state changes over time
describe('CacheService', () => {
  it('should handle cache miss then hit', async () => {
    const mockGet = jest.fn()
      .mockResolvedValueOnce(null)      // First call - cache miss
      .mockResolvedValueOnce('cached'); // Second call - cache hit

    jest.spyOn(cacheService, 'get').mockImplementation(mockGet);

    const firstResult = await cacheService.get('key');
    const secondResult = await cacheService.get('key');

    expect(firstResult).toBeNull();
    expect(secondResult).toBe('cached');
  });
});
```

**Mock Partial Objects:**
```typescript
// ✅ GOOD - Mock only what you need
describe('UserService', () => {
  it('should process user profile', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
      },
    } as User; // Type assertion for partial mock

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

    const result = await service.getDisplayName('123');

    expect(result).toBe('John Doe');
  });
});
```

### Test Organization & Structure

#### Test Suite Architecture
```typescript
// ✅ GOOD - Well-organized test structure
describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let logger: Logger;

  beforeEach(async () => {
    // Setup common to all tests
    const module = await createTestingModule();
    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  describe('findAll', () => {
    describe('when users exist', () => {
      it('should return filtered users', async () => {
        // Test implementation
      });

      it('should apply pagination correctly', async () => {
        // Test implementation
      });
    });

    describe('when no users exist', () => {
      it('should return empty array', async () => {
        // Test implementation
      });
    });

    describe('when database error occurs', () => {
      it('should throw InternalServerErrorException', async () => {
        // Test implementation
      });

      it('should log error details', async () => {
        // Test implementation
      });
    });
  });

  describe('findOne', () => {
    // Similar nested structure
  });
});
```

#### Test Data Management
```typescript
// ✅ GOOD - Test data factories
class UserTestDataFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static inactive(): User {
    return this.create({ isActive: false });
  }

  static admin(): User {
    return this.create({ role: 'admin' });
  }
}

// Usage in tests
describe('UserService', () => {
  it('should find active users only', async () => {
    const activeUsers = UserTestDataFactory.createMany(3);
    const inactiveUsers = UserTestDataFactory.createMany(2, { isActive: false });

    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(activeUsers);

    const result = await service.findAll();

    expect(result).toHaveLength(3);
    expect(result.every(user => user.isActive)).toBe(true);
  });
});
```

### Testing Error Scenarios

#### Comprehensive Error Testing
```typescript
// ✅ GOOD - Test all error scenarios
describe('UsersService Error Handling', () => {
  describe('Database Errors', () => {
    it('should handle connection timeout', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockRejectedValue(
        new Error('Connection timeout'),
      );

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to fetch users'),
        expect.any(Error),
      );
    });

    it('should handle unique constraint violation', async () => {
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(
        new PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '5.0.0',
        }),
      );

      await expect(service.create(userData)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle record not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Validation Errors', () => {
    it('should handle invalid email format', async () => {
      const invalidUserData = { email: 'invalid-email', name: 'Test' };

      await expect(service.create(invalidUserData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
```

### Mock Verification & Assertions

#### Comprehensive Mock Verification
```typescript
// ✅ GOOD - Verify mock interactions
describe('NotificationService', () => {
  it('should send email with correct parameters', async () => {
    const emailData = {
      to: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
    };

    await service.sendEmail(emailData);

    // Verify method was called
    expect(httpService.post).toHaveBeenCalledTimes(1);
    
    // Verify exact parameters
    expect(httpService.post).toHaveBeenCalledWith(
      '/send-email',
      expect.objectContaining({
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        timestamp: expect.any(String),
      }),
    );

    // Verify no other methods were called
    expect(httpService.get).not.toHaveBeenCalled();
  });

  it('should handle email sending failure', async () => {
    jest.spyOn(httpService, 'post').mockRejectedValue(
      new Error('Email service unavailable'),
    );

    await expect(service.sendEmail(emailData)).rejects.toThrow();

    // Verify retry logic was triggered
    expect(httpService.post).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });
});
```

### Testing Async Operations

#### Async/Await and Promise Testing
```typescript
// ✅ GOOD - Proper async testing
describe('AsyncService', () => {
  it('should handle concurrent operations', async () => {
    const mockResults = ['result1', 'result2', 'result3'];
    jest.spyOn(service, 'processItem')
      .mockResolvedValueOnce(mockResults[0])
      .mockResolvedValueOnce(mockResults[1])
      .mockResolvedValueOnce(mockResults[2]);

    const items = ['item1', 'item2', 'item3'];
    const results = await service.processConcurrently(items);

    expect(results).toEqual(mockResults);
    expect(service.processItem).toHaveBeenCalledTimes(3);
  });

  it('should handle partial failures in batch operations', async () => {
    jest.spyOn(service, 'processItem')
      .mockResolvedValueOnce('success1')
      .mockRejectedValueOnce(new Error('Processing failed'))
      .mockResolvedValueOnce('success3');

    const result = await service.processBatch(['item1', 'item2', 'item3']);

    expect(result.successful).toEqual(['success1', 'success3']);
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].error).toBe('Processing failed');
  });
});
```

### Performance Testing

#### Testing Performance Characteristics
```typescript
// ✅ GOOD - Performance testing
describe('UsersService Performance', () => {
  it('should handle large datasets efficiently', async () => {
    const largeUserSet = UserTestDataFactory.createMany(1000);
    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(largeUserSet);

    const startTime = Date.now();
    await service.findAll();
    const endTime = Date.now();

    const processingTime = endTime - startTime;
    expect(processingTime).toBeLessThan(100); // Should complete in under 100ms
  });

  it('should limit database queries', async () => {
    await service.getUserWithRelations('123');

    // Verify only one query was made (not N+1)
    expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: '123' },
      include: {
        posts: true,
        profile: true,
      },
    });
  });
});
```

### Test Coverage Guidelines

#### Coverage Requirements
- **Unit Tests**: 80% minimum line coverage
- **Integration Tests**: 70% minimum line coverage
- **Critical Business Logic**: 95% minimum line coverage
- **Error Handling**: 90% minimum line coverage

#### Coverage Analysis
```typescript
// ✅ GOOD - Test coverage for all code paths
describe('UserService.calculateUserScore', () => {
  it('should calculate score for new user', () => {
    const newUser = UserTestDataFactory.create({ createdAt: new Date() });
    const score = service.calculateUserScore(newUser);
    expect(score).toBe(100); // New user bonus
  });

  it('should calculate score for active user', () => {
    const activeUser = UserTestDataFactory.create({ 
      lastLoginAt: new Date(),
      postsCount: 5 
    });
    const score = service.calculateUserScore(activeUser);
    expect(score).toBe(150); // Base + activity bonus
  });

  it('should calculate score for inactive user', () => {
    const inactiveUser = UserTestDataFactory.create({
      lastLoginAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
    });
    const score = service.calculateUserScore(inactiveUser);
    expect(score).toBe(50); // Penalty for inactivity
  });
});
```

### Test Maintenance & Refactoring

#### When to Refactor Tests
- **Tests are difficult to understand**
- **Tests are slow** (> 100ms for unit tests)
- **Tests are flaky** (pass/fail inconsistently)
- **Tests are coupled** to implementation details
- **Tests have duplicate setup** code

```typescript
// ❌ BAD - Flaky test
it('should process within reasonable time', async () => {
  await service.processData();
  await new Promise(resolve => setTimeout(resolve, 100)); // Unreliable
  expect(service.isProcessingComplete()).toBe(true);
});

// ✅ GOOD - Deterministic test
it('should complete processing', async () => {
  const processingPromise = service.processData();
  await expect(processingPromise).resolves.toBeUndefined();
  expect(service.isProcessingComplete()).toBe(true);
});
```

## Testing Decision Tree

```
Test Fails
├── Is the test expectation correct?
│   ├── No → Edit the test
│   │   ├── Update expectations
│   │   ├── Fix mock setup
│   │   └── Align with requirements
│   └── Yes → Is the code behavior correct?
│       ├── No → Edit the code
│       │   ├── Fix business logic
│       │   ├── Handle edge cases
│       │   └── Improve error handling
│       └── Yes → Is the test brittle?
│           ├── Yes → Refactor the test
│           │   ├── Remove implementation coupling
│           │   ├── Use better assertions
│           │   └── Improve test data
│           └── No → Investigate further
│               ├── Check environment
│               ├── Review dependencies
│               └── Validate assumptions
```

## Performance Optimization

### Database Performance
```typescript
// ✅ GOOD - Optimized database queries
@Injectable()
export class UsersService {
  // Use select to fetch only needed fields
  async findUserProfile(userId: string): Promise<UserProfile> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        // Don't select password or other sensitive fields
      },
    });
  }

  // Use batch operations for multiple records
  async updateMultipleUsers(
    userIds: string[],
    updateData: Partial<User>,
  ): Promise<number> {
    const result = await this.prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: updateData,
    });
    
    return result.count;
  }

  // Use cursor-based pagination for large datasets
  async findUsersWithCursor(
    cursor?: string,
    limit: number = 10,
  ): Promise<{ users: User[]; nextCursor?: string }> {
    const users = await this.prisma.user.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    const hasNextPage = users.length > limit;
    const result = hasNextPage ? users.slice(0, -1) : users;
    const nextCursor = hasNextPage ? users[users.length - 1].id : undefined;

    return { users: result, nextCursor };
  }
}
```

### Caching Strategies
```typescript
// ✅ GOOD - Caching implementation
@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly logger: Logger,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Cache get failed for key: ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Cache set failed for key: ${key}`, error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Cache invalidation failed for pattern: ${pattern}`, error);
    }
  }
}

// Usage in service
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async findOne(id: string): Promise<User | null> {
    const cacheKey = `user:${id}`;
    
    // Try cache first
    const cachedUser = await this.cache.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    // Fetch from database
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      // Cache for 1 hour
      await this.cache.set(cacheKey, user, 3600);
    }

    return user;
  }
}
```

## Build Prevention & CI/CD

### Build Scripts & Validation
```json
// package.json - Comprehensive build scripts
{
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "lint:check": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\" \"test/**/*.ts\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "ts-node prisma/seed.ts",
    "validate": "npm run type-check && npm run lint:check && npm run format:check && npm run test",
    "prebuild": "rimraf dist && npm run validate"
  }
}
```

### ESLint Configuration
```javascript
// .eslintrc.js - Strict rules for backend
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    '@nestjs/eslint-config-standard',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // Prevent any types
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    
    // Prevent unused variables
    '@typescript-eslint/no-unused-vars': 'error',
    'no-unused-vars': 'off',
    
    // Require return types
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    
    // Prevent console logs
    'no-console': 'warn',
    
    // Require proper error handling
    '@typescript-eslint/no-floating-promises': 'error',
    
    // Prevent magic numbers
    '@typescript-eslint/no-magic-numbers': ['warn', { ignore: [0, 1, -1] }],
    
    // Prefer const
    'prefer-const': 'error',
    
    // Require proper naming
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
    ],
  },
};
```

### Environment Configuration
```typescript
// ✅ GOOD - Type-safe environment configuration
interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test' | 'staging';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  SWAGGER_ENABLED: boolean;
  REDIS_URL?: string;
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
}

export default (): EnvironmentVariables => ({
  NODE_ENV: process.env.NODE_ENV as EnvironmentVariables['NODE_ENV'] || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  SWAGGER_ENABLED: process.env.SWAGGER_ENABLED !== 'false',
  REDIS_URL: process.env.REDIS_URL,
  LOG_LEVEL: (process.env.LOG_LEVEL as EnvironmentVariables['LOG_LEVEL']) || 'info',
});

// Validate environment variables at startup
function validateEnvironment(): void {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  
  for (const variable of requiredVars) {
    if (!process.env[variable]) {
      throw new Error(`Environment variable ${variable} is required`);
    }
  }
}
```

### Pre-commit Hooks
```json
// package.json - Husky configuration
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run validate"
    }
  },
  "lint-staged": {
    "*.{ts,js}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{ts,js,json,md}": [
      "prettier --write"
    ]
  }
}
```

## Code Review Checklist

### Development Standards
- [ ] **TypeScript Compliance**: No `any` types, proper interfaces defined
- [ ] **Error Handling**: Try-catch blocks for async operations, proper error responses
- [ ] **Security**: Authentication guards, input validation, SQL injection prevention
- [ ] **Performance**: Efficient database queries, caching where appropriate
- [ ] **Testing**: Unit tests for business logic, integration tests for endpoints
- [ ] **Documentation**: Swagger documentation, JSDoc comments for complex functions
- [ ] **Logging**: Structured logging with appropriate levels
- [ ] **Database**: Proper indexes, efficient queries, transaction usage
- [ ] **API Design**: RESTful conventions, consistent response formats
- [ ] **Configuration**: Environment variables properly typed and validated

### Build Prevention
- [ ] **Type Check**: `npm run type-check` passes
- [ ] **Linting**: `npm run lint:check` passes with no errors
- [ ] **Formatting**: `npm run format:check` passes
- [ ] **Tests**: `npm run test` passes with required coverage
- [ ] **Build**: `npm run build` succeeds
- [ ] **Database**: Migrations run successfully
- [ ] **Dependencies**: No security vulnerabilities (`npm audit`)

---

These rules ensure the highest code quality, security, and maintainability for the NestJS backend application while preventing common build failures and runtime errors. 