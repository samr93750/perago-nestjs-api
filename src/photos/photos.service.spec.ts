import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotoService } from './photos.service';
import { Photo } from '../common/entities/photo.entity';
import { Member } from '../common/entities/member.entity';
import { CreatePhotoDto } from '../common/dto/create-photo.dto';
import { NotFoundException } from '@nestjs/common';

const mockPhotoRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

const mockMemberRepository = () => ({
  findOne: jest.fn(),
});

describe('PhotoService', () => {
  let service: PhotoService;
  let photoRepository: Repository<Photo>;
  let memberRepository: Repository<Member>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoService,
        { provide: getRepositoryToken(Photo), useFactory: mockPhotoRepository },
        { provide: getRepositoryToken(Member), useFactory: mockMemberRepository },
      ],
    }).compile();

    service = module.get<PhotoService>(PhotoService);
    photoRepository = module.get<Repository<Photo>>(getRepositoryToken(Photo));
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully insert a photo', async () => {
      const createPhotoDto: CreatePhotoDto = { name: 'Test Photo', memberId: '1', file: null };
      const file = { filename: 'test.jpg' } as any;

      memberRepository.findOne = jest.fn().mockResolvedValue({ id: '1' });
      photoRepository.save = jest.fn().mockResolvedValue({ id: '1', name: 'Test Photo' });

      const result = await service.create(createPhotoDto, file);
      expect(result).toEqual({ id: '1', name: 'Test Photo' });
    });

    it('should throw an error when member is not found', async () => {
      const createPhotoDto: CreatePhotoDto = { name: 'Test Photo', memberId: '1', file: null };
      const file = { filename: 'test.jpg' } as any;

      memberRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.create(createPhotoDto, file)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of photos', async () => {
      const photos = [{ name: 'Test Photo' }];
      photoRepository.find = jest.fn().mockResolvedValue(photos);

      const result = await service.findAll();
      expect(result).toEqual(photos);
    });
  });

  describe('findOne', () => {
    it('should retrieve a photo by ID', async () => {
      const photo = { id: '1', name: 'Test Photo' };
      photoRepository.findOne = jest.fn().mockResolvedValue(photo);

      const result = await service.findOne('1');
      expect(result).toEqual(photo);
    });

    it('should throw an error when photo is not found', async () => {
      photoRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a photo', async () => {
      const photo = { id: '1', name: 'Test Photo' };
      photoRepository.findOne = jest.fn().mockResolvedValue(photo);
      photoRepository.remove = jest.fn().mockResolvedValue(photo);

      await service.remove('1');
      expect(photoRepository.remove).toHaveBeenCalledWith(photo);
    });
  });
});
