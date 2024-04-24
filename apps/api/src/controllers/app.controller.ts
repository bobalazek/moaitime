import { Controller, Get, Head } from '@nestjs/common';

@Controller()
export class AppController {
  @Head()
  async head() {
    return {
      hello: 'world',
    };
  }

  @Get('api')
  async index() {
    return {
      hello: 'world',
    };
  }

  @Get('api/health')
  async health() {
    return {
      status: 'ok',
    };
  }
}
