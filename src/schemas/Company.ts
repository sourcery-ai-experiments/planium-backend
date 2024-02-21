import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ versionKey: false, collection: 'companies' })
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  publicId: string;

  @Prop({ type: Types.ObjectId })
  fileId: Types.ObjectId;

  @Prop({ default: new Date() })
  createdAt!: number;

  @Prop({ default: new Date() })
  updatedAt!: number;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
