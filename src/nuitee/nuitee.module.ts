import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NuiteeResolver, ContentBlockDataResolver } from './nuitee.resolver';
import { NuiteeService } from './nuitee.service';
import { NuiteeEntity } from 'src/nuitee/entities/nuitee.entity';
import { NuiteeController } from './nuitee.controller';
import { FileUploadModule } from 'src/integrations/s3Upload/fileUpload.module';
import { FileUploadService } from 'src/integrations/s3Upload/fileUpload.service';

@Module({
  imports: [TypeOrmModule.forFeature([NuiteeEntity]), FileUploadModule],
  providers: [
    NuiteeResolver,
    ContentBlockDataResolver,
    NuiteeService,
    FileUploadService,
  ],
  exports: [NuiteeService],
  controllers: [NuiteeController],
})
export class NuiteeModule {}
