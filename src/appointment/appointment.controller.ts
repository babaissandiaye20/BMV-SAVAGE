import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CreateGuestAppointmentDto } from './dto/create-guest-appointment.dto';
import { ParamAppointmentIdDto } from './dto/param-appointment-id.dto';
import { ParamUserIdDto } from './dto/param-user-id.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Public } from '../common/decorator/public.decorator';

@ApiTags('Appointments')
@ApiBearerAuth('access-token')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Public()
  @Post('guest')
  @ApiOperation({ summary: 'Create a new appointment as a guest' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createAsGuest(@Body() createGuestAppointmentDto: CreateGuestAppointmentDto) {
    return this.appointmentService.createAsGuest(createGuestAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'Return all appointments' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({ status: 200, description: 'Return the appointment' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param() params: ParamAppointmentIdDto) {
    return this.appointmentService.findOne(params.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get appointments by user ID' })
  @ApiResponse({ status: 200, description: 'Return the appointments for the user' })
  findByUserId(@Param() params: ParamUserIdDto) {
    return this.appointmentService.findByUserId(params.userId);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment canceled successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  cancel(@Param() params: ParamAppointmentIdDto) {
    return this.appointmentService.cancel(params.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  update(
    @Param() params: ParamAppointmentIdDto,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(params.id, updateAppointmentDto);
  }
  @Get('user/:userId/pending/no-payment')
  @ApiOperation({
    summary: 'Get pending appointments without payments by user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending appointments without payments returned',
  })
  getPendingAppointmentsWithoutPayment(@Param('userId') userId: string) {
    return this.appointmentService.findPendingAppointmentsWithoutPayment(
      userId,
    );
  }
}
