import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  private async retryConnect(maxRetries = 5, delay = 5000): Promise<void> {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        console.log(`Attempting to connect to the database... (Attempt ${retries + 1}/${maxRetries})`);
        await this.$connect();
        console.log('Database connected successfully!');
        break;
      } catch (error) {
        retries++;
        console.error(`Database connection failed. Retrying in ${delay / 1000}s...`, error);

        if (retries >= maxRetries) {
          console.error('Max retries reached. Unable to connect to the database.');
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async onModuleInit() {
    await this.retryConnect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
