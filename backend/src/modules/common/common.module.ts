import { Module } from '@nestjs/common';
import { RawBodyMiddleware } from '../../common/middleware/raw-body.middleware';

@Module({
  providers: [RawBodyMiddleware],
  exports: [RawBodyMiddleware],
})
export class CommonModule {} 