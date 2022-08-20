import { User } from '@app/entity/user/user.entity';
import { Objective } from '@app/entity/objective/objective.entity';
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

@Entity('task')
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('ix_title')
  @Column({ type: 'varchar', length: 42, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({ default: 0 })
  viewCount!: number;

  @Column({ nullable: false })
  @Index('ix_objective_id')
  objectiveId!: number;

  @ManyToOne(() => Objective, (objective) => objective.task, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'objective_id', referencedColumnName: 'id' })
  objective?: Objective;

  @Column({ nullable: false })
  @Index('ix_writer_id')
  writerId!: number;

  @ManyToOne(() => User, (user) => user.task, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer?: User;

  @Column({ default: 0 })
  commentCount!: number;

  @Column({ default: 0 })
  likeCount!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;
}
