import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

// Mock Stripe
jest.mock('stripe', () => {
  const mockStripe = jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ id: 'pi_123', status: 'succeeded' }),
      retrieve: jest.fn().mockResolvedValue({ id: 'pi_123', status: 'succeeded' }),
    },
    refunds: {
      create: jest.fn().mockResolvedValue({ status: 'succeeded' }),
    },
  }));
  return { __esModule: true, default: mockStripe };
});

describe('StripeService', () => {
  let service: StripeService;

  beforeEach(async () => {
    // Set environment variable for test
    process.env.STRIPE_SECRET_KEY = 'test_key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeService],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.STRIPE_SECRET_KEY;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
