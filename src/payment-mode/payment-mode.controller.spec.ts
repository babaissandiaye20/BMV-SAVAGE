import { Test, TestingModule } from '@nestjs/testing';
import { PaymentModeController } from './payment-mode.controller';
import { PaymentModeService } from './payment-mode.service';

describe('PaymentModeController', () => {
  let controller: PaymentModeController;
  let paymentModeService: PaymentModeService;

  // Create mock implementation of PaymentModeService
  const mockPaymentModeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentModeController],
      providers: [
        {
          provide: PaymentModeService,
          useValue: mockPaymentModeService,
        },
      ],
    }).compile();

    controller = module.get<PaymentModeController>(PaymentModeController);
    paymentModeService = module.get<PaymentModeService>(PaymentModeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
