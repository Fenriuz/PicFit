import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from '@pic-fit/api/images/data-access';
import { StorageService } from '@pic-fit/api/shared/services/storage';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, StorageService],
  exports: [],
})
export class ImagesModule {}
