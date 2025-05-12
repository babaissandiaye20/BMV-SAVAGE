import { Test, TestingModule } from '@nestjs/testing';
import { TwilioService } from './twilio.service';
import { ConfigService } from '@nestjs/config';

describe('TwilioService', () => {
  let service: TwilioService;
  let configService: ConfigService;

  // Create mock implementation of ConfigService
  const mockConfigService = {
    get: jest.fn((key: string) => {
      // Return mock values for Twilio configuration
      if (key === 'TWILIO_ACCOUNT_SID') return 'AC123456789012345678901234567890';
      if (key === 'TWILIO_AUTH_TOKEN') return 'test_auth_token';
      if (key === 'TWILIO_SERVICE_SID') return 'test_service_sid';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TwilioService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TwilioService>(TwilioService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
