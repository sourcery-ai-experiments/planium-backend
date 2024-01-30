import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { CompanyUsersService } from './company_users.service';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';

@Controller('company-users')
export class CompanyUsersController {
  constructor(private readonly companyUsersService: CompanyUsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createCompanyUserDto: CreateCompanyUserDto) {
    return await this.companyUsersService.create(createCompanyUserDto);
  }
}
