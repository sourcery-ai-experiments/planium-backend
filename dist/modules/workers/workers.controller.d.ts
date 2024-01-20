import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
export declare class WorkersController {
    private readonly workersService;
    constructor(workersService: WorkersService);
    create(createWorkerDto: CreateWorkerDto): Promise<{
        message: string;
    }>;
}
