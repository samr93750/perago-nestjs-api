import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { Member } from '../common/entities/member.entity';
import { PositionsService } from '../positions/positions.service';
import { PositionsController } from '../positions/positions.controller';
import { Position } from '../common/entities/positions.entity';
import { PositionsModule } from 'src/positions/positions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]),PositionsModule],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
