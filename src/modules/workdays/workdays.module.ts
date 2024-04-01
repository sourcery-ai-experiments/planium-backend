import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkdaysService } from './workdays.service';
import { WorkdaysController } from './workdays.controller';
import { Workday, WorkdaySchema } from '@/schemas/Workday';
import { ProjectsModule } from '../projects/projects.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    FilesModule,
    ProjectsModule,
    MongooseModule.forFeature([{ name: Workday.name, schema: WorkdaySchema }]),
  ],
  providers: [WorkdaysService],
  controllers: [WorkdaysController],
})
export class WorkdaysModule {}
