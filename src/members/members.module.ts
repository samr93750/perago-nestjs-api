import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { Member } from '../common/entities/member.entity';
// import { PositionsService } from './positions.service';
// import { PositionsController } from './positions.controller';
// import { Position } from '../common/entities/positions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
