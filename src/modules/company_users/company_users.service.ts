import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Types, Connection } from 'mongoose';
import { CompanyUser, CompanyUserDocument } from '@/schemas/CompanyUser';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { UserType } from '@/types/User';
import { UsersService } from '@/modules/users/users.service';
import { CompaniesService } from '@/modules/companies/companies.service';
import { generateUsername } from '@/helpers/generate-data';

@Injectable()
export class CompanyUsersService {
  constructor(
    @InjectModel(CompanyUser.name)
    private readonly companyUserModel: Model<CompanyUserDocument>,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(companyUser: CreateCompanyUserDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    const existCompany = await this.companiesService.findOne(
      {
        name: companyUser.companyName,
      },
      session,
    );

    if (existCompany) {
      throw new BadRequestException('Ya existe una empresa con ese nombre');
    }

    const company = await this.companiesService.create(
      {
        name: companyUser.companyName,
      },
      session,
    );

    const username = generateUsername(
      companyUser.username,
      company.data.publicId,
    );

    const userBody = {
      name: companyUser.name,
      username,
      email: companyUser.email,
      password: companyUser.password,
      phone: companyUser.phone,
      countryId: new Types.ObjectId(companyUser.countryId),
      type: UserType.COMPANY_USER,
      companyId: company.data._id,
    };

    const user = await this.usersService.create(userBody, session);

    const companyUserBody = {
      roleId: new Types.ObjectId(companyUser.roleId),
      companyId: company.data._id,
    };

    try {
      await this.companyUserModel.create(
        [
          {
            ...companyUserBody,
            userId: user.data._id,
          },
        ],
        { session },
      );

      await session.commitTransaction();

      return {
        message: 'Usuario creado correctamente',
      };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(error);
    } finally {
      session.endSession();
    }
  }

  async findByUserId(userId: Types.ObjectId) {
    return await this.companyUserModel.findOne({ userId });
  }
}
