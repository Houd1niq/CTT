import { Test, TestingModule } from '@nestjs/testing';
import { PatentTypeService } from '../../patent-type/patent-type.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

jest.setTimeout(15000);

describe('PatentTypeService', () => {
  let service: PatentTypeService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    patentType: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatentTypeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PatentTypeService>(PatentTypeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPatentType', () => {
    const mockCreateDto = {
      name: 'Test Patent Type',
    };

    const mockCreatedPatentType = {
      id: 1,
      name: 'Test Patent Type',
    };

    it('should create a patent type', async () => {
      mockPrismaService.patentType.create.mockResolvedValue(mockCreatedPatentType);

      const result = await service.createPatentType(mockCreateDto);

      expect(result).toEqual(mockCreatedPatentType);
      expect(mockPrismaService.patentType.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateDto.name,
        },
      });
    });
  });

  describe('getAllPatentTypes', () => {
    const mockPatentTypes = [
      { id: 1, name: 'Type 1' },
      { id: 2, name: 'Type 2' },
    ];

    it('should return all patent types', async () => {
      mockPrismaService.patentType.findMany.mockResolvedValue(mockPatentTypes);

      const result = await service.getAllPatentTypes();

      expect(result).toEqual(mockPatentTypes);
      expect(mockPrismaService.patentType.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
        },
      });
    });
  });

  describe('getDeletablePatentTypes', () => {
    const mockDeletableTypes = [
      { id: 1, name: 'Type 1' },
      { id: 2, name: 'Type 2' },
    ];

    it('should return patent types that are not used in any patents', async () => {
      mockPrismaService.patentType.findMany.mockResolvedValue(mockDeletableTypes);

      const result = await service.getDeletablePatentTypes();

      expect(result).toEqual(mockDeletableTypes);
      expect(mockPrismaService.patentType.findMany).toHaveBeenCalledWith({
        where: {
          Patent: {
            none: {},
          },
        },
      });
    });
  });

  describe('deletePatentType', () => {
    const mockPatentType = {
      id: 1,
      name: 'Test Type',
      Patent: [],
    };

    it('should delete patent type if it is not used in any patents', async () => {
      mockPrismaService.patentType.findUnique.mockResolvedValue(mockPatentType);
      mockPrismaService.patentType.delete.mockResolvedValue(mockPatentType);

      const result = await service.deletePatentType('1');

      expect(result).toEqual(mockPatentType);
      expect(mockPrismaService.patentType.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });

    it('should throw BadRequestException if patent type is used in patents', async () => {
      mockPrismaService.patentType.findUnique.mockResolvedValue({
        ...mockPatentType,
        Patent: [{ id: 1 }],
      });

      await expect(service.deletePatentType('1')).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.patentType.delete).not.toHaveBeenCalled();
    });
  });

  describe('editPatentType', () => {
    const mockUpdatedPatentType = {
      id: 1,
      name: 'Updated Type',
    };

    it('should update patent type name', async () => {
      mockPrismaService.patentType.update.mockResolvedValue(mockUpdatedPatentType);

      const result = await service.editPatentType('1', 'Updated Type');

      expect(result).toEqual(mockUpdatedPatentType);
      expect(mockPrismaService.patentType.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          name: 'Updated Type',
        },
      });
    });
  });
}); 