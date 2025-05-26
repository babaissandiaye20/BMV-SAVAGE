import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from '../redis/redis.service';
import { ResponseService } from '../validation/exception/response/response.service';
import * as bcrypt from 'bcrypt';
import { SMS_SERVICE, SmsServiceInterface } from '../sms/sms.interface';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly responseService: ResponseService,
    private readonly configService: ConfigService,
    @Inject(SMS_SERVICE)
    private readonly smsService: SmsServiceInterface,
  ) {}

  async create(data: CreateUserDto) {
    // Récupérer le rôle "CLIENT" par défaut si aucun roleId n'est fourni
    let roleId = data.roleId;
    if (!roleId) {
      const defaultRole = await this.prisma.role.findFirst({
        where: { name: 'CLIENT' },
      });
      if (!defaultRole) {
        throw this.responseService.error('Default CLIENT role not found.');
      }
      roleId = defaultRole.id;
    }

    // Vérifier si le roleId existe
    if (roleId) {
      const roleExists = await this.prisma.role.findUnique({
        where: { id: roleId },
      });
      if (!roleExists) {
        throw this.responseService.badRequest(['Invalid role ID.']);
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        roleId, // Utiliser le roleId (soit fourni, soit par défaut)
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
        include: { role: true }, // Inclure les informations du rôle
      });
      return this.responseService.success(users, 'List of users retrieved.');
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { role: true }, // Inclure les informations du rôle
    });

    if (!user) {
      throw this.responseService.notFound('User not found.');
    }

    return this.responseService.success(user, 'User retrieved.');
  }

  async update(id: string, data: UpdateUserDto) {
    // Vérifier si le roleId existe
    if (data.roleId) {
      const roleExists = await this.prisma.role.findUnique({
        where: { id: data.roleId },
      });
      if (!roleExists) {
        throw this.responseService.badRequest(['Invalid role ID.']);
      }
    }

    if (data.password) {
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
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw this.responseService.notFound('User not found.');
      }

      if (!user.phone && !user.email) {
        throw this.responseService.badRequest(['User has no phone number or email.']);
      }

      const provider = this.configService.get<string>('SMS_PROVIDER', 'email');
      const target = provider === 'twilio' ? user.phone : user.email;

      if (!target) {
        const missingField = provider === 'twilio' ? 'phone number' : 'email';
        throw this.responseService.badRequest([`User has no ${missingField}.`]);
      }

      console.log(`📤 Envoi OTP via ${provider} à: ${target}`);

      if (!this.smsService) {
        console.error('❌ SMS Service not properly configured');
        throw this.responseService.error('SMS service not available');
      }

      const result = await this.smsService.sendOtp(target);
      console.log('✅ Résultat envoi OTP:', result);

      const message = provider === 'twilio'
        ? 'OTP sent to phone.'
        : 'OTP sent to email.';

      return this.responseService.success(null, message);
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de l'OTP:", error);

      if (error.response) {
        throw error;
      }

      if (error.message) {
        console.error("Message d'erreur:", error.message);
      }
      if (error.stack) {
        console.error("Stack trace:", error.stack);
      }

      throw this.responseService.error('Failed to send OTP');
    }
  }

  async verifyPhoneOtp(dto: VerifyOtpDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });

      if (!user) {
        throw this.responseService.notFound('User not found.');
      }

      const provider = this.configService.get<string>('SMS_PROVIDER', 'email');
      const target = provider === 'twilio' ? user.phone : user.email;

      if (!target) {
        const missingField = provider === 'twilio' ? 'phone number' : 'email';
        throw this.responseService.badRequest([`User has no ${missingField}.`]);
      }

      console.log(`🔍 Vérification OTP via ${provider} pour: ${target}`);

      const result = await this.smsService.verifyOtp(target, dto.code);
      console.log('✅ Résultat vérification OTP:', result);

      if (result.status === 'approved') {
        const updateData = provider === 'twilio'
          ? { isPhoneVerified: true }
          : { isPhoneVerified: true };

        await this.prisma.user.update({
          where: { id: dto.userId },
          data: updateData,
        });

        const message = provider === 'twilio'
          ? 'Phone verified successfully.'
          : 'Email verified successfully.';

        return this.responseService.success(null, message);
      } else {
        throw this.responseService.badRequest(['Invalid OTP code.']);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la vérification de l'OTP:", error);

      if (error.response) {
        throw error;
      }

      throw this.responseService.error('Failed to verify OTP');
    }
  }
}