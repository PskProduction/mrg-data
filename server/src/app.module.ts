import { Module } from '@nestjs/common';
import { DataController } from './app.controller';

@Module({
  imports: [],
  controllers: [DataController],
  providers: [],
})
export class AppModule {}
