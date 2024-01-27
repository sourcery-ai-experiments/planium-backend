import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class WorkersController {
    private readonly workersService;
    constructor(workersService: WorkersService);
    create(createWorkerDto: CreateWorkerDto): Promise<{
        message: string;
    }>;
    changePassword(changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
