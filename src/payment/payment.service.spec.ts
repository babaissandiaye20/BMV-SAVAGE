import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentProcessorFactory } from './payment-processor.factory';
import { ResponseService } from '../validation/exception/response/response.service';
import { PaymentProcessor } from './payment-processor.interface';

describe('PaymentService', () => {
  let service: PaymentService;
  let prismaService: PrismaService;
  let paymentProcessorFactory: PaymentProcessorFactory;
  let responseService: ResponseService;

  // Mock payment processor
  const mockPaymentProcessor: PaymentProcessor = {
    charge: jest.fn().mockResolvedValue({ transactionId: 'tx_123', status: 'PAID' }),
    refund: jest.fn().mockResolvedValue(true),
    getTransactionDetails: jest.fn().mockResolvedValue({ id: 'tx_123', status: 'succeeded' }),
  };

  // Create mock implementations
  const mockPrismaService = {
    appointment: {
      findUnique: jest.fn(),
    },
    payment: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    paymentMode: {
      findUnique: jest.fn(),
    },
  };

  const mockPaymentProcessorFactory = {
    getProcessor: jest.fn().mockReturnValue(mockPaymentProcessor),
  };

  const mockResponseService = {
    success: jest.fn(),
    created: jest.fn(),
    badRequest: jest.fn(),
    notFound: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PaymentProcessorFactory,
          useValue: mockPaymentProcessorFactory,
        },
        {
          provide: ResponseService,
          useValue: mockResponseService,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    prismaService = module.get<PrismaService>(PrismaService);
    paymentProcessorFactory = module.get<PaymentProcessorFactory>(PaymentProcessorFactory);
    responseService = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
