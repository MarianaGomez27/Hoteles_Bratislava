export class UpdateProfileDto {
  firstName: string;
  fathersLastName: string;
  mothersLastName: string;
  mobilePhoneNumber: string;
  phoneNumber: string;
  countryOfBirth?: string;
  dateOfBirth?: Date;
}

export class CreateUserToReviewDto {
  firstName: string;
  fathersLastName: string;
  mothersLastName: string;
  mobilePhoneNumber: string;
  phoneNumber: string;
  countryOfBirth?: string;
  dateOfBirth?: Date;
  email: string;
  agencyName: string;
  townOrCity: string;
  state: string;
  rnt: string;
  rntFileName: string;
  taxIdentificationNumber: string;
  taxIdentificationNumberFileName: string;
  clabe: string;
  clabeFileName: string;
  companyName: string;
  isAmavAffiliate: boolean;
  role: string;
}
