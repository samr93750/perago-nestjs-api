import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberDto {
  @ApiProperty({ description: 'Name of the member', required: false })
  @IsString()
  @IsOptional()
  name?: string;


  @ApiProperty({ description: 'Position ID of the member', required: false })
  @IsUUID()
  @IsOptional()
  positionId?: string;
}
