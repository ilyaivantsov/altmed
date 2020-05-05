import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [WsModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
