import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { ResponseService } from '../validation/exception/response/response.service';
import { SMS_SERVICE, SmsServiceInterface } from '../sms/sms.interface';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let redisService: RedisService;
  let responseService: ResponseService;
  let smsService: SmsServiceInterface;

  // Create mock implementations
  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    cacheable: jest.fn().mockImplementation((key, ttl, callback) => callback()),
  };

  const mockResponseService = {
    success: jest.fn(),
    created: jest.fn(),
    notFound: jest.fn(),
    badRequest: jest.fn(),
  };

  const mockSmsService = {
    sendOtp: jest.fn(),
    verifyOtp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: ResponseService,
          useValue: mockResponseService,
        },
        {
          provide: SMS_SERVICE,
          useValue: mockSmsService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    redisService = module.get<RedisService>(RedisService);
    responseService = module.get<ResponseService>(ResponseService);
    smsService = module.get(SMS_SERVICE);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
