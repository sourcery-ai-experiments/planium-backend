import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WorkerDocument = HydratedDocument<Worker>;

@Schema({ versionKey: false })
export class Worker {
  @Prop(
    raw({
      socialSecurityNumber: { type: String },
      fileId: { type: Types.ObjectId },
    }),
  )
  personalInformation: Record<string, any>;

  @Prop(
    raw({
      name: { type: String },
      phone: { type: String },
      phoneCountryCode: { type: String },
    }),
  )
  emergencyContact: Record<string, any>;

  @Prop({ type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  companyId: Types.ObjectId;

  @Prop({ default: new Date() })
  createdAt!: number;

  @Prop({ default: new Date() })
  updatedAt!: number;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
