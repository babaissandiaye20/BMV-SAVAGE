import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
import { ValidationService } from './validation/validation.service';
import { ExceptionService } from './validation/exception/exception.service';
import { ResponseService } from './validation/exception/response/response.service';
import { ValidationModule } from './validation/validation.module';

@Module({
  imports: [PrismaModule, RedisModule, ValidationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, RedisService, ValidationService, ExceptionService, ResponseService],
})
export class AppModule {}
