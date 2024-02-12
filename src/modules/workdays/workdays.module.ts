import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkersModule } from '../workers/workers.module';
import { WorkdaysService } from './workdays.service';
import { WorkdaysController } from './workdays.controller';
import { Workday, WorkdaySchema } from '@/schemas/Workday';

@Module({
  imports: [
    WorkersModule,
    MongooseModule.forFeature([{ name: Workday.name, schema: WorkdaySchema }]),
  ],
  providers: [WorkdaysService],
  controllers: [WorkdaysController],
})
export class WorkdaysModule {}
