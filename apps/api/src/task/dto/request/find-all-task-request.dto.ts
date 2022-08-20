import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseTaskDto } from '../base-task.dto';

const _PickedBaseTask = PickType(BaseTaskDto, ['parentTaskId']);

export class FindAllTaskRequestDto extends IntersectionType(_PickedBaseTask, PaginationRequestDto) {
  @Type(() => Number)
  readonly parentTaskId: number;
}
