import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;
}
