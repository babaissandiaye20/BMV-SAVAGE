import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from '../../common/decorator/validators/exists.decorator';

export class VerifyOtpDto {
  @ApiProperty({
    description: "The OTP code sent to the user's phone.",
    example: '123456',
    minLength: 4,
    maxLength: 10,
  })
  @IsString()
  @Length(4, 10, { message: 'Code must be between 4 and 10 characters.' })
  code: string;

  @ApiProperty({
    description: 'The ID of the user verifying the OTP.',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
  })
  @IsString()
  @Exists('user', 'id', { message: 'User does not exist.' })
  userId: string;
}
