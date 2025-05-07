import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../validation/exception/response/response.service';
import { AppointmentStatus } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CreateGuestAppointmentDto } from './dto/create-guest-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponseService,
  ) {}

  async create(data: CreateAppointmentDto) {
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    const appointment = await this.prisma.appointment.create({
      data: {
        userId: data.userId,
        vin: data.vin,
        vehicleType: data.vehicleType,
        titleNumber: data.titleNumber,
        scheduledAt: data.scheduledAt,
        location: data.location,
        status: AppointmentStatus.PENDING,
      },
    });

    return this.responseService.created(
      appointment,
      'Appointment created with status PENDING.',
    );
  }

  async findAll() {
    const appointments = await this.prisma.appointment.findMany({
      where: { deletedAt: null },
      include: { user: true, payments: true },
    });

    return this.responseService.success(
      appointments,
      'Appointments retrieved.',
    );
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { user: true, payments: true },
    });

    if (!appointment) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.notFound('Appointment not found.');
    }

    return this.responseService.success(
      appointment,
      'Appointment retrieved.',
    );
  }

  async findByUserId(userId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: { payments: true },
    });

    return this.responseService.success(
      appointments,
      'Appointments for user retrieved.',
    );
  }

  async cancel(id: string) {
    const appointment = await this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELED },
    });

    return this.responseService.success(appointment, 'Appointment canceled.');
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    // Check if appointment exists
    const existingAppointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw this.responseService.notFound('Appointment not found.');
    }

    // Update the appointment
    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        ...updateAppointmentDto,
      },
    });

    return this.responseService.success(
      updatedAppointment,
      'Appointment updated successfully.',
    );
  }

  async createAsGuest(data: CreateGuestAppointmentDto) {
    // Check if user with this email already exists
    let user = await this.prisma.user.findFirst({
      where: { email: data.email, deletedAt: null },
    });

    // If user doesn't exist, create a temporary user
    if (!user) {
      // Generate a random password for the temporary user
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user = await this.prisma.user.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          password: hashedPassword,
          isPhoneVerified: false, // Guest users are not verified by default
        },
      });
    }

    // Create the appointment
    const appointment = await this.prisma.appointment.create({
      data: {
        userId: user.id,
        vin: data.vin,
        vehicleType: data.vehicleType,
        titleNumber: data.titleNumber,
        scheduledAt: data.scheduledAt,
        location: data.location,
        status: AppointmentStatus.PENDING,
      },
      include: { user: true },
    });

    return this.responseService.created(
      appointment,
      'Guest appointment created with status PENDING.',
    );
  }
}
