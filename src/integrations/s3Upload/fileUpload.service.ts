import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  CompleteMultipartUploadCommandOutput,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly s3Client: S3Client;
  private readonly configService: ConfigService;

  constructor(private readonly config: ConfigService) {
    this.configService = config;
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('CLOUDFLARE_ACCOUNT_ID'),
        secretAccessKey: this.configService.get('CLOUDFLARE_IMAGE_API_TOKEN'),
      },
      endpoint: this.configService.get('CLOUDFLARE_ENDPOINT'),
      forcePathStyle: true,
      region: 'eeur',
    });
  }

  /**
   * Streams file data to S3
   * @param stream
   * @param key - The destination within the S3 bucket
   */
  async upload(
    stream: Buffer,
    key: string,
    contentType?: string,
  ): Promise<string> {
    const up = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.configService.get('CLOUDFLARE_TRIPTECH_BUCKET_NAME'),
        Key: key,
        Body: stream,
        ContentType: contentType,
      },
    });

    up.on('httpUploadProgress', (progress) => {
      this.logger.debug('Uploaded ' + progress.loaded + ' bytes.');
    });

    const result = (await up.done()) as CompleteMultipartUploadCommandOutput;
    return this.getPublicFileUrl(result.Key);
  }

  getPublicFileUrl(filename: string) {
    const publicUrl = this.configService.get(
      'CLOUDFLARE_TRIPTECH_PUBLIC_BUCKET_URL',
    );
    return `${publicUrl}/${filename}`;
  }
}
