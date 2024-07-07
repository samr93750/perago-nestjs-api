import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreatePositionDto {
  @ApiProperty({ description: 'Name of the name', required: false })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Name of description', required: false })
  @IsString()
  description: string;

  @ApiProperty({ description: 'parentId', required: false })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
