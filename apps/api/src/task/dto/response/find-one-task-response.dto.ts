import { BaseTaskDto } from '@api/task/dto/base-task.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { Task } from '@app/entity/task/task.entity';
import { User } from '@app/entity/user/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { TaskResponseDto } from './task-response.dto';

export class FindOneTaskResponseDto extends PickType(BaseTaskDto, [
  'id',
  'title',
  'content',
  'parentTaskId',
  'writerId',
  'writer',
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty({ example: false })
  isSelf!: boolean;

  constructor(config: {
    id: number;
    title: string;
    content: string;
    parentTaskId: number;
    parentTask: TaskResponseDto;
    writerId: number;
    writer: UserResponseDto;
    createdAt: Date;
    updatedAt: Date;
    isSelf: boolean;
  }) {
    super();

    this.id = config.id;
    this.title = config.title;
    this.content = config.content;
    this.writerId = config.writerId;
    this.writer = config.writer;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
    this.isSelf = config.isSelf;
  }

  static of(config: { task: Task; parentTask: Task; writer: User; user: User }): FindOneTaskResponseDto {
    const parentTask = TaskResponseDto.of({
      task: config.parentTask,
      parentTask: config.parentTask.parentTask,
      user: config.user,
      writer: config.writer,
    });
    const writer = UserResponseDto.of({ user: config.writer });
    const writerId = config.task.writerId;

    return new FindOneTaskResponseDto({
      ...config.task,
      ...config,
      parentTask,
      writer,
      writerId,
      isSelf: config.user.id === config.writer.id,
    });
  }
}
