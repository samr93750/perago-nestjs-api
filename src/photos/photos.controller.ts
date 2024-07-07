import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from '../photos/photos.service';
import { CreatePhotoDto } from '../common/dto/create-photo.dto';
import { Photo } from '../common/entities/photo.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';

@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // directory to store the files
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createPhotoDto: CreatePhotoDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Photo> {
    return this.photoService.create(createPhotoDto, file);
  }
}
