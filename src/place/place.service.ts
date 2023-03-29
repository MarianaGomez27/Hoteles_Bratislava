import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Equal, In, Not, Repository } from 'typeorm';
import { PlaceEntity } from 'src/place/entities/place.entity';
import { ContentBlockDto } from 'src/place/dto/contentBlock.dto';
import { BookingEntity } from 'src/booking/booking.entity';
import { CreatePlaceDto, UpdatePlaceDto } from './place.types';

@Injectable()
export class PlaceService {
  constructor(
    private connection: Connection,
    @InjectRepository(PlaceEntity)
    private readonly placeRepository: Repository<PlaceEntity>,
  ) {}

  async getPlaceById(id: string): Promise<PlaceEntity> {
    return await this.placeRepository.findOne({
      where: { id },
    });
  }

  async getPlacesByUserId(userId: string): Promise<PlaceEntity[]> {
    const places = await this.placeRepository.find({
      where: { userId: userId },
    });
    return places;
  }

  async getPlaces(): Promise<PlaceEntity[]> {
    return await this.placeRepository.find({});
  }

  async createPlace(createPlaceDto: CreatePlaceDto) {
    return await this.connection.transaction(async (entityManager) => {
      let place = await this.placeRepository.create(createPlaceDto);
      place = await entityManager.save(place);
      return place;
    });
  }

  async updatePlace(updatePlaceDto: UpdatePlaceDto) {
    const place = await this.placeRepository.update(
      updatePlaceDto.id,
      updatePlaceDto,
    );
    return place;
  }
}
