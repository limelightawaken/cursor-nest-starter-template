import { Injectable } from '@nestjs/common';
import { prisma } from '../../../lib/prisma';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor() {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Note: For Better Auth, user creation should typically be handled 
    // through the /auth/sign-up/email endpoint, not this service directly
    return prisma.user.create({
      data: {
        ...createUserDto,
        emailVerified: false, // Default value
        isActive: true, // Default value
      },
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        isActive: true, // Only return active users
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<void> {
    // Soft delete by setting isActive to false instead of hard delete
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async hardDelete(id: string): Promise<void> {
    // Hard delete - use with caution as this will also delete related sessions/accounts
    await prisma.user.delete({
      where: { id },
    });
  }
} 