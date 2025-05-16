import {Test, TestingModule} from '@nestjs/testing';
import {EmailService} from '../../email/email.service';
import {MailerService} from '@nestjs-modules/mailer';

jest.setTimeout(15000);

describe('EmailService', () => {
  let service: EmailService;
  let mailerService: jest.Mocked<MailerService>;

  beforeEach(async () => {
    const mockMailerService = {
      sendMail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    mailerService = module.get(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendConfirmationCode', () => {
    const mockEmail = 'test@example.com';
    const mockCode = '123456';

    it('should send confirmation code email', async () => {
      await service.sendConfirmationCode(mockEmail, mockCode);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: mockEmail,
        from: process.env.SMTP_LOGIN,
        subject: 'Восстановление пароля',
        text: `Код для восстановления пароля: ${mockCode}`,
        html: `<h1>Код для восстановления пароля: ${mockCode}</h1>`,
      });
    });

    it('should throw error if email sending fails', async () => {
      const mockError = new Error('Failed to send email');
      mailerService.sendMail.mockRejectedValueOnce(mockError);

      await expect(service.sendConfirmationCode(mockEmail, mockCode)).rejects.toThrow(mockError);
    });
  });

  describe('sendExpireNotification', () => {
    const mockEmail = 'test@example.com';
    const mockPatents = [
      {patentNumber: '123456', name: 'Test Patent 1'},
      {patentNumber: '789012', name: 'Test Patent 2'},
    ];

    it('should send expire notification email', async () => {
      await service.sendExpireNotification(mockEmail, mockPatents);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: mockEmail,
        from: process.env.SMTP_LOGIN,
        subject: 'Уведомление об истекающих патентах',
        text: 'Уведомление об истекающих патентах',
        html: expect.stringContaining('<h1>Завтра закончится срок действия следующих патентов</h1>'),
      });

      // Проверяем, что HTML содержит информацию о каждом патенте
      const callArgs = mailerService.sendMail.mock.calls[0][0];
      mockPatents.forEach(patent => {
        expect(callArgs.html).toContain(`Патент номер: ${patent.patentNumber}`);
        expect(callArgs.html).toContain(`Название патента: ${patent.name}`);
      });
    });

    it('should handle empty patents list', async () => {
      await service.sendExpireNotification(mockEmail, []);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: mockEmail,
        from: process.env.SMTP_LOGIN,
        subject: 'Уведомление об истекающих патентах',
        text: 'Уведомление об истекающих патентах',
        html: expect.stringContaining('<h1>Завтра закончится срок действия следующих патентов</h1>'),
      });

      const callArgs = mailerService.sendMail.mock.calls[0][0];
      expect(callArgs.html).toContain('<ul></ul>');
    });

    it('should throw error if email sending fails', async () => {
      const mockError = new Error('Failed to send email');
      mailerService.sendMail.mockRejectedValueOnce(mockError);

      await expect(service.sendExpireNotification(mockEmail, mockPatents)).rejects.toThrow(mockError);
    });
  });
});
