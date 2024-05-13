export interface WorkerAggregateResponse {
  _id: string;
  companyId: string;
  emergencyContact: EmergencyContact;
  personalInformation: PersonalInformation;
  name: string;
  username: string;
  email: string;
  phone: Phone;
  type: string;
  file: File;
}

interface EmergencyContact {
  name: string;
  phone: string;
  phoneCountryCode: string;
}

interface PersonalInformation {
  socialSecurityNumber: string;
  file: File;
}

interface File {
  _id: string;
  url: string;
}

interface Phone {
  number: string;
  countryCode: string;
}
