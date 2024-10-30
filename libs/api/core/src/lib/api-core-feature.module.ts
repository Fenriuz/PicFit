import { Module } from '@nestjs/common';
import { ImagesModule } from '@pic-fit/api/images/feature';

@Module({
  imports: [ImagesModule],
})
export class ApiCoreFeatureModule {}
