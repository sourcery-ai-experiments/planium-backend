import { Model } from 'mongoose';

export function findByCompany<T extends Model<any>>(
  this: T,
  companyId: string,
  conditions: Record<string, any>,
) {
  return this.find({ ...conditions, companyId });
}

export function aggregateByCompany<T extends Model<any>>(
  this: T,
  companyId: string,
  pipeline: any[],
) {
  const companyPipeline = [{ $match: { companyId } }, ...pipeline];

  return this.aggregate(companyPipeline);
}
