import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Unique } from '../../common/decorator/validators/unique.decorator';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Adresse email',
  })
  @IsEmail()
  @IsNotEmpty()
  @Unique('user', 'email', { message: 'Email already exists' })
  email: string;

  @ApiProperty({ example: '+14155552671', description: 'Téléphone' })
  @IsPhoneNumber()
  @IsNotEmpty()
  @Unique('user', 'phone', { message: 'Phone number already exists' })
  phone: string;

  @ApiProperty({ example: 'John', description: 'Prénom' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Nom de famille' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'Mot de passe sécurisé',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'uuid-of-role',
    description: 'ID du rôle (optionnel, par défaut CLIENT)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  roleId?: string;
}