import { Global, Module } from '@nestjs/common';
import { FileUploadService } from './fileUpload.service';

@Global()
@Module({
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
