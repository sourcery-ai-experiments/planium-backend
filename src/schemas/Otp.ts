import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ versionKey: false })
export class Otp {
  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true })
  expiredAt: number;

  @Prop({ default: new Date() })
  createdAt!: number;

  @Prop({ default: new Date() })
  updatedAt!: number;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
