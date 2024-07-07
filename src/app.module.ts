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
import { PhotoModule } from './photos/photos.module';
import { Photo } from './common/entities/photo.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'samr1493',
      database: 'org_user',
      entities: [Position, Member, Photo], // Add Photo here
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forFeature([Position, Member, Photo]),
    PhotoModule,
    MembersModule,
    PhotoModule,
  ],
  controllers: [AppController, PositionsController, MembersController],
  providers: [AppService, PositionsService, MembersService],
})
export class AppModule {}
