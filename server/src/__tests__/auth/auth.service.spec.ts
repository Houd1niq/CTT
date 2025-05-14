import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import '@jest/globals';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.setTimeout(15000);

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    admin: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    const mockAuthDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockAdmin = {
      id: 1,
      email: 'test@example.com',
      hash: 'hashedPassword',
    };

    it('should throw ForbiddenException if user not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(service.signIn(mockAuthDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if password is incorrect', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(mockAuthDto)).rejects.toThrow(ForbiddenException);
    });

    it('should return tokens on successful sign in', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValueOnce('refreshToken');
      mockJwtService.signAsync.mockResolvedValueOnce('accessToken');
      mockPrismaService.admin.update.mockResolvedValue({});

      const result = await service.signIn(mockAuthDto);

      expect(result).toEqual({
        refresh_token: 'refreshToken',
        access_token: 'accessToken',
      });
      expect(mockPrismaService.admin.update).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear refresh token hash', async () => {
      const email = 'test@example.com';
      mockPrismaService.admin.update.mockResolvedValue({});

      await service.logout(email);

      expect(mockPrismaService.admin.update).toHaveBeenCalledWith({
        where: { email },
        data: { hashedRt: null },
      });
    });
  });

  describe('refresh', () => {
    const mockAdmin = {
      id: 1,
      email: 'test@example.com',
      hashedRt: 'hashedRefreshToken',
    };

    it('should throw ForbiddenException if user not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(service.refresh(1, 'test@example.com', 'refreshToken')).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if refresh token is invalid', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.refresh(1, 'test@example.com', 'refreshToken')).rejects.toThrow(ForbiddenException);
    });

    it('should return new tokens on successful refresh', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValueOnce('newRefreshToken');
      mockJwtService.signAsync.mockResolvedValueOnce('newAccessToken');
      mockPrismaService.admin.update.mockResolvedValue({});

      const result = await service.refresh(1, 'test@example.com', 'refreshToken');

      expect(result).toEqual({
        refresh_token: 'newRefreshToken',
        access_token: 'newAccessToken',
      });
      expect(mockPrismaService.admin.update).toHaveBeenCalled();
    });
  });

  describe('getTokens', () => {
    it('should return access and refresh tokens', async () => {
      mockJwtService.signAsync.mockResolvedValueOnce('refreshToken');
      mockJwtService.signAsync.mockResolvedValueOnce('accessToken');

      const result = await service.getTokens(1, 'test@example.com');

      expect(result).toEqual({
        refresh_token: 'refreshToken',
        access_token: 'accessToken',
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    });
  });
}); 