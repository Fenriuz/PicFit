import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from '@pic-fit/api/images/data-access';
@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [],
})
export class ImagesModule {}
