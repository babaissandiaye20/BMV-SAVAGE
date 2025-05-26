import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Unique } from '../../common/decorator/validators/unique.decorator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Nom unique du rôle (par exemple, CLIENT, ADMIN)',
  })
  @IsString()
  @IsNotEmpty()
  @Unique('role', 'name', { message: 'Role name already exists' })
  name: string;

  @ApiProperty({
    example: 'Administrateur avec tous les privilèges',
    description: 'Description du rôle (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}