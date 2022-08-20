import { SubTask } from '@app/entity/subtask/subtask.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { subTasks } from './data';

@Injectable()
export class SubTaskSeederService {
  constructor(
    @InjectRepository(SubTask)
    private readonly subTaskRepository: Repository<SubTask>,
  ) {}

  async create() {
    return this.subTaskRepository.save(subTasks);
  }
}
