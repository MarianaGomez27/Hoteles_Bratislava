import { Order } from './order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { SubscriptionAgreementStatus } from 'src/graphql';

@Entity()
export class SubscriptionAgreement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @OneToOne(() => Order, (order) => order.subscriptionAgreement)
  @JoinColumn({ name: 'orderId', referencedColumnName: 'id' })
  order: Order;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @Column()
  envelopeId: string;

  @Column('enum', {
    name: 'status',
    enum: SubscriptionAgreementStatus,
    default: SubscriptionAgreementStatus.NOT_SIGNED,
  })
  status: SubscriptionAgreementStatus;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
