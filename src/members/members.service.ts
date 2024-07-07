import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../common/entities/member.entity';
import { CreateMemberDto } from '../common/dto/create-member.dto';
import { UpdateMemberDto } from '../common/dto/update-member.dto';
import { Position } from '../common/entities/positions.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const { name, positionId } = createMemberDto;

    let position: Position = null;
    if (positionId) {
      position = await this.positionsRepository.findOne({
        where: { id: positionId },
      });

      if (!position) {
        throw new NotFoundException(`Position with ID ${positionId} not found`);
      }
    }

    const member = this.membersRepository.create({ name, position });
    return this.membersRepository.save(member);
  }

  async findAll(): Promise<Member[]> {
    return this.membersRepository.find({ relations: ['position'] });
  }

  async findOne(id: string): Promise<Member> {
    const member = await this.membersRepository.findOne({
      where: { id },
      relations: ['position'],
    });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);

    if (updateMemberDto.name) {
      member.name = updateMemberDto.name;
    }

    if (updateMemberDto.positionId) {
      const position = await this.positionsRepository.findOne({
        where: { id: updateMemberDto.positionId },
      });
      if (!position) {
        throw new NotFoundException(
          `Position with ID ${updateMemberDto.positionId} not found`,
        );
      }
      member.position = position;
    } else {
      member.position = null;
    }

    return this.membersRepository.save(member);
  }

  async remove(id: string): Promise<void> {
    const member = await this.findOne(id);
    await this.membersRepository.remove(member);
  }
}
