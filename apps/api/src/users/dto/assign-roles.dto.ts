import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRolesDto {
  @ApiProperty({ example: ['uuid-1', 'uuid-2'], description: 'Array of role IDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  roleIds: string[];
}
