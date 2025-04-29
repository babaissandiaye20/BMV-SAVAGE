import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ResponseService } from '../validation/exception/response/response.service';
import { RedisService } from '../redis/redis.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SmsModule } from '../sms/sms.module'; // ✅ Ajout ici

@Module({
  imports: [PrismaModule, SmsModule], // ✅ Tu importes PrismaModule
  controllers: [UserController],
  providers: [UserService, RedisService, ResponseService],
})
export class UserModule {}
