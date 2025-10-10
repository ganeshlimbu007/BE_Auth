import { Test, TestingModule } from '@nestjs/testing';
import { StepCounterController } from './step-counter.controller';
import { StepCounterService } from './step-counter.service';

describe('StepCounterController', () => {
  let controller: StepCounterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StepCounterController],
      providers: [StepCounterService],
    }).compile();

    controller = module.get<StepCounterController>(StepCounterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
