declare class Manager {
    name: string;
    phone: string;
    phoneCountryCode: string;
}
export declare class CreateProjectDto {
    name: string;
    address: string;
    manager: Manager;
    startDate: number;
    endDate: number;
}
export {};
