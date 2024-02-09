import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '@/schemas/Project';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CompaniesModule } from '@/modules/companies/companies.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    CompaniesModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
