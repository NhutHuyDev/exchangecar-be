import { S3Config } from '@/configs/s3.config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const s3Config = this.configService.get<S3Config>('s3');

    this.s3Client = new S3Client({
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.accessKey,
        secretAccessKey: s3Config.secretKet,
      },
    });
  }

  async uploadImageToBucket(
    fileBuffer: Buffer,
    fileName: string,
    mimetype: string,
  ) {
    const s3Config = this.configService.get<S3Config>('s3');

    const uploadParams = {
      Bucket: this.configService.get<S3Config>('s3').name,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimetype,
    };

    await this.s3Client.send(new PutObjectCommand(uploadParams));

    return `https://${s3Config.name}.s3.${s3Config.region}.amazonaws.com/${fileName}`;
  }
}
