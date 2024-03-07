import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TaskStatus, TaskType } from '@/types/Task';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ versionKey: false })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: TaskStatus, default: TaskStatus.TO_DO })
  status: string;

  @Prop({ required: true, enum: TaskType, default: TaskType.PRODUCTION })
  type: string;

  @Prop({ required: true })
  supervisor: string;

  @Prop({ required: true })
  floor: string;

  @Prop(
    raw({
      amount: { type: String, default: '0' },
      isPaid: { type: Boolean, default: false },
    }),
  )
  cost: Record<string, any>;

  @Prop({ required: true })
  endDate: number;

  @Prop({ required: true, type: Array, default: [] })
  files: Types.ObjectId[];

  @Prop({ required: true, type: Types.ObjectId })
  workerId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  projectId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  companyId: Types.ObjectId;

  @Prop({ default: new Date() })
  createdAt!: number;

  @Prop({ required: true, type: Types.ObjectId })
  createdBy: Types.ObjectId;

  @Prop({ default: new Date() })
  updatedAt!: number;

  @Prop({ required: true, type: Types.ObjectId })
  updatedBy: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
