import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {
  Paragraph,
  TableCell,
  TableRow,
  WidthType,
  Document,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  Header, Footer, Packer
} from "docx";

@Injectable()
export class PatentReportService {

  constructor(
    private prismaService: PrismaService,
  ) {
  }

  async generatePatentReport() {
    const patents = await this.prismaService.patent.findMany({
      include: {
        institute: true,
        patentType: true,
        technologyField: true,
      },
    });

    const tableRows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph('№')],
            width: {size: 5, type: WidthType.PERCENTAGE}
          }),
          new TableCell({
            children: [new Paragraph('Номер патента')],
            width: {size: 10, type: WidthType.PERCENTAGE}
          }),
          new TableCell({
            children: [new Paragraph('Название')],
            width: {size: 15, type: WidthType.PERCENTAGE}
          }),
          new TableCell({
            children: [new Paragraph('Дата регистрации')],
            width: {size: 15, type: WidthType.PERCENTAGE}
          }),
          new TableCell({
            children: [new Paragraph('Дата истечения')],
            width: {size: 15, type: WidthType.PERCENTAGE}
          }),
          new TableCell({
            children: [new Paragraph('Институт')],
            width: {size: 10, type: WidthType.PERCENTAGE}
          }),
          new TableCell({
            children: [new Paragraph('Вид патента')],
            width: {size: 10, type: WidthType.PERCENTAGE}
          }),
          new TableCell({
            children: [new Paragraph('Область техники')],
            width: {size: 10, type: WidthType.PERCENTAGE}
          }),
          new TableCell({
            children: [new Paragraph('Контакт')],
            width: {size: 10, type: WidthType.PERCENTAGE}
          }),
        ],
      }),
      ...patents.map((patent, index) =>
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph((index + 1).toString())],
              width: {size: 5, type: WidthType.PERCENTAGE}
            }),
            new TableCell({
              children: [new Paragraph(patent.patentNumber)],
              width: {size: 10, type: WidthType.PERCENTAGE}
            }),
            new TableCell({
              children: [new Paragraph(patent.name)],
              width: {size: 15, type: WidthType.PERCENTAGE}
            }),
            new TableCell({
              children: [new Paragraph(patent.dateOfRegistration.toLocaleDateString())],
              width: {size: 15, type: WidthType.PERCENTAGE}
            }),
            new TableCell({
              children: [new Paragraph(patent.dateOfExpiration.toLocaleDateString())],
              width: {size: 15, type: WidthType.PERCENTAGE}
            }),
            new TableCell({
              children: [new Paragraph(patent.institute.name)],
              width: {size: 10, type: WidthType.PERCENTAGE}
            }),
            new TableCell({
              children: [new Paragraph(patent.patentType.name)],
              width: {size: 10, type: WidthType.PERCENTAGE}
            }),
            new TableCell({
              children: [new Paragraph(patent.technologyField.name)],
              width: {size: 10, type: WidthType.PERCENTAGE}
            }),
            new TableCell({
              children: [new Paragraph(patent.contact)],
              width: {size: 10, type: WidthType.PERCENTAGE}
            }),
          ],
        })
      ),
    ];

    const doc = new Document({
      sections: [
        {
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Центр трансфера технологий ЯГТУ',
                      bold: true,
                      size: 28,
                    })
                  ]
                })
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: 'Сгенерировано системой ЦТТ ЯГТУ — ' + new Date().toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      }),
                      size: 20,
                      italics: true,
                    }),
                  ],
                })
              ]
            }),
          },
          children: [
            new Paragraph({
              text: 'Отчет по патентам',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: {after: 300},
            }),
            new Paragraph({
              text: `Количество патентов: ${patents.length}`,
              alignment: AlignmentType.RIGHT,
              spacing: {after: 200},
            }),
            new Table({
              width: {size: 100, type: WidthType.PERCENTAGE},
              rows: tableRows,
            }),
          ],
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }
}
