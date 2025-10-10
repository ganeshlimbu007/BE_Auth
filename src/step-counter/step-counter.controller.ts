import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StepCounterService } from './step-counter.service';
import { CreateStepCounterDto } from './dto/create-step-counter.dto';
import { UpdateStepCounterDto } from './dto/update-step-counter.dto';

@Controller('step-counter')
export class StepCounterController {
  constructor(private readonly stepCounterService: StepCounterService) {}

  @Post()
  create(@Body() createStepCounterDto: CreateStepCounterDto) {
    return this.stepCounterService.create(createStepCounterDto);
  }

  @Get()
  findAll() {
    return this.stepCounterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stepCounterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStepCounterDto: UpdateStepCounterDto) {
    return this.stepCounterService.update(+id, updateStepCounterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stepCounterService.remove(+id);
  }
}
