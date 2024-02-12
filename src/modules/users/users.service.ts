/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

    const existPhone = await this.findOne({
      'phone.number': user.phone.number,
    });

    if (existPhone) {
      throw new BadRequestException('El número de teléfono ya existe');
    }

    const hashedPassword = await this.hashPassword(user.password);

    user.password = hashedPassword;

    const newUser = await this.userModel.create(user);

    const { password, ...userData } = newUser.toObject();

    return {
      message: 'Usuario creado correctamente',
      data: userData,
    };
  }

  async update(id: Types.ObjectId, updateUserDto: UpdateUserDto) {
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

  async findById(id: Types.ObjectId): Promise<UserDocument> {
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

  async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt();
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error(error);
    }
  }

  async changePassword(userId: Types.ObjectId, password: string) {
    const hashedPassword = await this.hashPassword(password);

    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  }
}
