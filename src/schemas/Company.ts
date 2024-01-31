import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Worker } from '@/types/Company';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ versionKey: false, collection: 'companies' })
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId })
  fileId: Types.ObjectId;

  @Prop({ default: [], type: Array })
  workers: Worker[];

  @Prop({ default: new Date() })
  createdAt!: number;

  @Prop({ default: new Date() })
  updatedAt!: number;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
