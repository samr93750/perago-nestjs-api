import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Position } from '../common/entities/positions.entity';
import { Repository } from 'typeorm';

describe('PositionsService', () => {
  let service: PositionsService;
  let repository: Repository<Position>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionsService,
        {
          provide: getRepositoryToken(Position),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
    repository = module.get<Repository<Position>>(getRepositoryToken(Position));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set parentId of children to null when removing a parent', async () => {
    const parent = {
      id: 'parent-id',
      children: [{ id: 'child-id', parentId: 'parent-id' }],
    } as Position;
    jest.spyOn(service, 'findOne').mockResolvedValue(parent);
    const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(null);
    const deleteSpy = jest.spyOn(repository, 'delete').mockResolvedValue(null);

    await service.remove('parent-id');

    expect(saveSpy).toHaveBeenCalledWith([{ id: 'child-id', parentId: null }]);
    expect(deleteSpy).toHaveBeenCalledWith('parent-id');
  });
});
