import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiCoreFeatureModule } from '@pic-fit/api/core/feature';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApiCoreFeatureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
