declare class Phone {
    number: string;
    countryCode: string;
}
declare class PersonalInformation {
    socialSecurityNumber: string;
    fileId: string;
}
declare class EmergencyContact {
    name: string;
    phone: string;
    phoneCountryCode: string;
}
export declare class CreateWorkerDto {
    name: string;
    email: string;
    password: string;
    nationality: string;
    phone: Phone;
    personalInformation: PersonalInformation;
    emergencyContact: EmergencyContact;
    fileId: string;
}
export {};
