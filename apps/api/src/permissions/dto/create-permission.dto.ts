import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'posts.create' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'posts' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  resource: string;

  @ApiProperty({ example: 'create' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  action: string;

  @ApiProperty({ example: 'Can create blog posts', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}
