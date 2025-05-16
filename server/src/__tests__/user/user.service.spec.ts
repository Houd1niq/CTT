import {Test, TestingModule} from '@nestjs/testing';
import {UserService} from '../../user/user.service';
import {PrismaService} from '../../prisma/prisma.service';

jest.setTimeout(15000);

describe('UserService', () => {
  let service: UserService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserInfo', () => {
    it('should return user info when user exists', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getUserInfo(mockUser.email);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: mockUser.email,
        },
        select: {
          email: true,
          id: true,
          role: {
            select: {
              name: true,
              id: true,
            },
          },
          institute: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      (prismaService.user.findUnique as jest.Mock).mockRejectedValue(mockError);

      await expect(service.getUserInfo(mockUser.email)).rejects.toThrow(mockError);
    });
  });
});
