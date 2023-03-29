import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { WhitelistEntity } from './entities/whitelist.entity';
import { UserController } from './user.controller';
import { FileUploadModule } from 'src/integrations/s3Upload/fileUpload.module';
import { FileUploadService } from 'src/integrations/s3Upload/fileUpload.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, WhitelistEntity]),
    FileUploadModule,
  ],
  providers: [UserService, UserResolver, Logger, FileUploadService],
  exports: [UserService],
  controllers: [UserController, ProfileController],
})
export class UserModule {}
