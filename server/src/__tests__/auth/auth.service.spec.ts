import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from '../../auth/auth.service';
import {PrismaService} from '../../prisma/prisma.service';
import {JwtService} from '@nestjs/jwt';
import {ForbiddenException} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import '@jest/globals';
import {EmailService} from '../../email/email.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.setTimeout(15000);

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let emailService: EmailService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockEmailService = {
    sendAuthConfirmationCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  beforeEach(() => {
    mockJwtService.signAsync
      .mockResolvedValueOnce('newRefreshToken')
      .mockResolvedValueOnce('newAccessToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    const mockAuthDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      hash: 'hashedPassword',
    };

    it('should throw ForbiddenException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.signIn(mockAuthDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(mockAuthDto)).rejects.toThrow(ForbiddenException);
    });

    it('should return true on successful sign in', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrismaService.user.update.mockResolvedValue({});
      mockEmailService.sendAuthConfirmationCode.mockResolvedValue(undefined);

      const result = await service.signIn(mockAuthDto);

      expect(result).toBe(true);
      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(mockEmailService.sendAuthConfirmationCode).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear refresh token hash', async () => {
      const email = 'test@example.com';
      mockPrismaService.user.update.mockResolvedValue({});

      await service.logout(email);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: {email},
        data: {hashedRt: null},
      });
    });
  });

  describe('refresh', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      hashedRt: 'hashedRefreshToken',
    };

    it('should throw ForbiddenException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.refresh(1, 'test@example.com', 'refreshToken')).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if refresh token is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.refresh(1, 'test@example.com', 'refreshToken')).rejects.toThrow(ForbiddenException);
    });

    it('should return new tokens on successful refresh', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.refresh(1, 'test@example.com', 'refreshToken');

      expect(result).toEqual({
        refresh_token: 'newRefreshToken',
        access_token: 'newAccessToken',
      });
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('getTokens', () => {
    it('should return access and refresh tokens', async () => {
      const result = await service.getTokens(1, 'test@example.com');

      expect(result).toEqual({
        refresh_token: 'newRefreshToken',
        access_token: 'newAccessToken',
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });
});
