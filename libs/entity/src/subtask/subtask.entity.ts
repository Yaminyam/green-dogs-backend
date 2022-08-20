import { Task } from '@app/entity/task/task.entity';
import { User } from '@app/entity/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('subtask')
export class SubTask extends BaseEntity {
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
  assigneeId!: number;

  @Column({ nullable: false })
  dueDate!: Date;

  @Column({ nullable: false })
  completed!: boolean;

  @Column({ nullable: false })
  @Index('ix_objective_id')
  parentTaskId!: number;

  @ManyToOne(() => Task, (task) => task.subTask, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'objective_id', referencedColumnName: 'id' })
  parentTask?: Task;

  @Column({ nullable: false })
  @Index('ix_writer_id')
  writerId!: number;

  @ManyToOne(() => User, (user) => user.subTask, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer?: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;
}
