import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WorkerDocument = HydratedDocument<Worker>;

@Schema({ timestamps: true, versionKey: false })
export class Worker {
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

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
