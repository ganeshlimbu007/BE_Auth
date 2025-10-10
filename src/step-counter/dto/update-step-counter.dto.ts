import { PartialType } from '@nestjs/mapped-types';
import { CreateStepCounterDto } from './create-step-counter.dto';

export class UpdateStepCounterDto extends PartialType(CreateStepCounterDto) {}
