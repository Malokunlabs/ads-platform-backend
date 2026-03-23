import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class R2Service {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.R2_REGION,
      endpoint: process.env.R2_ENDPOINT, // e.g. https://<accountid>.r2.cloudflarestorage.com
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true, // Required for R2
    });
    this.bucket = process.env.R2_BUCKET!;
  }

  async uploadImage(fileBuffer: Buffer, fileName: string, mimeType?: string): Promise<string> {
    if (!fileName) {
      throw new Error('fileName is required to upload image');
    }
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType || 'application/octet-stream',
      })
    );
    return fileName;
  }
}
