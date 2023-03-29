import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

import { UserEntity } from 'src/user/entities/user.entity';
import { PlaceEntity } from 'src/place/entities/place.entity';

@Entity('bookings')
export class BookingEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  placeId: string;

  @Column()
  checkInDate: Date;

  @Column()
  checkOutDate: Date;

  @Column()
  bookingContactName: string;

  @Column()
  bookingContactPhoneNumber: string;

  @Column()
  bookingNotes: string;

  @Column()
  numberOfAdults: number;

  @Column()
  numberOfChildren: number;

  @Column()
  numberOfPets: number;

  @Column()
  price: string;

  @Column()
  currency: string;

  @ManyToOne(() => PlaceEntity)
  @JoinColumn({ name: 'placeId', referencedColumnName: 'id' })
  place?: PlaceEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: UserEntity;
}
