import { Body, Controller, Patch, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { Public } from '@/decorators/auth/auth.decorator';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CompanyId } from '@/decorators/company-id.decorator';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  async create(
    @Body() createWorkerDto: CreateWorkerDto,
    @CompanyId() companyId: Types.ObjectId,
  ) {
    return this.workersService.create(createWorkerDto, companyId);
  }

  @Public()
  @Patch('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const { userId, password } = changePasswordDto;

    return this.workersService.changePassword(
      new Types.ObjectId(userId),
      password,
    );
  }
}
