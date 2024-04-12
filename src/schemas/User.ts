import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserType } from '@/types/User';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Types.ObjectId })
  countryId: Types.ObjectId;

  @Prop(
    raw({
      number: { type: String },
      countryCode: { type: String },
    }),
  )
  phone: Record<string, any>;

  @Prop({ required: true, enum: UserType })
  type: string;

  @Prop({ type: Types.ObjectId })
  fileId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  companyId: Types.ObjectId;

  @Prop({ default: new Date() })
  createdAt!: number;

  @Prop({ default: new Date() })
  updatedAt!: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
