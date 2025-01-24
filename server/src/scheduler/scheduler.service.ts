import {Injectable, OnModuleInit} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import * as cron from 'node-cron';
import {EmailService} from "../email/email.service";

@Injectable()
export class SchedulerService implements OnModuleInit {
  constructor(private prisma: PrismaService, private emailService: EmailService) {
  }

  onModuleInit() {
    this.scheduleDailyEmail();
  }

  scheduleDailyEmail() {
    const task = cron.schedule('0 12 * * *', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
      const startOfNextDay = new Date(startOfTomorrow);
      startOfNextDay.setDate(startOfTomorrow.getDate() + 1);

      const admins = await this.prisma.admin.findMany()

      const patents = await this.prisma.patent.findMany({
        where: {
          dateOfExpiration: {
            gte: startOfTomorrow,
            lt: startOfNextDay,
          }
        },
        select: {
          patentNumber: true,
          name: true
        }
      })

      if (!patents.length) return

      admins.forEach(admin => {
        this.emailService.sendExpireNotification(admin.email, patents)
      })
    });

    task.start();

  }
}
