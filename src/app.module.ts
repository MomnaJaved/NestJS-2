import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { HelloController } from './controllers/hello.controller';
import { CatsController } from './controllers/cats.controller';

@Module({
  imports: [],
  controllers: [AppController, HelloController, CatsController],
  providers: [AppService],
})
export class AppModule {}
