import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { findByCompany } from '@/schemas/methods';
import { WorkdayType } from '@/types/Workday';

export type WorkdayDocument = HydratedDocument<Workday>;

@Schema({ versionKey: false })
export class Workday {
  @Prop({ default: Number(new Date()) })
  date: number;

  @Prop({ default: Number(new Date().getTime()) })
  startTime: number;

  @Prop({})
  endTime: number;

  @Prop({ required: true, enum: WorkdayType })
  type: WorkdayType;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true, type: Types.ObjectId })
  fileId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  workerId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  projectId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  companyId: Types.ObjectId;

  @Prop({ default: new Date() })
  createdAt!: number;

  @Prop({ default: new Date() })
  updatedAt!: number;

  @Prop({ required: true, type: Types.ObjectId })
  updatedBy: Types.ObjectId;
}

export const WorkdaySchema = SchemaFactory.createForClass(Workday);

WorkdaySchema.statics.findByCompany = findByCompany;
