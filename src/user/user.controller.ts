import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated.' })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User soft-deleted.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @Post(':id/send-otp')
  @ApiOperation({ summary: 'Send OTP to user phone' })
  @ApiResponse({ status: 200, description: 'OTP sent to user.' })
  sendOtp(@Param('id') id: string) {
    return this.usersService.sendPhoneVerificationOtp(id);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and activate phone' })
  @ApiResponse({ status: 200, description: 'Phone verified.' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.usersService.verifyPhoneOtp(dto);
  }
}
