import { Test, TestingModule } from '@nestjs/testing';
import { StepCounterService } from './step-counter.service';

describe('StepCounterService', () => {
  let service: StepCounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StepCounterService],
    }).compile();

    service = module.get<StepCounterService>(StepCounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
