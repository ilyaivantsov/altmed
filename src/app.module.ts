import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    WsModule,
    HttpModule.register({
      headers: {
        "accept": "application/json",
        "x-rapidapi-key": "861425f672mshd179f2cfa9af498p1f9aa4jsn4d1965667721",
        "x-rapidapi-host": "matchilling-chuck-norris-jokes-v1.p.rapidapi.com",
        "useQueryString": true
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
