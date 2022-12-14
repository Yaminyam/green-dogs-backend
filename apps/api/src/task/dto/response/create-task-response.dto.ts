import { BaseTaskDto } from '@api/task/dto/base-task.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { Task } from '@app/entity/task/task.entity';
import { User } from '@app/entity/user/user.entity';
import { PickType } from '@nestjs/swagger';

export class CreateTaskResponseDto extends PickType(BaseTaskDto, [
  'id',
  'title',
  'content',
  'parentTaskId',
  'writerId',
  'writer',
  'createdAt',
  'updatedAt',
]) {
  constructor(config: {
    id: number;
    title: string;
    content: string;
    parentTaskId: number | null;
    parentTask: Task | null;
    writerId: number;
    writer: UserResponseDto;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super();

    this.id = config.id;
    this.title = config.title;
    this.content = config.content;
    this.parentTaskId = config.parentTaskId;
    // this.parentTask = config.parentTask;
    this.writerId = config.writerId;
    this.writer = config.writer;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
  }

  static of(config: { task: Task; parentTask: Task; writer: User }): CreateTaskResponseDto {
    return new CreateTaskResponseDto({
      ...config.task,
      ...config,
      parentTask: config.parentTask,
      writer: UserResponseDto.of({ user: config.writer }),
    });
  }
}
