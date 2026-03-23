import { Injectable } from '@nestjs/common';
import { R2Service } from './r2.service';

@Injectable()
export class ImageUploadService {
  constructor(private readonly r2Service: R2Service) {}

  async uploadImageToR2(file: Express.Multer.File): Promise<string> {
    // Always save images under 'ads/' with a timestamp for uniqueness
    const fileName = `ads/${Date.now()}-${file.originalname}`;
    await this.r2Service.uploadImage(
      file.buffer,
      fileName,
      file.mimetype,
    );
    // Construct the public URL for the uploaded image using the .r2.dev domain
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
    return publicUrl;
  }
}
