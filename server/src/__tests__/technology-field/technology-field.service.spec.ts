import { Test, TestingModule } from '@nestjs/testing';
import { TechnologyFieldService } from '../../technology-field/technology-field.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

jest.setTimeout(15000);

describe('TechnologyFieldService', () => {
  let service: TechnologyFieldService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    technologyField: {
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
        TechnologyFieldService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TechnologyFieldService>(TechnologyFieldService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTechnologyField', () => {
    const mockCreateDto = {
      name: 'Test Technology Field',
    };

    const mockCreatedTechnologyField = {
      id: 1,
      name: 'Test Technology Field',
    };

    it('should create a technology field', async () => {
      mockPrismaService.technologyField.create.mockResolvedValue(mockCreatedTechnologyField);

      const result = await service.createTechnologyField(mockCreateDto);

      expect(result).toEqual(mockCreatedTechnologyField);
      expect(mockPrismaService.technologyField.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateDto.name,
        },
      });
    });
  });

  describe('getAllTechnologyFields', () => {
    const mockTechnologyFields = [
      { id: 1, name: 'Field 1' },
      { id: 2, name: 'Field 2' },
    ];

    it('should return all technology fields', async () => {
      mockPrismaService.technologyField.findMany.mockResolvedValue(mockTechnologyFields);

      const result = await service.getAllTechnologyFields();

      expect(result).toEqual(mockTechnologyFields);
      expect(mockPrismaService.technologyField.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
        },
      });
    });
  });

  describe('getDeletableTechnologyFields', () => {
    const mockDeletableFields = [
      { id: 1, name: 'Field 1' },
      { id: 2, name: 'Field 2' },
    ];

    it('should return technology fields that are not used in any patents', async () => {
      mockPrismaService.technologyField.findMany.mockResolvedValue(mockDeletableFields);

      const result = await service.getDeletableTechnologyFields();

      expect(result).toEqual(mockDeletableFields);
      expect(mockPrismaService.technologyField.findMany).toHaveBeenCalledWith({
        where: {
          Patent: {
            none: {},
          },
        },
      });
    });
  });

  describe('deleteTechnologyField', () => {
    const mockTechnologyField = {
      id: 1,
      name: 'Test Field',
      Patent: [],
    };

    it('should delete technology field if it is not used in any patents', async () => {
      mockPrismaService.technologyField.findUnique.mockResolvedValue(mockTechnologyField);
      mockPrismaService.technologyField.delete.mockResolvedValue(mockTechnologyField);

      const result = await service.deleteTechnologyField('1');

      expect(result).toEqual(mockTechnologyField);
      expect(mockPrismaService.technologyField.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });

    it('should throw BadRequestException if technology field is used in patents', async () => {
      mockPrismaService.technologyField.findUnique.mockResolvedValue({
        ...mockTechnologyField,
        Patent: [{ id: 1 }],
      });

      await expect(service.deleteTechnologyField('1')).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.technologyField.delete).not.toHaveBeenCalled();
    });
  });

  describe('editTechnologyField', () => {
    const mockUpdatedTechnologyField = {
      id: 1,
      name: 'Updated Field',
    };

    it('should update technology field name', async () => {
      mockPrismaService.technologyField.update.mockResolvedValue(mockUpdatedTechnologyField);

      const result = await service.editTechnologyField('1', 'Updated Field');

      expect(result).toEqual(mockUpdatedTechnologyField);
      expect(mockPrismaService.technologyField.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          name: 'Updated Field',
        },
      });
    });
  });
}); 