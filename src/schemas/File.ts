import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { findByCompany } from '@/schemas/methods';

export type FileDocument = HydratedDocument<File>;

@Schema({ timestamps: true, versionKey: false })
export class File {
  @Prop({ required: true })
  url: string;

  @Prop({ type: Types.ObjectId })
  companyId: Types.ObjectId;
}

export const FileSchema = SchemaFactory.createForClass(File);

FileSchema.methods.getUrl = function () {
  return this.url;
};

FileSchema.statics.findByCompany = findByCompany;
