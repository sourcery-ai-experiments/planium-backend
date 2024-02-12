import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Types, isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined && metadata.type === 'param') {
      return value;
    }

    if (!isValidObjectId(value)) {
      throw new BadRequestException('El id debe ser un mongo ObjectId válido');
    }

    return new Types.ObjectId(value);
  }
}
