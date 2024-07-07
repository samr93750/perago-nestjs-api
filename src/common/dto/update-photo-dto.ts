import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { UploadPhotoDto } from './uploadphoto-dto';

export class UpdatePhotoDto extends PartialType(UploadPhotoDto) {
  @ApiProperty({ type: 'string', required: false })
  name?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: any;

  @IsNumber()
  @ApiProperty({ required: false })
  memberId?: number;
}
