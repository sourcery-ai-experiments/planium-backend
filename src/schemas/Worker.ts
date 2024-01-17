import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WorkerDocument = HydratedDocument<Worker>;

@Schema({ timestamps: true, versionKey: false })
export class Worker {
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
      code: { type: String, required: true },
    }),
  )
  phone: Record<string, any>;

  @Prop(
    raw({
      socialSecurityNumber: { type: String },
      fileId: { type: String },
    }),
  )
  personalInformation: Record<string, any>;

  @Prop(
    raw({
      name: { type: String },
      phone: { type: String },
      phoneCode: { type: String },
    }),
  )
  emergencyContact: Record<string, any>;

  @Prop({ type: Types.ObjectId })
  fileId: Types.ObjectId;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
