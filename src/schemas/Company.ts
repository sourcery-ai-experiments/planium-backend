import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Worker } from '@/types/Company';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true, versionKey: false, collection: 'companies' })
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Types.ObjectId })
  fileId: Types.ObjectId;

  @Prop({ required: true, type: Array })
  workers: Worker[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
