import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubTask } from '../subtask/subtask.entity';
import { User } from '../user/user.entity';

@Entity('task')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('ix_title')
  @Column({ type: 'varchar', length: 42, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({ nullable: false })
  weight!: number;

  @Column({ nullable: false })
  assigneeId!: string;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  dueDate!: Date;

  @Column({ nullable: false, default: false })
  completed!: boolean;

  @Column({ nullable: true })
  @Index('ix_objective_id')
  parentTaskId!: number;

  @ManyToOne(() => Task, (task) => task.subTask, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'parent_task_id', referencedColumnName: 'id' })
  parentTask?: Task;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;

  @Column({ nullable: false })
  @Index('ix_writer_id')
  writerId!: number;

  @ManyToOne(() => User, (user) => user.task, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer?: User;

  @OneToMany(() => Task, (task) => task.parentTask, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  task?: Task[];

  @OneToMany(() => SubTask, (subTask) => subTask.parentTask, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  subTask?: SubTask[];
}
