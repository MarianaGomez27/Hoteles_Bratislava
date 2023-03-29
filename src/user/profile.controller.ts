import {
  Controller,
  Post,
  Body,
  Logger,
  Param,
  Get,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { UserService } from './user.service';
import { User } from 'src/auth/auth.decorator';
import { FileUploadService } from 'src/integrations/s3Upload/fileUpload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'node:fs';

@Controller('profile')
export class ProfileController {
  readonly logger = new Logger('AuthController');

  constructor(
    private userService: UserService,
    private fileUploadService: FileUploadService,
  ) {}

  @Public()
  @Post('/upload/:fileType')
  @UseInterceptors(
    FileInterceptor('photos', { dest: `${process.cwd()}/uploads/` }),
  )
  public async uploadProfileInformationPhoto(
    @UploadedFile() file,
    @Param('fileType') fileType,
  ) {
    // File is automatically stored in the box running this process.
    // Since it is a short lived server (can be rebooted and redeployed automatically)
    // files in the filesystem are not maintained between reboots.
    // So we send it right away to cloudflare.
    const dirName = `${process.cwd()}/uploads/`;
    const blob = fs.readFileSync(`${dirName}/${file.filename}`);
    const url = await this.fileUploadService.upload(
      blob,
      file.filename,
      'image/jpeg',
    );

    return {
      originalname: file.originalname,
      filename: file.filename,
      fileUrl: url,
    };
  }
}
