import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ versionKey: false })
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({ default: new Date() })
  createdAt!: number;

  @Prop({ required: true, type: Types.ObjectId })
  createdBy: Types.ObjectId;

  @Prop({ default: new Date() })
  updatedAt!: number;

  @Prop({ required: true, type: Types.ObjectId })
  updatedBy: Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
