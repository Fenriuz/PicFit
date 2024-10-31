import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService, StorageService } from '@pic-fit/api/images/data-access';
@Module({
  controllers: [ImagesController],
  providers: [ImagesService, StorageService],
  exports: [],
})
export class ImagesModule {}
