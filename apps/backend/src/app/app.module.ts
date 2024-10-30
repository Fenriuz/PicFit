import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiCoreFeatureModule } from '@pic-fit/api/core/feature';
@Module({
  imports: [ApiCoreFeatureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
