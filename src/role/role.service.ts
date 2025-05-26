import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { ResponseService } from '../validation/exception/response/response.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly responseService: ResponseService,
  ) {}

  async create(data: CreateRoleDto) {
    const role = await this.prisma.role.create({
      data: {
        ...data,
      },
    });

    // Invalider le cache après création
    await this.redisService.del('roles:all');

    return this.responseService.created(role, 'Role created successfully.');
  }

  async findAll() {
    return this.redisService.cacheable('roles:all', 60, async () => {
      const roles = await this.prisma.role.findMany({
        where: { deletedAt: null },
      });
      return this.responseService.success(roles, 'List of roles retrieved.');
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
    });

    if (!role) {
      throw this.responseService.notFound('Role not found.');
    }

    return this.responseService.success(role, 'Role retrieved.');
  }

  async update(id: string, data: UpdateRoleDto) {
    const role = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
    });

    if (!role) {
      throw this.responseService.notFound('Role not found.');
    }

    const updatedRole = await this.prisma.role.update({
      where: { id },
      data,
    });

    // Invalider le cache après update
    await this.redisService.del('roles:all');

    return this.responseService.success(updatedRole, 'Role updated successfully.');
  }

  async remove(id: string) {
    const role = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
    });

    if (!role) {
      throw this.responseService.notFound('Role not found.');
    }

    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Invalider le cache après suppression
    await this.redisService.del('roles:all');

    return this.responseService.success(
      updatedRole,
      'Role deleted (soft) successfully.',
    );
  }
}