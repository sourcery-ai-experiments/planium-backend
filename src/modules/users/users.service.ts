/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '@/schemas/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilesService } from '../files/files.service';
import { Folder } from '@/types/File';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly filesService: FilesService,
  ) {}

  async findById(id: Types.ObjectId): Promise<UserDocument> {
    try {
      return this.userModel.findById(id).exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(where: Record<string, any>) {
    try {
      return this.userModel.findOne(where).exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(user: CreateUserDto, session: ClientSession | null = null) {
    await this.validateUserExists(user);

    const hashedPassword = await this.hashPassword(user.password);

    user.password = hashedPassword;

    const newUser = await this.userModel.create([user], { session });

    const { password, ...userData } = newUser[0].toObject();

    return {
      message: 'Usuario creado correctamente',
      data: userData,
    };
  }

  async update(
    id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
    companyId: Types.ObjectId,
    session: ClientSession | null = null,
  ) {
    const user = await this.findOne({ _id: id, companyId });

    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { session },
    );

    const { password, ...userData } = updatedUser.toObject();

    return {
      message: 'Usuario actualizado correctamente',
      data: userData,
    };
  }

  async changePassword(userId: Types.ObjectId, password: string) {
    const hashedPassword = await this.hashPassword(password);

    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  }

  async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt();
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateUserExists(user: CreateUserDto) {
    const { username, email, companyId } = user;

    const userExist = await this.userModel.findOne({
      $or: [
        { username, companyId },
        { email, companyId },
      ],
    });

    if (userExist) {
      throw new BadRequestException(
        'El email o el username ya están en uso dentro de la empresa',
      );
    }
  }

  async uploadAvatar(
    file: Express.Multer.File,
    folder: Folder,
    userId: Types.ObjectId,
    companyId: Types.ObjectId,
    session: ClientSession | null = null,
  ) {
    const user = await this.findOne({ _id: userId, companyId });

    if (!user) {
      throw new BadRequestException('El usuario no existe');
    }

    if (user.fileId) {
      await this.filesService.deleteOneFile(user.fileId, companyId, session);
    }

    const { originalname, buffer } = file;

    const newFile = await this.filesService.uploadOneFile(
      originalname,
      buffer,
      folder,
      companyId,
      session,
    );

    await this.userModel.updateOne(
      { _id: userId },
      { fileId: newFile.id },
      { session },
    );
  }
}
