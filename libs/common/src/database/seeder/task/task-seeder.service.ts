import { Task } from '@app/entity/task/task.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { tasks } from './data';

@Injectable()
export class TaskSeederService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create() {
    return this.taskRepository.save(tasks);
  }
}
