import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from '../common/entities/photo.entity';
import { PhotoService } from './photos.service';
import { PhotoController } from './photos.controller';
import { Member } from '../common/entities/member.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Photo, Member])],
  providers: [PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}
