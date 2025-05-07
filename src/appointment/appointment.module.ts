import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { ResponseService } from '../validation/exception/response/response.service';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [AppointmentController],
  providers: [AppointmentService, ResponseService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
