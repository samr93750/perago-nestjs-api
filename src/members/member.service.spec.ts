import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersService } from './members.service';
import { Member } from '../common/entities/member.entity';
import { CreateMemberDto } from '../common/dto/create-member.dto';
import { NotFoundException } from '@nestjs/common';

const mockMemberRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('MemberService', () => {
  let service: MembersService;
  let memberRepository: Repository<Member>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useFactory: mockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    memberRepository = module.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully insert a member', async () => {
      const createMemberDto: CreateMemberDto = { name: 'Test Member' };
      memberRepository.save = jest
        .fn()
        .mockResolvedValue({ id: '1', name: 'Test Member' });

      const result = await service.create(createMemberDto);
      expect(result).toEqual({ id: '1', name: 'Test Member' });
    });
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const members = [{ name: 'Test Member' }];
      memberRepository.find = jest.fn().mockResolvedValue(members);

      const result = await service.findAll();
      expect(result).toEqual(members);
    });
  });

  describe('findOne', () => {
    it('should retrieve a member by ID', async () => {
      const member = { id: '1', name: 'Test Member' };
      memberRepository.findOne = jest.fn().mockResolvedValue(member);

      const result = await service.findOne('1');
      expect(result).toEqual(member);
    });

    it('should throw an error when member is not found', async () => {
      memberRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a member', async () => {
      const member = { id: '1', name: 'Test Member' };
      memberRepository.findOne = jest.fn().mockResolvedValue(member);
      memberRepository.remove = jest.fn().mockResolvedValue(member);

      await service.remove('1');
      expect(memberRepository.remove).toHaveBeenCalledWith(member);
    });
  });
});
