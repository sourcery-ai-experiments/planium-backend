import { CompanyUsersService } from './company_users.service';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
export declare class CompanyUsersController {
    private readonly companyUsersService;
    constructor(companyUsersService: CompanyUsersService);
    create(createCompanyUserDto: CreateCompanyUserDto): Promise<{
        message: string;
    }>;
}
