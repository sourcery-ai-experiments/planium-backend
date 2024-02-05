import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { findByCompany } from '@/schemas/methods';

export type FileDocument = HydratedDocument<File>;

@Schema({ versionKey: false })
export class File {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  key: string;

  @Prop({ type: Types.ObjectId })
  companyId: Types.ObjectId;

  @Prop({ default: new Date() })
  createdAt!: number;

  @Prop({ default: new Date() })
  updatedAt!: number;
}

export const FileSchema = SchemaFactory.createForClass(File);

FileSchema.methods.getUrl = function () {
  return this.url;
};

FileSchema.statics.findByCompany = findByCompany;
