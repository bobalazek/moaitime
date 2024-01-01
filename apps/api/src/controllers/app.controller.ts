import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async index() {
    return {
      hello: 'world',
    };
  }

  @Get('health')
  async health() {
    return {
      status: 'ok',
    };
  }
}
