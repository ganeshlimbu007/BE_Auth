import { Module } from '@nestjs/common';
import { StepCounterService } from './step-counter.service';
import { StepCounterController } from './step-counter.controller';

@Module({
  controllers: [StepCounterController],
  providers: [StepCounterService],
})
export class StepCounterModule {}
