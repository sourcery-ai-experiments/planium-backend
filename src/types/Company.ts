import { Types } from 'mongoose';

export type Worker = {
  salary: number;
  workerId: Types.ObjectId;
};
