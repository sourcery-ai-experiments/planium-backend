import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CompanyUserDocument = HydratedDocument<CompanyUser>;

@Schema({ versionKey: false, collection: 'company_users' })
export class CompanyUser {
  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  roleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  companyId: Types.ObjectId;

  @Prop({ default: new Date() })
  createdAt!: number;

  @Prop({ default: new Date() })
  updatedAt!: number;
}

export const CompanyUserSchema = SchemaFactory.createForClass(CompanyUser);
