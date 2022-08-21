import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { Task } from '@app/entity/task/task.entity';
import { User } from '@app/entity/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class BaseTaskDto {
  @ApiProperty()
  id!: number;

  @IsString()
  @MaxLength(42)
  @IsNotEmpty()
  @ApiProperty({ example: '제목 입니다.' })
  title!: string;

  @IsString()
  @MaxLength(4242)
  @IsNotEmpty()
  @ApiProperty({ example: '내용 입니다.' })
  content!: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  weight!: number;

  @IsInt()
  @ApiProperty({ example: '작성자 입니다.' })
  assigneeId!: number;

  @ApiProperty({ example: '2021-12-31 00:00:00' })
  dueDate!: Date;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  parentTaskId!: number;

  //   @ApiProperty({ type: () => TaskResponseDto })
  //   parentTask?: TaskResponseDto;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  writerId!: number;

  @ApiProperty({ type: () => UserResponseDto })
  writer?: UserResponseDto;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  deletedAt?: Date;

  @ApiProperty()
  tasks?: BaseTaskDto[];

  @ApiProperty()
  completed!: boolean;

  constructor(config: {
    id: number;
    title: string;
    content: string;
    parentTaskId: number | null;
    writerId: number;
    writer: UserResponseDto;
    createdAt: Date;
    updatedAt: Date;
    completed: boolean;
  }) {
    this.id = config.id;
    this.title = config.title;
    this.content = config.content;
    this.parentTaskId = config.parentTaskId;
    //this.parentTask = config.parentTask;
    this.writerId = config.writerId;
    this.writer = config.writer;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
    this.completed = config.completed;
  }
  static of(config: { task: Task }): BaseTaskDto {
    console.log('111 : ' + JSON.stringify(config.task));
    console.log('111234 : ' + config.task.writer);
    const writer = UserResponseDto.of({ user: config.task.writer });
    console.log('writer : ' + config.task.writer);
    const writerId = config.task.writerId;

    return new BaseTaskDto({
      ...config.task,
      ...config,
      writer,
      writerId,
    });
  }
}
