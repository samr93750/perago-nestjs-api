import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The photo file',
  })
  file: any;

  @ApiProperty({ description: 'Name of the photo' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID of the member associated with the photo' })
  @IsString()
  memberId: string;

}
