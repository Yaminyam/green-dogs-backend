import { Task } from '@app/entity/task/task.entity';
import { User } from '@app/entity/user/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskRequestDto } from './dto/request/create-task-request.dto';
import { FindAllTaskRequestDto } from './dto/request/find-all-task-request.dto';
import { UpdateTaskRequestDto } from './dto/request/update-task-request.dto';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(
    writer: User,
    createTaskDto: CreateTaskRequestDto,
  ): Promise<
    | {
        task: Task; //
        parentTask: Task | null;
      }
    | never
  > {
    const parentTask = await this.findOneOrFail(createTaskDto.parentTaskId);
    console.log(parentTask);
    const task = await this.taskRepository.save({
      ...createTaskDto,
      writerId: writer.id,
    });

    return { task, parentTask: parentTask.task };
  }

  async findAll(
    user: User,
    options: FindAllTaskRequestDto,
  ): Promise<{
    tasks: Task[];
    totalCount: number;
  }> {
    const { tasks, totalCount } = await this.taskRepository.findAll(options);
    return { tasks, totalCount };
  }

  async existOrFail(id: number): Promise<void> {
    return this.taskRepository.existOrFail(id);
  }

  async findOneByIdOrFail(id: number): Promise<Task | never> {
    return this.taskRepository.findOneOrFail(id);
  }

  async findOneOrFail(id: number): Promise<
    | {
        task: Task;
        parentTask: Task | null;
        writer: User;
      }
    | never
  > {
    const task = await this.taskRepository.findOneOrFail(id, {
      relations: ['writer', 'parentTask'],
    });

    return {
      task,
      parentTask: task.parentTask,
      writer: task.writer,
    };
  }

  async update(id: number, writerId: number, updateTaskRequestDto: UpdateTaskRequestDto): Promise<void | never> {
    const task = await this.taskRepository.findOneOrFail({
      id,
      writerId,
    });
    const newTask = {
      ...task,
      ...updateTaskRequestDto,
    };

    await this.taskRepository.save(newTask);
  }

  async remove(id: number, writerId: number): Promise<void | never> {
    const result = await this.taskRepository.softDelete({
      id,
      writerId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Task with id ${id} with writer ${writerId}`);
    }
  }
}
