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
import { PlaceType } from 'src/graphql';

@Entity({
  name: 'places',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class PlaceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({
    type: 'enum',
    enum: PlaceType,
    default: PlaceType.HOTEL,
  })
  placeType: PlaceType;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column('simple-array', { array: true })
  photos: string[];

  @Column()
  description: string;

  @Column()
  perks: string;

  @Column()
  extraInfo: string;

  @Column()
  // Format is 2130, 2200 1400 which mean 9:30 pm 10pm and 2 pm respectively
  checkInTime: number;

  @Column()
  // Format is 2130, 2200 1400 which mean 9:30 pm 10pm and 2 pm respectively
  checkOutTime: number;

  @Column()
  maxGuests: number;

  @Column()
  maxPets: number;

  @Column()
  price: number;

  // @OneToMany(() => PlacePageEntity, (entity) => entity.place)
  // pages?: PlacePageEntity[];

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: UserEntity;
}
