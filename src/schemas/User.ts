import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserType } from '@/types/User';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  nationality: string;

  @Prop(
    raw({
      number: { type: String, required: true },
      countryCode: { type: String, required: true },
    }),
  )
  phone: Record<string, any>;

  @Prop({ type: Types.ObjectId })
  fileId: Types.ObjectId;

  @Prop({ required: true, enum: UserType })
  type: string;

  @Prop({ default: new Date() })
  createdAt!: number;

  @Prop({ default: new Date() })
  updatedAt!: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
