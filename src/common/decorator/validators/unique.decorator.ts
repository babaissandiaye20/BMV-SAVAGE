import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { getFromContainer } from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueConstraint implements ValidatorConstraintInterface {
  private prisma: PrismaService;

  constructor() {
    this.prisma = getFromContainer(PrismaService); // ✅ injection manuelle
  }

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [modelName, fieldName] = args.constraints as [string, string];

    if (!this.prisma[modelName]) {
      console.error(`Model ${modelName} does not exist in PrismaService.`);
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const record = await this.prisma[modelName].findFirst({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { [fieldName]: value },
    });

    return !record;
  }

  defaultMessage(args: ValidationArguments): string {
    const [, fieldName] = args.constraints as [string, string];
    return `${fieldName} already exists`;
  }
}

export function Unique(
  model: string,
  field: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [model, field],
      validator: UniqueConstraint,
    });
  };
}
