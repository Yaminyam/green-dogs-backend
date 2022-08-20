import { SubTask } from '@app/entity/subtask/subtask.entity';
import { Task } from '@app/entity/task/task.entity';
import { User } from '@app/entity/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubTaskSeederService } from './subtask-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, SubTask])],
  providers: [SubTaskSeederService],
  exports: [SubTaskSeederService],
})
export class SubTaskSeederModule {}