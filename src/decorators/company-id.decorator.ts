import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

export const CompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const companyId =
      request['user'].companyId ?? request.headers['company-id'];

    if (!companyId) {
      throw new BadRequestException('Company ID not found');
    }

    return new Types.ObjectId(companyId);
  },
);
