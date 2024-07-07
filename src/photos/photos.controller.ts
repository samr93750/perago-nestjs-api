import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiConsumes, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { PhotoService } from './photos.service';
import { CreatePhotoDto } from '../common/dto/create-photo.dto';
import { UpdatePhotoDto } from '../common/dto/update-photo-dto';
import { Photo } from '../common/entities/photo.entity';

@ApiTags('photos')
@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Photo upload',
    type: CreatePhotoDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Specify the directory to store files
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
 
 async uploadFile(
    @Body() createPhotoDto: CreatePhotoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createPhotoDto);
    console.log(file);
     const photo = await this.photoService.create(createPhotoDto, file);
    return {
      message: 'Photo uploaded successfully',
      file: file.originalname,
      photo,
    };
  }

  @Get()
  findAll(): Promise<Photo[]> {
    return this.photoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Photo> {
    return this.photoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
  ): Promise<Photo> {
    return this.photoService.update(id, updatePhotoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.photoService.remove(id);
  }
}
