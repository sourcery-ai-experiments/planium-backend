import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ versionKey: false })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop(
    raw({
      name: { type: String, required: true },
      phone: { type: String, required: true },
      phoneCountryCode: { type: String, required: true },
    }),
  )
  manager: Record<string, any>;

  @Prop({ required: true })
  startDate: number;

  @Prop({ required: true })
  endDate: number;

  @Prop({ required: true, type: Array, default: [] })
  workers: Types.ObjectId[];

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

export const ProjectSchema = SchemaFactory.createForClass(Project);
