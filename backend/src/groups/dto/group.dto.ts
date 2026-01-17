import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  start_date: string;

  @IsString()
  @ApiProperty()
  end_date: string;

  @IsString()
  @ApiProperty()
  theme: string;
}