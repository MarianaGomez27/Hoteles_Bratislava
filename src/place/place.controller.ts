import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Logger,
  Res,
  UseInterceptors,
  Param,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { Public, User } from 'src/auth/auth.decorator';
import { PlaceService } from './place.service';
import { CreatePlaceDto, UpdatePlaceDto } from './place.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlaceType } from 'src/graphql';
import { FileUploadService } from 'src/integrations/s3Upload/fileUpload.service';
import * as fs from 'node:fs';
import axios from 'axios';

@Controller('places')
export class PlaceController {
  readonly logger = new Logger('PlaceController');

  constructor(
    private placeService: PlaceService,
    private fileUploadService: FileUploadService,
  ) {}

  @Post('/')
  public async createPlace(
    @User('id') userId: string,
    @Body() createPlaceDto: CreatePlaceDto,
    @Req() req,
  ) {
    const place = this.placeService.createPlace({
      userId: req.user.profile.id,
      placeType: PlaceType.HOTEL,
      ...createPlaceDto,
    });

    return place;
  }

  @Put('/')
  public async updatePlace(
    @User('id') userId: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
    @Req() req,
  ) {
    const place = this.placeService.updatePlace({
      userId: req.user.profile.id,
      placeType: PlaceType.HOTEL,
      ...updatePlaceDto,
    });

    return place;
  }

  @Get('/')
  @Public()
  public async getPlaces() {
    return this.placeService.getPlaces();
  }

  @Post('/upload-by-link')
  public async uploadPlacePhotoByURL(@Body() { url }: { url: string }) {
    const newName = 'photo' + Date.now() + '.jpg';
    const downloadResponse = await axios.get(url, { responseType: 'stream' });
    await this.fileUploadService.upload(
      downloadResponse.data,
      newName,
      'image/jpeg',
    );
    return newName;
  }

  @Public()
  @Get('/uploads/:imageName')
  public async getUploadedImage(@Param('imageName') imageName, @Res() res) {
    const url = this.fileUploadService.getPublicFileUrl(imageName);
    return res.redirect(url);
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('photos', { dest: `${process.cwd()}/uploads/` }),
  )
  public async uploadPlacePhoto(@UploadedFile() file) {
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

  @Get('/me')
  public async getUserPlaces(@User('id') userId, @Req() req) {
    return this.placeService.getPlacesByUserId(req.user.profile.id);
  }

  @Get('/:id')
  @Public()
  public async getPlaceById(@Param('id') placeId) {
    return this.placeService.getPlaceById(placeId);
  }
}
