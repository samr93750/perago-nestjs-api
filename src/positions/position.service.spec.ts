import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../common/entities/positions.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateQueryBuilder } from 'typeorm/query-builder/UpdateQueryBuilder';

const mockPositionRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  }),
});

describe('PositionsService', () => {
  let service: PositionsService;
  let repository: Repository<Position>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionsService,
        {
          provide: getRepositoryToken(Position),
          useValue: mockPositionRepository(),
        },
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
    repository = module.get<Repository<Position>>(getRepositoryToken(Position));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new position', async () => {
      const createPositionDto = {
        name: 'CEO',
        description: 'Chief Executive Officer',
        parentId: null,
      };
      const savedPosition = { id: '1', ...createPositionDto };
      (repository.create as jest.Mock).mockReturnValue(savedPosition);
      (repository.save as jest.Mock).mockResolvedValue(savedPosition);

      const result = await service.create(createPositionDto);
      expect(repository.create).toHaveBeenCalledWith(createPositionDto);
      expect(repository.save).toHaveBeenCalledWith(savedPosition);
      expect(result).toEqual(savedPosition);
    });
  });

  describe('findAll', () => {
    it('should return an array of positions', async () => {
      const positions = [
        {
          id: '1',
          name: 'CEO',
          description: 'Chief Executive Officer',
          parentId: null,
        },
      ];
      (repository.find as jest.Mock).mockResolvedValue(positions);

      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(positions);
    });
  });

  describe('findOne', () => {
    it('should return a position by ID', async () => {
      const position = {
        id: '1',
        name: 'CEO',
        description: 'Chief Executive Officer',
        parentId: null,
      };
      (repository.findOne as jest.Mock).mockResolvedValue(position);

      const result = await service.findOne('1');
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['children'],
      });
      expect(result).toEqual(position);
    });

    it('should throw a NotFoundException if position not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the updated position', async () => {
      const updatePositionDto = {
        name: 'CEO',
        description: 'Chief Executive Officer',
        parentId: null,
      };
      const updatedPosition = { id: '1', ...updatePositionDto };
      (repository.findOne as jest.Mock).mockResolvedValue(updatedPosition);
      (repository.update as jest.Mock).mockResolvedValue(updatedPosition);

      const result = await service.update('1', updatePositionDto);
      expect(repository.update).toHaveBeenCalledWith('1', updatePositionDto);
      expect(result).toEqual(updatedPosition);
    });
  });

  describe('remove', () => {
    it('should delete a position and set its children parentId to null', async () => {
      const position = {
        id: '1',
        name: 'CEO',
        description: 'Chief Executive Officer',
        parentId: null,
        children: [],
      };
      (repository.findOne as jest.Mock).mockResolvedValue(position);
      (repository.delete as jest.Mock).mockResolvedValue({});

      const queryBuilder =
        repository.createQueryBuilder() as unknown as UpdateQueryBuilder<Position>;
      await service.remove('1');
      expect(queryBuilder.update).toHaveBeenCalled();
      expect(queryBuilder.set).toHaveBeenCalledWith({ parentId: null });
      expect(queryBuilder.where).toHaveBeenCalledWith('parentId = :parentId', {
        parentId: '1',
      });
      expect(queryBuilder.execute).toHaveBeenCalled();
      expect(repository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('findHierarchy', () => {
    it('should return a hierarchical structure of positions', async () => {
      const positions = [
        {
          id: '1',
          name: 'CEO',
          description: 'Chief Executive Officer',
          parentId: null,
          children: [],
        },
        {
          id: '2',
          name: 'CTO',
          description: 'Chief Technology Officer',
          parentId: '1',
          children: [],
        },
        {
          id: '3',
          name: 'Developer',
          description: 'Software Developer',
          parentId: '2',
          children: [],
        },
      ];
      (repository.find as jest.Mock).mockResolvedValue(positions);

      const result = await service.findHierarchy();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: '1',
          name: 'CEO',
          description: 'Chief Executive Officer',
          parentId: null,
          children: [
            {
              id: '2',
              name: 'CTO',
              description: 'Chief Technology Officer',
              parentId: '1',
              children: [
                {
                  id: '3',
                  name: 'Developer',
                  description: 'Software Developer',
                  parentId: '2',
                  children: [],
                },
              ],
            },
          ],
        },
      ]);
    });
  });
});
