import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ParseMongoIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
