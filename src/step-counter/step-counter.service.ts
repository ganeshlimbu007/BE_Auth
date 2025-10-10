import { Injectable } from '@nestjs/common';
import { CreateStepCounterDto } from './dto/create-step-counter.dto';
import { UpdateStepCounterDto } from './dto/update-step-counter.dto';

@Injectable()
export class StepCounterService {
  create(createStepCounterDto: CreateStepCounterDto) {
    return 'This action adds a new stepCounter';
  }

  findAll() {
    return `This action returns all stepCounter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stepCounter`;
  }

  update(id: number, updateStepCounterDto: UpdateStepCounterDto) {
    return `This action updates a #${id} stepCounter`;
  }

  remove(id: number) {
    return `This action removes a #${id} stepCounter`;
  }
}
