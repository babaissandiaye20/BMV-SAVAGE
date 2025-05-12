import { Test, TestingModule } from '@nestjs/testing';
import { PaymentModeService } from './payment-mode.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../validation/exception/response/response.service';

describe('PaymentModeService', () => {
  let service: PaymentModeService;
  let prismaService: PrismaService;
  let responseService: ResponseService;

  // Create mock implementations
  const mockPrismaService = {
    paymentMode: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockResponseService = {
    success: jest.fn(),
    created: jest.fn(),
    notFound: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentModeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ResponseService,
          useValue: mockResponseService,
        },
      ],
    }).compile();

    service = module.get<PaymentModeService>(PaymentModeService);
    prismaService = module.get<PrismaService>(PrismaService);
    responseService = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
