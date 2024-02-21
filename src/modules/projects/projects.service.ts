import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from '@schema/Project';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @Inject(REQUEST) private readonly request: Record<string, unknown>,
  ) {}

  async create(createProjectDto: CreateProjectDto, companyId: Types.ObjectId) {
    try {
      const userId = new Types.ObjectId(this.request.user['userId']);

      await this.projectModel.create({
        ...createProjectDto,
        companyId,
        createdBy: userId,
        updatedBy: userId,
      });

      return {
        message: 'Proyecto creado correctamente',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findById(id: Types.ObjectId): Promise<Project> {
    try {
      return this.projectModel.findById(id).exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getByWorkerId(workerId: Types.ObjectId, companyId: Types.ObjectId) {
    const projects = await this.projectModel.aggregate([
      {
        $match: {
          companyId,
          workers: workerId,
        },
      },
      {
        $project: {
          name: 1,
        },
      },
    ]);

    return projects;
  }

  async addWorkers(
    projectId: Types.ObjectId,
    workers: string[],
    companyId: Types.ObjectId,
  ) {
    const project = await this.projectModel.findOne({
      _id: projectId,
      companyId,
    });

    if (!project) {
      throw new NotFoundException('El proyecto no existe');
    }

    const workersObjectId = workers.map((id) => new Types.ObjectId(id));

    try {
      await this.projectModel.updateOne(
        { _id: projectId },
        {
          $addToSet: {
            workers: { $each: workersObjectId },
          },
        },
      );

      return {
        message: 'Operario(s) agregado(s) correctamente',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
