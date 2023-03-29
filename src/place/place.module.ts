import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceResolver, ContentBlockDataResolver } from './place.resolver';
import { PlaceService } from './place.service';
import { PlaceEntity } from 'src/place/entities/place.entity';
import { PlaceController } from './place.controller';
import { FileUploadModule } from 'src/integrations/s3Upload/fileUpload.module';
import { FileUploadService } from 'src/integrations/s3Upload/fileUpload.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceEntity]), FileUploadModule],
  providers: [
    PlaceResolver,
    ContentBlockDataResolver,
    PlaceService,
    FileUploadService,
  ],
  exports: [PlaceService],
  controllers: [PlaceController],
})
export class PlaceModule {}
