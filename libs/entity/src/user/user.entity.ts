import { Task } from '@app/entity/task/task.entity';
import { SubTask } from '@app/entity/subtask/subtask.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
  teamsUsername!: string;

  @Column({ type: 'varchar', length: 42, nullable: false })
  teamsUid!: string;

  @Column({ nullable: true })
  lastLogin?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;

  @OneToMany(() => Task, (task) => task.writer, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  task?: Task[];

  @OneToMany(() => SubTask, (subTask) => subTask.writer, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  subTask?: SubTask[];
}
