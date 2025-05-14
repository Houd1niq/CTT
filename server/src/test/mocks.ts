import { MailerService } from '@nestjs-modules/mailer';

// Мок для MailerService
export const mockMailerService = {
  sendMail: jest.fn().mockImplementation(async (options) => {
    return Promise.resolve({
      messageId: 'test-message-id',
      ...options,
    });
  }),
};

// Мок для JWT сервиса
export const mockJwtService = {
  sign: jest.fn().mockImplementation((payload) => 'mock-token'),
  verify: jest.fn().mockImplementation((token) => ({ id: 1, email: 'test@test.com' })),
};

// Мок для конфигурации
export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      'AT_SECRET': 'test-at-secret',
      'RT_SECRET': 'test-rt-secret',
      'SMTP_LOGIN': 'test@test.com',
      'SMTP_PASS': 'test-password',
    };
    return config[key];
  }),
}; 