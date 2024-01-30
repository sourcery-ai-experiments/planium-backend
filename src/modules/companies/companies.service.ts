import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '@schema/Company';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async create(company: CreateCompanyDto) {
    try {
      const newCompany = await this.companyModel.create(company);

      return {
        message: 'Empresa creada correctamente',
        data: newCompany,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllByWorkerId(workerId: string) {
    try {
      const companies = await this.companyModel.find({
        'workers.workerId': workerId,
      });

      return {
        data: companies,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
