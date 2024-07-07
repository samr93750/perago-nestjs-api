import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../common/entities/photo.entity';
import { CreatePhotoDto } from '../common/dto/create-photo.dto';
import { UpdatePhotoDto } from '../common/dto/update-photo-dto';
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

  async findAll(): Promise<Photo[]> {
    return this.photoRepository.find({ relations: ['member'] });
  }

  async findOne(id: string): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id },
      relations: ['member'],
    });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }
    return photo;
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
    const photo = await this.findOne(id);
    photo.name = updatePhotoDto.name;
    return this.photoRepository.save(photo);
  }

  async remove(id: string): Promise<void> {
    const photo = await this.findOne(id);
    await this.photoRepository.remove(photo);
  }
}
