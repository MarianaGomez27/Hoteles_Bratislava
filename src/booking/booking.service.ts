import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { differenceInCalendarDays } from 'date-fns';
import { PlaceService } from 'src/place/place.service';
import { formatMoneyToStorage } from 'src/utils/money';
import { Connection, Repository } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { CreateBookingDto } from './booking.types';

@Injectable()
export class BookingService {
  constructor(
    private connection: Connection,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    private readonly placeService: PlaceService,
    private readonly logger: Logger,
  ) {}

  public async getBookingsByUserId(userId: string) {
    return await this.bookingRepository.find({
      where: {
        userId: userId,
      },
      relations: ['place'],
    });
  }

  async createBooking(createBookingDto: CreateBookingDto) {
    const place = await this.placeService.getPlaceById(
      createBookingDto.placeId,
    );

    const numberOfNights = differenceInCalendarDays(
      new Date(createBookingDto.checkOutDate),
      new Date(createBookingDto.checkInDate),
    );

    const bookingPrice = place.price * numberOfNights;
    return await this.connection.transaction(async (entityManager) => {
      const booking = await this.bookingRepository.create({
        price: formatMoneyToStorage(bookingPrice),
        ...createBookingDto,
      });
      return await entityManager.save(booking);
    });
  }

  async getBooking(bookingId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: { place: true },
    });
    return booking;
  }
}
