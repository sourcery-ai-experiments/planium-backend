import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from '@/schemas/Role';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    @Inject(REQUEST) private readonly request: Record<string, unknown>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const userId = new Types.ObjectId(this.request.user['sub']);

      const data = {
        ...createRoleDto,
        createdBy: userId,
        updatedBy: userId,
      };

      const createdRole = new this.roleModel(data);
      await createdRole.save();
      return {
        message: 'Rol creado correctamente',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try {
      return await this.roleModel.aggregate([
        {
          $project: {
            name: 1,
          },
        },
      ]);
    } catch (error) {
      throw new Error(error);
    }
  }
}
