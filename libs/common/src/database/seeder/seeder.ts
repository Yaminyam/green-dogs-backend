import { Injectable } from '@nestjs/common';
import { TaskSeederService } from './task/task-seeder.service';
import { SubTaskSeederService } from './subtask/subtask-seeder.service';
import { UserSeederService } from './user/user-seeder.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly userSeederService: UserSeederService,
    private readonly subTaskSeederService: SubTaskSeederService,
    private readonly taskSeederService: TaskSeederService,
  ) {}

  async seed() {
    await Promise.all([
      this.userSeederService.create(),
      this.subTaskSeederService.create(),
      this.taskSeederService.create(),
    ]);
  }
}
