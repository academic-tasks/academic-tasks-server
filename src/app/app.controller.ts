import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  index() {
    return {
      name: '@academic-tasks/server',
      status: 'up',
    };
  }
}
