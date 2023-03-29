import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { OrderStatus, OrderType, Currency } from 'src/graphql';
import { SubscriptionAgreement } from './subscription-agreement.entity';
import { UserEntity } from 'src/user/entities';
import { PlaceEntity } from 'src/place/entities';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  placeId: string;

  // @ManyToOne('Place', 'orders')
  // @JoinColumn({ name: 'placeId', referencedColumnName: 'id' })
  // place?: PlaceEntity;

  @Column()
  userId: string;

  @OneToOne(() => SubscriptionAgreement, (agreement) => agreement.order)
  subscriptionAgreement?: SubscriptionAgreement;

  @Column()
  bankAccountId: string;

  @Column()
  externalRoundId: number;

  @Column()
  externalCreatedAt: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.OPEN })
  status: OrderStatus;

  @Column({ type: 'enum', enum: Currency, default: Currency.USD })
  currency: Currency;

  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Column()
  amount: number;

  @Column()
  quantity: number;

  @Column()
  deadline: string;

  @Column()
  paymentReference: string;

  @Column({ nullable: true })
  transferConfirmed?: boolean;
}
