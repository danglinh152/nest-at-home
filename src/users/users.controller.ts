import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        ErrorCode: 0,
        data: user,
      };
    } catch (error) {
      return {
        ErrorCode: -1,
        data: null,
        message: error?.message || 'Unexpected error',
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return {
        ErrorCode: 0,
        data: users,
      };
    } catch (error) {
      return {
        ErrorCode: -1,
        data: null,
        message: error?.message || 'Unexpected error',
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
    try {
      const user = await this.usersService.findOne(id);
      return {
        ErrorCode: 0,
        data: user,
      };
    } catch (error) {
      return {
        ErrorCode: -1,
        data: null,
        message: error?.message || 'Unexpected error',
      };
    }
  }

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.usersService.update(updateUserDto);
      return {
        ErrorCode: 0,
        data: updatedUser,
      };
    } catch (error) {
      return {
        ErrorCode: -1,
        data: null,
        message: error?.message || 'Unexpected error',
      };
    }

    return;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.usersService.remove(id);
      return {
        ErrorCode: 0,
        data: deleted,
      };
    } catch (error) {
      return {
        ErrorCode: -1,
        data: null,
        message: error?.message || 'Unexpected error',
      };
    }
  }
}
