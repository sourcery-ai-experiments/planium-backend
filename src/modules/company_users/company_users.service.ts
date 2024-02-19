import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CompanyUser, CompanyUserDocument } from '@/schemas/CompanyUser';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { UserType } from '@/types/User';
import { UsersService } from '@/modules/users/users.service';
import { CompaniesService } from '@/modules/companies/companies.service';

@Injectable()
export class CompanyUsersService {
  constructor(
    @InjectModel(CompanyUser.name)
    private readonly companyUserModel: Model<CompanyUserDocument>,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
  ) {}

  // TODO: Persiste el error de crear primero el company y luego el usuario hay que implementar un rollback
  async create(companyUser: CreateCompanyUserDto) {
    const company = await this.companiesService.create({
      name: companyUser.companyName,
    });

    const userBody = {
      name: companyUser.name,
      email: companyUser.email,
      password: companyUser.password,
      phone: companyUser.phone,
      countryId: new Types.ObjectId(companyUser.countryId),
      type: UserType.COMPANY_USER,
      companyId: company.data._id,
    };

    const user = await this.usersService.create(userBody);

    const companyUserBody = {
      roleId: new Types.ObjectId(companyUser.roleId),
      companyId: company.data._id,
    };

    try {
      await this.companyUserModel.create({
        ...companyUserBody,
        userId: user.data._id,
      });

      return {
        message: 'Usuario creado correctamente',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByUserId(userId: Types.ObjectId) {
    return await this.companyUserModel.findOne({ userId });
  }
}
