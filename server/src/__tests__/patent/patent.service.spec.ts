import { Test, TestingModule } from '@nestjs/testing';
import { PatentService } from '../../patent/patent.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PatentSearchService } from '../../patent/patentSearch.service';
import { PdfService } from '../../files/pdf.service';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'node:fs';
import { join } from 'path';

jest.setTimeout(15000);

jest.mock('node:fs');
jest.mock('../../files/pdf.service');
jest.mock('../../patent/patentSearch.service');

describe('PatentService', () => {
  let service: PatentService;
  let prismaService: PrismaService;
  let patentSearchService: PatentSearchService;
  let pdfService: PdfService;

  const mockPrismaService = {
    patent: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockPatentSearchService = {
    indexPatent: jest.fn(),
    searchPatent: jest.fn(),
    deletePatent: jest.fn(),
    updatePatent: jest.fn(),
  };

  const mockPdfService = {
    extractTextFromPdf: jest.fn(),
    extractTextFromPdfWithStructure: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PatentSearchService,
          useValue: mockPatentSearchService,
        },
        {
          provide: PdfService,
          useValue: mockPdfService,
        },
      ],
    }).compile();

    service = module.get<PatentService>(PatentService);
    prismaService = module.get<PrismaService>(PrismaService);
    patentSearchService = module.get<PatentSearchService>(PatentSearchService);
    pdfService = module.get<PdfService>(PdfService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPatent', () => {
    const mockCreatePatentDto = {
      name: 'Test Patent',
      patentNumber: '123456',
      dateOfRegistration: '2024-01-01',
      dateOfExpiration: '2034-01-01',
      contact: 'test@example.com',
      isPrivate: 'false',
      patentTypeId: '1',
      technologyFieldId: '1',
      patentFile: 'test.pdf',
    };

    const mockCreatedPatent = {
      id: 1,
      name: 'Test Patent',
      patentNumber: '123456',
      dateOfRegistration: new Date('2024-01-01'),
      dateOfExpiration: new Date('2034-01-01'),
      contact: 'test@example.com',
      isPrivate: false,
      patentLink: 'test.pdf',
      PatentTypeId: 1,
      TechnologyFieldId: 1,
    };

    it('should create a patent successfully', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('test'));
      mockPdfService.extractTextFromPdfWithStructure.mockResolvedValue('test content');
      mockPrismaService.patent.create.mockResolvedValue(mockCreatedPatent);
      mockPatentSearchService.indexPatent.mockResolvedValue(undefined);

      const result = await service.createPatent(mockCreatePatentDto);

      expect(result).toEqual(mockCreatedPatent);
      expect(mockPrismaService.patent.create).toHaveBeenCalled();
      expect(mockPatentSearchService.indexPatent).toHaveBeenCalled();
    });

    it('should throw BadRequestException if patent creation fails', async () => {
      mockPrismaService.patent.create.mockRejectedValue(new Error());

      await expect(service.createPatent(mockCreatePatentDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('searchPatent', () => {
    const mockSearchResult = {
      hits: [
        { _source: { patentNumber: '123456' } },
        { _source: { patentNumber: '789012' } },
      ],
    };

    const mockPatents = [
      {
        id: 1,
        patentNumber: '123456',
        name: 'Test Patent 1',
        PatentTypeId: 1,
        TechnologyFieldId: 1,
        patentType: { id: 1, name: 'Type 1' },
        technologyField: { id: 1, name: 'Field 1' },
      },
    ];

    it('should search patents with filters', async () => {
      mockPatentSearchService.searchPatent.mockResolvedValue(mockSearchResult);
      mockPrismaService.patent.findMany.mockResolvedValue(mockPatents);

      const result = await service.searchPatent('test', 'desc', '1', '1');

      expect(result).toEqual(mockPatents);
      expect(mockPatentSearchService.searchPatent).toHaveBeenCalledWith('test');
      expect(mockPrismaService.patent.findMany).toHaveBeenCalled();
    });
  });

  describe('getAllPatents', () => {
    const mockPatents = [
      {
        id: 1,
        patentNumber: '123456',
        name: 'Test Patent 1',
        PatentTypeId: 1,
        TechnologyFieldId: 1,
        patentType: { id: 1, name: 'Type 1' },
        technologyField: { id: 1, name: 'Field 1' },
      },
    ];

    it('should get all patents with pagination and filters', async () => {
      mockPrismaService.patent.findMany.mockResolvedValue(mockPatents);
      mockPrismaService.patent.count.mockResolvedValue(10);

      const result = await service.getAllPatents('1', 'desc', '1', '1');

      expect(result).toEqual({
        patents: mockPatents,
        totalPages: 1,
      });
      expect(mockPrismaService.patent.findMany).toHaveBeenCalled();
      expect(mockPrismaService.patent.count).toHaveBeenCalled();
    });
  });

  describe('deletePatent', () => {
    it('should delete a patent', async () => {
      const patentNumber = '123456';
      mockPatentSearchService.deletePatent.mockResolvedValue(undefined);
      mockPrismaService.patent.delete.mockResolvedValue({ id: 1 });

      await service.deletePatent(patentNumber);

      expect(mockPatentSearchService.deletePatent).toHaveBeenCalledWith(patentNumber);
      expect(mockPrismaService.patent.delete).toHaveBeenCalledWith({
        where: { patentNumber },
      });
    });
  });

  describe('editPatent', () => {
    const mockEditPatentDto = {
      name: 'Updated Patent',
      patentNumber: '123456',
      dateOfRegistration: '2024-01-01',
      dateOfExpiration: '2034-01-01',
      contact: 'test@example.com',
      isPrivate: 'false',
      patentTypeId: '1',
      technologyFieldId: '1',
    };

    const mockPatent = {
      id: 1,
      patentNumber: '123456',
    };

    it('should edit a patent', async () => {
      mockPrismaService.patent.findUnique.mockResolvedValue(mockPatent);
      mockPrismaService.patent.update.mockResolvedValue({
        ...mockPatent,
        ...mockEditPatentDto,
      });
      mockPatentSearchService.updatePatent.mockResolvedValue(undefined);

      const result = await service.editPatent(mockEditPatentDto, '1');

      expect(result).toBeDefined();
      expect(mockPrismaService.patent.update).toHaveBeenCalled();
      expect(mockPatentSearchService.updatePatent).toHaveBeenCalledWith(mockEditPatentDto, mockPatent.patentNumber);
    });
  });
}); 