import { Body, Controller, Post } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { Public } from '@/decorators/auth/auth.decorator';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Public()
  @Post()
  async create(@Body() createWorkerDto: CreateWorkerDto) {
    return this.workersService.create(createWorkerDto);
  }

  @Public()
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const { userId, password } = changePasswordDto;

    return this.workersService.changePassword(userId, password);
  }
}
