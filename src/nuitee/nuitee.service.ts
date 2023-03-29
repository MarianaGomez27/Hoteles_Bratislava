import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Equal, In, Not, Repository } from 'typeorm';
import { NuiteeEntity } from 'src/nuitee/entities/nuitee.entity';
import { ContentBlockDto } from 'src/nuitee/dto/contentBlock.dto';
import { BookingEntity } from 'src/booking/booking.entity';
import { CreateNuiteeDto, UpdateNuiteeDto } from './nuitee.types';

@Injectable()
export class NuiteeService {
  constructor(
    private connection: Connection,
    @InjectRepository(NuiteeEntity)
    private readonly nuiteeRepository: Repository<NuiteeEntity>,
  ) {}

  async getPlaceById(id: string): Promise<NuiteeEntity> {
    return await this.nuiteeRepository.findOne({
      where: { id },
    });
  }

  async getPlacesByUserId(userId: string): Promise<NuiteeEntity[]> {
    const places = await this.nuiteeRepository.find({
      where: { userId: userId },
    });
    return places;
  }

  async getPlaces(): Promise<NuiteeEntity[]> {
    return await this.nuiteeRepository.find({});
  }

  async createPlace(createNuiteeDto: CreateNuiteeDto) {
    return await this.connection.transaction(async (entityManager) => {
      let place = await this.nuiteeRepository.create(createNuiteeDto);
      place = await entityManager.save(place);
      return place;
    });
  }

  async updatePlace(updateNuiteeDto: UpdateNuiteeDto) {
    const place = await this.nuiteeRepository.update(
      updateNuiteeDto.id,
      updateNuiteeDto,
    );
    return place;
  }
}
