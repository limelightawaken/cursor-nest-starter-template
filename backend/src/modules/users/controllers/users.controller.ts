import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard) // Protected route - requires authentication
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (protected)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(AuthGuard) // Protected route - get current user profile
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getCurrentUser(@Req() req: any) {
    // The user object is attached by AuthGuard
    return {
      message: 'Authenticated user profile',
      user: req.user,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard) // Protected route
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID (protected)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard) // Protected route
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user (protected)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard) // Protected route
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (protected)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
} 