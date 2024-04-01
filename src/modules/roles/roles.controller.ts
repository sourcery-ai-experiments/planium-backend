import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { UserTypes } from '@/decorators/auth/user-type.decorator';
import { UserType } from '@/types/User';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UserTypes(UserType.COMPANY_USER)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      return await this.rolesService.create(createRoleDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.rolesService.findAll();
    } catch (error) {
      throw new Error(error);
    }
  }
}
