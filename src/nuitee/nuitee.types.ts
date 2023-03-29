import { PlaceType } from 'src/graphql';

export class CreateNuiteeDto {
  userId: string;
  name: string;
  address: string;
  photos: string[];
  description: string;
  price: number;
  perks: string;
  extraInfo: string;
  checkInTime: number;
  checkOutTime: number;
  maxGuests: number;
  placeType: PlaceType;
}

export class UpdateNuiteeDto extends CreateNuiteeDto {
  id: string;
}
