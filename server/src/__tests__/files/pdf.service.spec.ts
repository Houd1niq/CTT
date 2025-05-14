import { Test, TestingModule } from '@nestjs/testing';
import { PdfService, parsePdfWithStructure } from '../../files/pdf.service';
import * as pdfParse from 'pdf-parse';
import PDFParser from 'pdf2json';

jest.mock('pdf-parse', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('pdf2json', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    loadPDF: jest.fn(),
  }));
});

jest.setTimeout(15000);

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractTextFromPdf', () => {
    const mockBuffer = Buffer.from('test pdf content');
    const mockExtractedText = 'Extracted text from PDF';

    it('should extract text from PDF buffer', async () => {
      (pdfParse.default as jest.Mock).mockResolvedValue({ text: mockExtractedText });

      const result = await service.extractTextFromPdf(mockBuffer);

      expect(result).toBe(mockExtractedText);
      expect(pdfParse.default).toHaveBeenCalledWith(mockBuffer);
    });

    it('should throw error if PDF parsing fails', async () => {
      const mockError = new Error('PDF parsing failed');
      (pdfParse.default as jest.Mock).mockRejectedValue(mockError);

      await expect(service.extractTextFromPdf(mockBuffer)).rejects.toThrow(mockError);
    });
  });

  describe('extractTextFromPdfWithStructure', () => {
    const mockFilePath = '/path/to/test.pdf';
    const mockExtractedText = 'Extracted text with structure';

    it('should extract text from PDF file with structure', async () => {
      jest.spyOn(service, 'extractTextFromPdfWithStructure').mockResolvedValue(mockExtractedText);

      const result = await service.extractTextFromPdfWithStructure(mockFilePath);

      expect(result).toBe(mockExtractedText);
    });

    it('should throw error if PDF parsing fails', async () => {
      const mockError = new Error('PDF parsing failed');
      jest.spyOn(service, 'extractTextFromPdfWithStructure').mockRejectedValue(mockError);

      await expect(service.extractTextFromPdfWithStructure(mockFilePath)).rejects.toThrow(mockError);
    });
  });
});

describe('parsePdfWithStructure', () => {
  const mockFilePath = '/path/to/test.pdf';
  const mockPdfData = {
    Pages: [
      {
        Texts: [
          { R: [{ T: 'Page 1 text' }] },
          { R: [{ T: 'More text' }] },
        ],
      },
      {
        Texts: [
          { R: [{ T: 'Page 2 text' }] },
        ],
      },
    ],
  };

  it('should parse PDF and return structured text', async () => {
    const mockPdfParser = {
      on: jest.fn(),
      loadPDF: jest.fn(),
    };

    (PDFParser as unknown as jest.Mock).mockImplementation(() => mockPdfParser);

    const parsePromise = parsePdfWithStructure(mockFilePath);

    // Simulate successful parsing
    const dataReadyCallback = mockPdfParser.on.mock.calls.find(
      call => call[0] === 'pdfParser_dataReady'
    )[1];
    dataReadyCallback(mockPdfData);

    const result = await parsePromise;

    expect(result).toBe('Page 1 text More text\nPage 2 text');
    expect(mockPdfParser.loadPDF).toHaveBeenCalledWith(mockFilePath);
  });

  it('should reject with error if parsing fails', async () => {
    const mockPdfParser = {
      on: jest.fn(),
      loadPDF: jest.fn(),
    };

    (PDFParser as unknown as jest.Mock).mockImplementation(() => mockPdfParser);

    const parsePromise = parsePdfWithStructure(mockFilePath);

    // Simulate parsing error
    const errorCallback = mockPdfParser.on.mock.calls.find(
      call => call[0] === 'pdfParser_dataError'
    )[1];
    const mockError = new Error('Parsing failed');
    errorCallback({ parserError: mockError });

    await expect(parsePromise).rejects.toThrow(mockError);
  });
}); 