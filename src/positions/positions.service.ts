import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from '../common/entities/positions.entity';
import { CreatePositionDto } from '../common/dto/create-position.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const position = this.positionsRepository.create(createPositionDto);
    return this.positionsRepository.save(position);
  }

  async findAll(): Promise<Position[]> {
    return this.positionsRepository.find({ relations: ['children'] });
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.positionsRepository.findOne({where:{id}, 
      relations: ['children'],
    });
    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return position;
  }

  async update(
    id: string,
    updatePositionDto: CreatePositionDto,
  ): Promise<Position> {
    await this.positionsRepository.update(id, updatePositionDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const position = await this.findOne(id);

    // Set parentId of all children to null
    if (position.children.length > 0) {
      await this.positionsRepository
        .createQueryBuilder()
        .update(Position)
        .set({ parentId: null })
        .where('parentId = :parentId', { parentId: id })
        .execute();
    }

    await this.positionsRepository.delete(id);
  }

  async findChildren(id: string): Promise<Position[]> {
    const position = await this.findOne(id);
    return position.children;
  }

  async findHierarchy(): Promise<Position[]> {
    const roots = await this.positionsRepository.find({
      where: { parentId: null },
      relations: ['children'],
    });
    return roots;
  }
}
