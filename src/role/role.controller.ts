import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Public } from '../common/decorator/public.decorator';

@ApiTags('Roles')
@Controller('roles')

export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  @ApiBody({ type: CreateRoleDto })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'List of roles.' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single role by ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Role found.' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Role updated.' })
  @ApiBody({ type: UpdateRoleDto })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a role by ID' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Role soft-deleted.' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
