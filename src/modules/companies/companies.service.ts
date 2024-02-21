import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';
import { Company, CompanyDocument } from '@schema/Company';
import { Worker } from '@/types/Company';
import { WorkersService } from '@/modules/workers/workers.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { generateRandomCode } from '@/helpers/random-code';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    private readonly workersService: WorkersService,
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

  async addWorker(companyId: Types.ObjectId, worker: Worker) {
    const company = await this.findCompanyById(companyId);

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

  async removeWorker(companyId: Types.ObjectId, workerId: Types.ObjectId) {
    const company = await this.findCompanyById(companyId);

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

  async updateWorker(companyId: Types.ObjectId, worker: Worker) {
    const company = await this.findCompanyById(companyId);

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

  async verifyExistsWorker(workerId: string) {
    const worker = await this.workersService.findById(workerId);

    if (!worker) {
      throw new NotFoundException('Operario no encontrado');
    }
  }

  private async verifyExistsPublicId(publicId: string) {
    const exist = await this.companyModel.findOne({ publicId });

    if (exist) {
      throw new BadRequestException('Ocurrió un error, intente de nuevo');
    }
  }
}
