import {Injectable} from '@nestjs/common';
import {MailerService} from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {
  }

  async sendConfirmationCode(email: string, code: string): Promise<void> {
    return await this.mailerService.sendMail({
      to: email,
      from: process.env.SMTP_LOGIN,
      subject: 'Восстановление пароля',
      text: `Код для восстановления пароля: ${code}`,
      html: `<h1>Код для восстановления пароля: ${code}</h1>`,
    });
  }

  async sendAuthConfirmationCode(email: string, code: string): Promise<void> {
    return await this.mailerService.sendMail({
      to: email,
      from: process.env.SMTP_LOGIN,
      subject: 'Подтверждение входа',
      text: `Код для подтверждения входа ${code}`,
      html: `<h1>Код для подтверждения входа ${code}</h1>`,
    });
  }


  async sendExpireNotification(email: string, patents: { patentNumber: string, name: string }[]) {
    let content = ''

    patents.forEach(item => {
      content += `
      <li>
        <h3>Патент номер: ${item.patentNumber}</h3>
        <p>Название патента: ${item.name}</p>
      </li>`
    })

    return await this.mailerService.sendMail({
      to: email,
      from: process.env.SMTP_LOGIN,
      subject: 'Уведомление об истекающих патентах',
      text: `Уведомление об истекающих патентах`,
      html: `<h1>Завтра закончится срок действия следующих патентов</h1>
            <ul>${content}</ul>`,
    });
  }

  async sendRegisterNotification(email: string, link: string) {
    return await this.mailerService.sendMail({
      to: email,
      from: process.env.SMTP_LOGIN,
      subject: 'Регистрация в системе',
      text: `Регистрация в системе`,
      html: `
        <div>
          <h1>Вы были зарегистрированы в системе ЦТТ ЯГТУ</h1>
          <p>Для активации аккаунта и установки пароля перейдите по ссылке: <a href="${link}/reset">${link}/reset</a></p>
        </div>`,
    });

  }
}
