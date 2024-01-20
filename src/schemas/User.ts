import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserType } from '@/types/User';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, versionKey: false })
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

  @Prop({ required: true, enum: UserType })
  type: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
