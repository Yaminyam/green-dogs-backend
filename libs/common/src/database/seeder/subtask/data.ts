import { SubTask } from '@app/entity/subTask/subTask.entity';
import { PartialType } from '@nestjs/mapped-types';

export class SeederDatatask extends PartialType(SubTask) {
  objectiveId?: number;
  writerId?: number;
}

export const subTasks: SeederDatatask[] = [
  {
    title: 'title1',
    content: 'haha',
    objectiveId: 1,
    writerId: 1,
  },
  {
    title: 'title2',
    content: 'haha haha',
    objectiveId: 1,
    writerId: 2,
  },
  {
    title: 'title3',
    content: 'haha haha haha',
    objectiveId: 2,
    writerId: 1,
  },
  {
    title: 'title4',
    content: 'haha haha haha',
    objectiveId: 2,
    writerId: 1,
  },
  {
    title: 'title5',
    content: 'haha haha haha',
    objectiveId: 2,
    writerId: 1,
  },
  {
    title: 'title6',
    content: 'haha haha haha',
    objectiveId: 2,
    writerId: 1,
  },
  {
    title: 'title7',
    content: 'haha haha haha',
    objectiveId: 2,
    writerId: 1,
  },
  {
    title: 'title8',
    content: 'haha haha haha',
    objectiveId: 2,
    writerId: 1,
  },
];
