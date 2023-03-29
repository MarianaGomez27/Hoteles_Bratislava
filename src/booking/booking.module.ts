import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { BookingController } from './booking.controller';
import { BookingEntity } from './booking.entity';
import { PlaceModule } from '../place/place.module';
import { UserModule } from 'src/user/user.module';
import { UserEntity } from 'src/user/entities';
import { PlaceService } from 'src/place/place.service';
import { PlaceEntity } from 'src/place/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, UserEntity, PlaceEntity]),
    PlaceModule,
    UserModule,
  ],
  controllers: [BookingController],
  providers: [PlaceService, BookingService, BookingResolver, Logger],
})
export class BookingModule {}
