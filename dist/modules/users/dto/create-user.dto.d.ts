import { UserType } from '@/types/User';
declare class Phone {
    number: string;
    countryCode: string;
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    nationality: string;
    phone: Phone;
    type: UserType;
}
export {};
