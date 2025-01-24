import {Module} from '@nestjs/common';
import {SchedulerService} from './scheduler.service';
import {EmailService} from "../email/email.service";

@Module({
  providers: [SchedulerService, EmailService]
})
export class SchedulerModule {
}
