import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';
import { Company, CompanyDocument } from '@schema/Company';
import { CreateCompanyDto } from './dto/create-company.dto';
import { generateRandomCode } from '@/helpers/random-code';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async create(
    company: CreateCompanyDto,
    session: ClientSession | null = null,
  ) {
    try {
      const publicId = generateRandomCode(4);

      await this.verifyExistsPublicId(publicId);

      const newCompany = await this.companyModel.create(
        [
          {
            ...company,
            publicId,
          },
        ],
        {
          session,
        },
      );

      return {
        message: 'Empresa creada correctamente',
        data: newCompany[0],
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllByWorkerId(workerId: Types.ObjectId) {
    try {
      const companies = await this.companyModel.aggregate([
        {
          $match: {
            'workers.workerId': workerId,
          },
        },
        {
          $project: {
            name: 1,
          },
        },
      ]);

      return {
        data: companies,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findCompanyById(companyId: Types.ObjectId) {
    const company = await this.companyModel.findById(companyId);

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return company;
  }

  private async verifyExistsPublicId(publicId: string) {
    const exist = await this.companyModel.findOne({ publicId });

    if (exist) {
      throw new BadRequestException('Ocurrió un error, intente de nuevo');
    }
  }
}
