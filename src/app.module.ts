import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionsModule } from './positions/positions.module';
import { Position } from './common/entities/positions.entity';
import { Member } from './common/entities/member.entity';
import { MembersService } from './members/members.service';
import { MembersController } from './members/members.controller';
import { PositionsController } from './positions/positions.controller';
import { AppController } from './app.controller';
import { PositionsService } from './positions/positions.service';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'samr1493',
      database: 'org_user',
      entities: [Position,Member],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Position, Member]),
  ],
  controllers: [AppController, PositionsController, MembersController],
  providers: [AppService, PositionsService, MembersService],
})
export class AppModule {}
