import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from '../common/dto/create-position.dto';
import { Position } from '../common/entities/positions.entity';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  create(@Body() createPositionDto: CreatePositionDto): Promise<Position> {
    return this.positionsService.create(createPositionDto);
  }

  @Get()
  findAll(): Promise<Position[]> {
    return this.positionsService.findAll();
  }

  @Get('hierarchy')
  findHierarchy(): Promise<Position[]> {
    return this.positionsService.findHierarchy();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Position> {
    return this.positionsService.findOne(id);
  }

  @Get(':id/children')
  findChildren(@Param('id') id: string): Promise<Position[]> {
    return this.positionsService.findChildren(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePositionDto: CreatePositionDto,
  ): Promise<Position> {
    return this.positionsService.update(id, updatePositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.positionsService.remove(id);
  }
}
