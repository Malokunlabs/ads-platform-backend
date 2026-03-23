import { Module, Global } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { R2Service } from './r2.service';
import { ImageUploadService } from './image-upload.service';

@Global()
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  providers: [R2Service, ImageUploadService],
  exports: [MulterModule, R2Service, ImageUploadService],
})
export class UploadModule {}
