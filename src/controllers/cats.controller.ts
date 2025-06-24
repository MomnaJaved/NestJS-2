import { Controller, Get, Delete, HttpCode } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }

  @Get('breed')
  getBreed() {
    return 'This returns cat breed info';
  }

  @HttpCode(204)
  @Delete()
  remove() {
    return 'Deleted!';
  }
}
