/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '@/schemas/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: CreateUserDto) {
    const existEmail = await this.verifyEmailExists(user.email);

    if (existEmail) {
      throw new BadRequestException('El correo electrónico ya existe');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;

    const newUser = await this.userModel.create(user);

    const { password, ...userData } = newUser.toObject();

    return {
      message: 'Usuario creado correctamente',
      data: userData,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
    );

    const { password, ...userData } = updatedUser.toObject();

    return {
      message: 'Usuario actualizado correctamente',
      data: userData,
    };
  }

  async findById(id: string): Promise<User> {
    try {
      return this.userModel.findById(id).exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(where: Record<string, string>) {
    try {
      return this.userModel.findOne(where).exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  async verifyEmailExists(email: string) {
    try {
      return await this.findOne({ email });
    } catch (error) {
      throw new Error(error);
    }
  }
}
