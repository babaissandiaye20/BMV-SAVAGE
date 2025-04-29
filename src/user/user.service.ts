import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from '../redis/redis.service';
import { ResponseService } from '../validation/exception/response/response.service';
import * as bcrypt from 'bcrypt';
import { SMS_SERVICE, SmsServiceInterface } from '../sms/sms.interface';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly responseService: ResponseService,
    @Inject(SMS_SERVICE)
    private readonly smsService: SmsServiceInterface,
  ) {}

  async create(data: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password: hashedPassword,
        isPhoneVerified: false,
      },
    });

    // Invalider le cache après création
    await this.redisService.del('users:all');

    return this.responseService.created(user, 'User created successfully.');
  }

  async findAll() {
    return this.redisService.cacheable('users:all', 60, async () => {
      const users = await this.prisma.user.findMany({
        where: { deletedAt: null },
      });
      return this.responseService.success(users, 'List of users retrieved.');
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.notFound('User not found.');
    }

    return this.responseService.success(user, 'User retrieved.');
  }

  async update(id: string, data: UpdateUserDto) {
    if (data.password) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    // Invalider le cache après update
    await this.redisService.del('users:all');

    return this.responseService.success(user, 'User updated successfully.');
  }

  async remove(id: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Invalider le cache après suppression
    await this.redisService.del('users:all');

    return this.responseService.success(
      user,
      'User deleted (soft) successfully.',
    );
  }
  async sendPhoneVerificationOtp(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.notFound('User not found.');
    }

    await this.smsService.sendOtp(user.phone);
    return this.responseService.success(null, 'OTP sent to phone.');
  }

  async verifyPhoneOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.notFound('User not found.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.smsService.verifyOtp(user.phone, dto.code);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (result.status === 'approved') {
      await this.prisma.user.update({
        where: { id: dto.userId },
        data: { isPhoneVerified: true },
      });
      return this.responseService.success(null, 'Phone verified successfully.');
    } else {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.badRequest(['Invalid OTP code.']);
    }
  }
}
