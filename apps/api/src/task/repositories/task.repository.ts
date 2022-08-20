import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { FindAllTaskRequestDto } from '@api/task/dto/request/find-all-task-request.dto';
import { Task } from '@app/entity/task/task.entity';
import { getPaginationSkip } from '@app/utils/utils';
import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async findAll(options: FindAllTaskRequestDto): Promise<{
    tasks: Task[];
    totalCount: number;
  }> {
    const query = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.writer', 'writer')
      .leftJoinAndSelect('task.parentTask', 'parent_task')
      .skip(getPaginationSkip(options))
      .take(options.take)
      .where('task.parent_task_id = :id', { id: options.parentTaskId })
      .orderBy('task.createdAt', options.order);

    const totalCount = await query.getCount();
    const tasks = await query.getMany();

    return { tasks, totalCount };
  }

  async findAllByWriterId(
    writerId: number,
    options: PaginationRequestDto,
  ): Promise<{
    articles: Task[];
    totalCount: number;
  }> {
    const query = this.createQueryBuilder('article')
      .leftJoinAndSelect('article.writer', 'writer')
      .leftJoinAndSelect('article.category', 'category')
      .andWhere('article.writerId = :id', { id: writerId })
      .skip(getPaginationSkip(options))
      .take(options.take)
      .orderBy('article.createdAt', options.order);

    const totalCount = await query.getCount();
    const articles = await query.getMany();

    return { articles, totalCount };
  }

  async existOrFail(id: number): Promise<void> {
    const existQuery = await this.query(`SELECT EXISTS
		(SELECT * FROM article WHERE id=${id} AND deleted_at IS NULL)`);
    const isExist = Object.values(existQuery[0])[0];
    if (isExist === '0') {
      throw new NotFoundException(`Can't find Task with id ${id}`);
    }
  }
}
