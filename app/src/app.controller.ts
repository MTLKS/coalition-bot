import { Controller, Get, Param, Response, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { clientRedirect } from '../config.json';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly httpService: HttpService) {}

  @Get()
  async getCode(@Request() request: any): Promise<string> {
    return this.appService.getCode(request);
  }

  @Get('login/:id')
  getId(@Param() param: any, @Response() response: any): void {
    response.cookie('id', param.id);
    response.redirect(302, clientRedirect);
  }
}
