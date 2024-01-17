import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkersService } from './workers.service';
import { Worker, WorkerSchema } from '@schemas/Worker';
import { WorkersController } from './workers.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Worker.name, schema: WorkerSchema }]),
  ],
  providers: [WorkersService],
  exports: [WorkersService],
  controllers: [WorkersController],
})
export class WorkersModule {}
