export type CreateBookingDto = {
  userId: string;
  placeId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfPets: number;
  bookingContactName: string;
  bookingContactPhoneNumber: string;
  bookingNotes: string;
  currency: string;
};
