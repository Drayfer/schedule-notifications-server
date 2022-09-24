import { Controller, Get } from '@nestjs/common';
import { OptionService } from './option.service';

@Controller('notifications')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Get('/')
  getNotifications() {
    return 'ok';
  }
}
