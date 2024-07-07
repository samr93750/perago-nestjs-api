import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../common/entities/photo.entity';
import { CreatePhotoDto } from '../common/dto/create-photo.dto';
import { Member } from '../common/entities/member.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async create(
    createPhotoDto: CreatePhotoDto,
    file: Express.Multer.File,
  ): Promise<Photo> {
    const member = await this.memberRepository.findOne({
      where: { id: createPhotoDto.memberId },
    });

    const photo = new Photo();
    photo.name = createPhotoDto.name;
    photo.filename = file.filename;
    photo.member = member;

    return this.photoRepository.save(photo);
  }
}
