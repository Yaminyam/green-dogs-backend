import { BaseTaskDto } from '@api/task/dto/base-task.dto';
import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateTaskRequestDto extends PickType(PartialType(BaseTaskDto), ['title', 'content', 'parentTaskId']) {
  @IsOptional()
  @ApiPropertyOptional({ example: '수정된 제목 입니다.' })
  readonly title?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: '수정된 내용 입니다.' })
  readonly content?: string;
}
