import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity({
  name: 'users',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  externalId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  fathersLastName?: string;

  @Column({ nullable: true })
  mothersLastName?: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  mobilePhoneNumber?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  countryOfBirth?: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  townOrCity: string;

  @Column({ nullable: true })
  suburb: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  buildingNumber: string;

  @Column({ nullable: true })
  internalBuildingNumber: string;

  @Column({ nullable: true })
  postcode: string;

  @Column({ nullable: true })
  agencyName: string;

  @Column({ nullable: true })
  rnt: string;

  @Column({ nullable: true })
  rntFileName: string;

  @Column({ nullable: true })
  taxIdentificationNumber: string;

  @Column({ nullable: true })
  taxIdentificationNumberFileName: string;

  @Column({ nullable: true })
  clabe: string;

  @Column({ nullable: true })
  clabeFileName: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  isAmavAffiliate: boolean;

  @Column({ nullable: true })
  onboardingStatus: string;

  @Column()
  role: string;
}
