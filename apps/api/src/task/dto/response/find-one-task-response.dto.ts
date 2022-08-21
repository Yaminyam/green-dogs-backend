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
  'tasks',
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
    tasks: BaseTaskDto[];
  }) {
    super();

    this.id = config.id;
    this.title = config.title;
    this.content = config.content;
    this.writerId = config.writerId;
    this.writer = config.writer;
    this.parentTaskId = config.parentTaskId;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
    this.isSelf = config.isSelf;
    this.tasks = config.tasks;
  }

  static of(config: { task: Task; parentTask: Task; writer: User; user: User }): FindOneTaskResponseDto {
    const writer = UserResponseDto.of({ user: config.writer });
    console.log('111 : ' + writer);
    const writerId = config.task.writerId;

    return new FindOneTaskResponseDto({
      ...config.task,
      ...config,
      writer,
      writerId,
      isSelf: config.user.id === config.writer.id,
      tasks: config.task.task.map((task) =>
        BaseTaskDto.of({
          task,
        }),
      ),
    });
  }
}
