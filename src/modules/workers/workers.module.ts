import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkersService } from './workers.service';
import { UsersModule } from '@module/users/users.module';
import { Worker, WorkerSchema } from '@schema/Worker';
import { WorkersController } from './workers.controller';
import { ProjectsModule } from '@module/projects/projects.module';
import { CompaniesModule } from '../companies/companies.module';
import { AwsModule } from '../aws/aws.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    CompaniesModule,
    ProjectsModule,
    UsersModule,
    AwsModule,
    FilesModule,
    MongooseModule.forFeature([{ name: Worker.name, schema: WorkerSchema }]),
  ],
  providers: [WorkersService],
  controllers: [WorkersController],
  exports: [WorkersService],
})
export class WorkersModule {}
