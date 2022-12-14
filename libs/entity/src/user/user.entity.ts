import { Article } from '@app/entity/article/article.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { IntraAuth } from '@app/entity/intra-auth/intra-auth.entity';
import { Notification } from '@app/entity/notification/notification.entity';
import { ReactionArticle } from '@app/entity/reaction/reaction-article.entity';
import { ReactionComment } from '@app/entity/reaction/reaction-comment.entity';
import { UserRole } from '@app/entity/user/interfaces/userrole.interface';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubTask } from '../subtask/subtask.entity';
import { Task } from '../task/task.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  nickname!: string;

  @Column({ type: 'varchar', length: 20, nullable: false, unique: true })
  githubUsername!: string;

  @Column({ type: 'varchar', length: 42, nullable: false })
  githubUid!: string;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.NOVICE })
  role!: UserRole;

  @Column({ nullable: false, default: 0 })
  character!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Index('ix_deleted_at')
  deletedAt?: Date;

  @OneToMany(() => Article, (article) => article.writer, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  article?: Article[];

  @OneToMany(() => Comment, (comment) => comment.writer, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  comment?: Comment[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  notification?: Notification[];

  @OneToMany(() => ReactionArticle, (reactionArticle) => reactionArticle.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  reactionArticle?: ReactionArticle[];

  @OneToMany(() => ReactionComment, (reactionComment) => reactionComment.user, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  reactionComment?: ReactionComment[];

  @OneToOne(() => IntraAuth, (intraAuth) => intraAuth.user, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  intraAuth?: Promise<IntraAuth | null>;

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
