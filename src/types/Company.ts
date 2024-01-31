import { Types } from 'mongoose';

export type Worker = {
  salary: string;
  workerId: Types.ObjectId;
};
