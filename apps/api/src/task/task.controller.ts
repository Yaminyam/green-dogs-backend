import { Auth, AuthUser as GetUser } from '@api/auth/auth.decorator';
import { PaginationResponseDto } from '@api/pagination/dto/pagination-response.dto';
import { ApiPaginatedResponse } from '@api/pagination/pagination.decorator';
import { User } from '@app/entity/user/user.entity';
import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateTaskRequestDto } from './dto/request/create-task-request.dto';
import { FindAllTaskRequestDto } from './dto/request/find-all-task-request.dto';
import { UpdateTaskRequestDto } from './dto/request/update-task-request.dto';
import { CreateTaskResponseDto } from './dto/response/create-task-response.dto';
import { FindOneTaskResponseDto } from './dto/response/find-one-task-response.dto';
import { TaskResponseDto } from './dto/response/task-response.dto';
import { TaskService } from './task.service';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Task')
@Controller('tasks')
export class TaskController {
  constructor(
    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
  ) {}

  @Post()
  @Auth()
  @ApiOperation({ summary: '태스크 추가' })
  @ApiCreatedResponse({
    description: '업로드된 태스크',
    type: CreateTaskResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 카테고리' })
  async create(
    @GetUser() user: User,
    @Body() createTaskDto: CreateTaskRequestDto,
  ): Promise<CreateTaskResponseDto | never> {
    const { task, parentTask } = await this.taskService.create(user, createTaskDto);
    console.log(task, parentTask);
    return CreateTaskResponseDto.of({
      task,
      parentTask,
      writer: user,
    });
  }

  @Get()
  @ApiOperation({ summary: '오브젝트 목록' })
  @ApiPaginatedResponse(TaskResponseDto)
  async findAll(
    @Query() options: FindAllTaskRequestDto,
    @GetUser() user: User,
  ): Promise<PaginationResponseDto<TaskResponseDto>> {
    const { tasks, totalCount } = await this.taskService.findAll(user, options);
    console.log(tasks, totalCount);
    return PaginationResponseDto.of({
      data: TaskResponseDto.ofArray({ tasks }),
      options,
      totalCount,
    });
  }

  @Get(':id')
  @Auth()
  @ApiOperation({ summary: '오브젝트 상세 가져오기' })
  @ApiOkResponse({
    description: '오브젝트 상세',
    type: FindOneTaskResponseDto,
  })
  @ApiNotFoundResponse({ description: '존재하지 않는 게시글' })
  async findOne(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser() user: User,
  ): Promise<FindOneTaskResponseDto | never> {
    const { task, parentTask, writer } = await this.taskService.findOneOrFail(taskId);
    console.log(task, parentTask, writer);
    console.log(user);
    return FindOneTaskResponseDto.of({
      task,
      parentTask,
      writer,
      user,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: '태스크 수정하기' })
  @ApiOkResponse({ description: '태스크 수정 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않는 태스크' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') writerId: number,
    @Body() updateTaskRequestDto: UpdateTaskRequestDto,
  ): Promise<void | never> {
    return this.taskService.update(id, writerId, updateTaskRequestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '태스크 삭제하기' })
  @ApiOkResponse({ description: '태스크 삭제 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않는 태스크' })
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser('id') writerId: number): Promise<void | never> {
    return this.taskService.remove(id, writerId);
  }
}
