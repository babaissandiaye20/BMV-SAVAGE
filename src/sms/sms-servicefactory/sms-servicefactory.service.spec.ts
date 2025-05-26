import { Test, TestingModule } from '@nestjs/testing';
import { SmsServicefactoryService } from './sms-servicefactory.service';

describe('SmsServicefactoryService', () => {
  let service: SmsServicefactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsServicefactoryService],
    }).compile();

    service = module.get<SmsServicefactoryService>(SmsServicefactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
