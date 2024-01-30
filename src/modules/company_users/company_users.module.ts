import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@module/users/users.module';
import { CompaniesModule } from '@module/companies/companies.module';
import { CompanyUsersService } from './company_users.service';
import { CompanyUsersController } from './company_users.controller';
import { CompanyUser, CompanyUserSchema } from '@/schemas/CompanyUser';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompanyUser.name, schema: CompanyUserSchema },
    ]),
    UsersModule,
    CompaniesModule,
  ],
  providers: [CompanyUsersService],
  controllers: [CompanyUsersController],
})
export class CompanyUsersModule {}
