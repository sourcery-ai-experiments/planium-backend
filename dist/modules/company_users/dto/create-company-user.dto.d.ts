declare class Phone {
    number: string;
    countryCode: string;
}
export declare class CreateCompanyUserDto {
    name: string;
    username: string;
    email: string;
    password: string;
    countryId: string;
    phone: Phone;
    companyName: string;
    roleId: string;
}
export {};
