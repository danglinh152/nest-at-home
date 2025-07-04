import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const saltOrRounds = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );

      createUserDto.password = hashedPassword;

      const user = await this.userModel.create(createUserDto);
      return user;
    } catch (error) {
      // Log the error if needed
      console.error('Create user error:', error);

      // Throw an exception so NestJS can handle it properly
      throw new BadRequestException('Could not create user');
    }
  }

  async checkPasswd(email: string, password: string) {
    console.log('check >>>>', email, password);

    const user: User | null = await this.userModel
      .findOne({ email: email })
      .exec();

    if (!user || !user.password) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    return isMatch ? user : null;
  }

  async findAll() {
    const users = this.userModel.find({});
    return users;
  }

  async findOne(id: number) {
    const user = await this.userModel.findById(id).exec();
    return user != null ? user : null;
  }

  async update(updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
    return updatedUser != null ? updatedUser : null;
  }

  async remove(id: string) {
    try {
      return await this.userModel.deleteOne({ _id: id });
    } catch (error) {
      return error;
    }
  }
}
