import { BaseTaskDto } from '@api/task/dto/base-task.dto';
import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { Task } from '@app/entity/task/task.entity';
import { User } from '@app/entity/user/user.entity';
import { PickType } from '@nestjs/swagger';

export class TaskResponseDto extends PickType(BaseTaskDto, [
  'id',
  'title',
  'content',
  'parentTaskId',
  'writerId',
  'writer',
  'createdAt',
  'updatedAt',
  'assigneeId',
]) {
  constructor(config: {
    id: number;
    title: string;
    content: string;
    parentTaskId: number | null;
    parentTask: TaskResponseDto | null;
    writerId: number;
    writer: UserResponseDto;
    createdAt: Date;
    updatedAt: Date;
    assigneeId: string;
  }) {
    super();

    this.id = config.id;
    this.title = config.title;
    this.content = config.content;
    this.parentTaskId = config.parentTaskId;
    //this.parentTask = config.parentTask;
    this.writerId = config.writerId;
    this.writer = config.writer;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
    this.assigneeId = config.assigneeId;
  }

  static of(config: { task: Task; parentTask: Task; writer: User }): TaskResponseDto {
    const writer = UserResponseDto.of({ user: config.writer });
    const writerId = config.task.writerId;

    return new TaskResponseDto({
      ...config.task,
      ...config,
      writer,
      writerId,
    });
  }

  static ofArray(config: { tasks: Task[] }): TaskResponseDto[] {
    return config.tasks.map((task) =>
      TaskResponseDto.of({
        task,
        parentTask: task.parentTask,
        writer: task.writer,
      }),
    );
  }
}
