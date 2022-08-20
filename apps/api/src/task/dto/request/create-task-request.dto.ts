import { BaseTaskDto } from '@api/task/dto/base-task.dto';
import { PickType } from '@nestjs/swagger';

export class CreateTaskRequestDto extends PickType(BaseTaskDto, ['title', 'content', 'parentTaskId']) {}
