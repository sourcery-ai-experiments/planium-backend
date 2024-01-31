import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument } from '@schema/Company';
import { Worker } from '@/types/Company';
import { WorkersService } from '../workers/workers.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    private readonly workersService: WorkersService,
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

  async addWorker(companyId: string, worker: Worker) {
    const company = await this.findCompany(companyId);

    await this.verifyExistsWorker(worker.workerId.toString());

    if (company.workers.some((w) => w.workerId.equals(worker.workerId))) {
      throw new NotFoundException('El operario ya existe');
    }

    company.workers.push(worker);

    await this.companyModel.findByIdAndUpdate(companyId, company);

    return {
      message: 'Operario agregado correctamente',
    };
  }

  async removeWorker(companyId: string, workerId: Types.ObjectId) {
    const company = await this.findCompany(companyId);

    await this.verifyExistsWorker(workerId.toString());

    const workerIndex = company.workers.findIndex((worker) =>
      worker.workerId.equals(workerId),
    );

    if (workerIndex === -1) {
      throw new NotFoundException('Operario no encontrado');
    }

    company.workers.splice(workerIndex, 1);
    await this.companyModel.findByIdAndUpdate(companyId, company);

    return {
      message: 'Operario eliminado correctamente',
    };
  }

  async updateWorker(companyId: string, worker: Worker) {
    const company = await this.findCompany(companyId);

    await this.verifyExistsWorker(worker.workerId.toString());

    const workerIndex = company.workers.findIndex((w) =>
      w.workerId.equals(worker.workerId),
    );

    if (workerIndex === -1) {
      throw new NotFoundException('Operario no encontrado');
    }

    company.workers[workerIndex] = worker;
    await this.companyModel.findByIdAndUpdate(companyId, company);

    return {
      message: 'Operario actualizado correctamente',
    };
  }

  async findCompany(companyId: string) {
    const company = await this.companyModel.findById(companyId);

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return company;
  }

  async verifyExistsWorker(workerId: string) {
    const worker = await this.workersService.findById(workerId);

    if (!worker) {
      throw new NotFoundException('Operario no encontrado');
    }
  }
}
