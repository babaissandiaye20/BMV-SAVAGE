import { Module } from '@nestjs/common';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RedisService } from '../redis/redis.service';
import { ResponseService } from '../validation/exception/response/response.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [RoleService, RedisService, ResponseService],
  controllers: [RoleController],
  imports: [PrismaModule],
})
export class RoleModule {}
