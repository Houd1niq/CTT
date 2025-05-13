import {Injectable} from '@nestjs/common';
import pdfParse from 'pdf-parse';
import PDFParser from 'pdf2json';

@Injectable()
export class PdfService {
  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      // console.log(buffer)
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  }

  async extractTextFromPdfWithStructure(filePath: string): Promise<string> {
    try {
      console.log(filePath)
      return await parsePdfWithStructure(filePath);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  }
}

export async function parsePdfWithStructure(filePath: string): Promise<string> {
  const pdfParser = new PDFParser();

  return new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', err => reject(err.parserError));

    pdfParser.on('pdfParser_dataReady', pdfData => {
      console.log(pdfData)
      const pages = pdfData.Pages;

      console.log('pages', pages)

      // Пример: собрать текст всех страниц с позиционированием
      const fullText = pages.map(page => {
        const texts = page.Texts.map(textObj => {
          return decodeURIComponent(textObj.R[0].T);
        });

        return texts.join(' ');
      }).join('\n');

      resolve(fullText);
    });

    pdfParser.loadPDF(filePath);
  });
}
