import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionsModule } from './positions/positions.module';
import { Position } from './common/entities/positions.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'samr1493',
      database: 'orga_structure',
      entities: [Position],
      synchronize: true,
    }),
    PositionsModule,
  ],
})
export class AppModule {}
