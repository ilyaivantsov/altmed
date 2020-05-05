import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Post()
  async create(@Res() res, @Body() data: any): Promise<void> {
    // console.log(data.audio);
    let ans = await this.appService.makeReqToPython(data);
    res.status(HttpStatus.OK).json(ans);
  }

}
