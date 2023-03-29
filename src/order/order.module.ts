import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order as OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), UserModule],
  providers: [OrderService, OrderResolver, Logger],
  exports: [OrderService],
})
export class OrderModule {}
