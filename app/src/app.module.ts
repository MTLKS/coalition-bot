import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { AppGateway } from './app.gateway';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
