import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StepCounterService } from './step-counter.service';
import { CreateStepCounterDto } from './dto/create-step-counter.dto';
import { UpdateStepCounterDto } from './dto/update-step-counter.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserInterface } from 'src/iam/interfaces/active-user.interface';
/* import { ROLES } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from 'src/users/enums/user-role.enum'; */
/* import { PERMISSIONS } from 'src/iam/authorization/decorators/permission.decorator';
import { StepCounterPermission } from './step-counter.type'; */
import { Policies } from 'src/iam/authorization/decorators/policy.decorator';
import { FrameworkContributorPolicy } from 'src/iam/policies/framework-contributer.policy';

@Controller('step-counter')
export class StepCounterController {
  constructor(private readonly stepCounterService: StepCounterService) {}

  @Post()
  create(@Body() createStepCounterDto: CreateStepCounterDto) {
    return this.stepCounterService.create(createStepCounterDto);
  }

  // @ROLES(Role.ADMIN)
  // @PERMISSIONS(StepCounterPermission.CREATE_STEP_COUNTER)
  @Policies(new FrameworkContributorPolicy())
  @Get()
  findAll(@ActiveUser() user: ActiveUserInterface) {
    console.log('hello user', user);
    return this.stepCounterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stepCounterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStepCounterDto: UpdateStepCounterDto,
  ) {
    return this.stepCounterService.update(+id, updateStepCounterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stepCounterService.remove(+id);
  }
}
