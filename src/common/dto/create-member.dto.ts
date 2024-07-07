import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({ description: 'name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'positionId', required: false })
  @IsUUID()
  positionId?: string;
}






