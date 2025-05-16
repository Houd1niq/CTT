import {Test, TestingModule} from '@nestjs/testing';
import {PatentSearchService} from '../../patent/patentSearch.service';
import {ElasticsearchService} from '@nestjs/elasticsearch';
import {CreatePatentDto, EditPatentDto} from '../../patent/dto/patent.dto';
import {TEST_INDICES} from "../../test/const";

jest.setTimeout(15000); // Увеличиваем таймаут до 15 секунд

describe('PatentSearchService', () => {
  let service: PatentSearchService;
  let elasticsearchService: ElasticsearchService;

  const mockElasticsearchService = {
    indices: {
      exists: jest.fn(),
      create: jest.fn(),
    },
    search: jest.fn(),
    bulk: jest.fn(),
    deleteByQuery: jest.fn(),
    index: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatentSearchService,
        {
          provide: ElasticsearchService,
          useValue: mockElasticsearchService,
        },
      ],
    }).compile();

    service = module.get<PatentSearchService>(PatentSearchService);
    elasticsearchService = module.get<ElasticsearchService>(ElasticsearchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeIndex', () => {
    it('should create new index if it does not exist', async () => {
      mockElasticsearchService.indices.exists.mockResolvedValue(false);

      await service['initializeIndex']();

      expect(mockElasticsearchService.indices.create).toHaveBeenCalledWith({
        index: TEST_INDICES.PATENTS,
        body: {
          mappings: {
            properties: {
              patentNumber: {type: 'keyword'},
              name: {type: 'text', analyzer: 'russian'},
              pdfContent: {type: 'text', analyzer: 'russian'},
            },
          },
        },
      });
    });

    it('should migrate data if old index exists', async () => {
      mockElasticsearchService.indices.exists
        .mockResolvedValueOnce(false) // new index
        .mockResolvedValueOnce(true); // old index

      const mockSearchResponse = {
        hits: {
          hits: [
            {
              _id: '1',
              _source: {
                patentNumber: '123456',
                name: 'Test Patent',
              },
            },
          ],
        },
      };

      mockElasticsearchService.search.mockResolvedValue(mockSearchResponse);
      mockElasticsearchService.bulk.mockResolvedValue({});

      await service['initializeIndex']();

      expect(mockElasticsearchService.bulk).toHaveBeenCalled();
    });
  });

  describe('deletePatent', () => {
    it('should delete patent by number', async () => {
      const patentNumber = '123456';
      mockElasticsearchService.deleteByQuery.mockResolvedValue({});

      await service.deletePatent(patentNumber);

      expect(mockElasticsearchService.deleteByQuery).toHaveBeenCalledWith({
        index: TEST_INDICES.PATENTS,
        body: {
          query: {
            match: {
              patentNumber: patentNumber,
            },
          },
        },
      });
    });
  });

  describe('updatePatent', () => {
    const mockPatent: EditPatentDto = {
      patentNumber: '123456',
      name: 'Updated Patent',
      dateOfRegistration: '2024-01-01',
      dateOfExpiration: '2034-01-01',
      contact: 'test@example.com',
      isPrivate: 'false',
      patentTypeId: '1',
      technologyFieldId: '1',
      instituteId: '1',
    };

    it('should update patent', async () => {
      mockElasticsearchService.deleteByQuery.mockResolvedValue({});
      mockElasticsearchService.index.mockResolvedValue({});

      await service.updatePatent(mockPatent, 'old123456');

      expect(mockElasticsearchService.deleteByQuery).toHaveBeenCalled();
      expect(mockElasticsearchService.index).toHaveBeenCalled();
    });
  });

  describe('indexPatent', () => {
    const mockPatent: CreatePatentDto = {
      patentNumber: '123456',
      name: 'Test Patent',
      dateOfRegistration: '2024-01-01',
      dateOfExpiration: '2034-01-01',
      contact: 'test@example.com',
      isPrivate: 'false',
      patentTypeId: '1',
      technologyFieldId: '1',
      instituteId: '1',
      patentFile: 'test.pdf',
    };

    it('should index patent with PDF content', async () => {
      const pdfContent = 'test content';
      mockElasticsearchService.index.mockResolvedValue({});

      await service.indexPatent(mockPatent, pdfContent);

      expect(mockElasticsearchService.index).toHaveBeenCalledWith({
        index: TEST_INDICES.PATENTS,
        body: {
          patentNumber: mockPatent.patentNumber,
          name: mockPatent.name,
          pdfContent,
        },
      });
    });

    it('should index patent without PDF content', async () => {
      mockElasticsearchService.index.mockResolvedValue({});

      await service.indexPatent(mockPatent);

      expect(mockElasticsearchService.index).toHaveBeenCalledWith({
        index: TEST_INDICES.PATENTS,
        body: {
          patentNumber: mockPatent.patentNumber,
          name: mockPatent.name,
          pdfContent: undefined,
        },
      });
    });
  });

  describe('searchPatent', () => {
    it('should throw error for invalid query', async () => {
      await expect(service.searchPatent('')).rejects.toThrow('Invalid search query');
      await expect(service.searchPatent(null)).rejects.toThrow('Invalid search query');
    });

    it('should search patents with default options', async () => {
      const mockResponse = {
        hits: {
          total: {value: 1},
          hits: [
            {
              _id: '1',
              _score: 1,
              _source: {
                patentNumber: '123456',
                name: 'Test Patent',
              },
            },
          ],
        },
      };

      mockElasticsearchService.search.mockResolvedValue(mockResponse);

      const result = await service.searchPatent('test');

      expect(result).toBeDefined();
      expect(mockElasticsearchService.search).toHaveBeenCalledWith({
        index: TEST_INDICES.PATENTS,
        from: 0,
        size: 20,
        body: expect.any(Object),
      });
    });

    it('should search patents with custom options', async () => {
      const mockResponse = {
        hits: {
          total: {value: 1},
          hits: [
            {
              _id: '1',
              _score: 1,
              _source: {
                patentNumber: '123456',
                name: 'Test Patent',
              },
            },
          ],
        },
      };

      mockElasticsearchService.search.mockResolvedValue(mockResponse);

      const result = await service.searchPatent('test', {
        page: 2,
        limit: 10,
        sortField: 'name',
        sortOrder: 'desc',
      });

      expect(result).toBeDefined();
      expect(mockElasticsearchService.search).toHaveBeenCalledWith({
        index: TEST_INDICES.PATENTS,
        from: 10,
        size: 10,
        body: expect.any(Object),
      });
    });
  });
});
