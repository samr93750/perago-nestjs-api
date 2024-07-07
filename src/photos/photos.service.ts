import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../common/entities/photo.entity';
import { CreatePhotoDto } from '../common/dto/create-photo.dto';
import { UpdatePhotoDto } from '../common/dto/update-photo-dto';
import { Member } from '../common/entities/member.entity';

@Injectable()
export class PhotoService {
    logger: any;
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
    const { name, memberId } = createPhotoDto;

    // // Log the file information
    // this.logger.debug(`Received file: ${file.originalname} (${file.mimetype})`);
    // this.logger.debug(`Stored file: ${file.filename}`);

    // Find the member associated with the photo
    const member = await this.memberRepository.findOne({
      where: { id: memberId },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    // Create a new photo entity
    const photo = new Photo();
    photo.name = name;
    photo.filename = file.filename;
    photo.member = member;

    // Log the photo entity before saving
    // this.logger.debug(`Creating photo: ${JSON.stringify(photo)}`);

    // Save the photo entity in the database
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
    const { name } = updatePhotoDto;

    // Find the photo to update
    const photo = await this.findOne(id);

    // Update photo properties
    photo.name = name;

    // Save the updated photo entity
    return this.photoRepository.save(photo);
  }

  async remove(id: string): Promise<void> {
    // Find the photo to remove
    const photo = await this.findOne(id);

    // Remove the photo from the database
    await this.photoRepository.remove(photo);
  }
}
