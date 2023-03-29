import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  Req,
  Param,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './booking.types';

@Controller('bookings')
export class BookingController {
  readonly logger = new Logger('BookingController');

  constructor(private bookingService: BookingService) {}

  @Get('me')
  public async getMyBookings(@Req() req) {
    return await this.bookingService.getBookingsByUserId(req.user.profile.id);
  }

  @Get('/:bookingId')
  public async getBooking(@Param('bookingId') bookingId: string) {
    return await this.bookingService.getBooking(bookingId);
  }

  @Get('/user/:userId')
  public async getBookingsByUserId(@Param('userId') userId) {
    return await this.bookingService.getBookingsByUserId(userId);
  }

  @Post('/')
  public async createBooking(
    @Req() req,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return await this.bookingService.createBooking({
      ...createBookingDto,
      userId: req.user.profile.id,
    });
  }
}
