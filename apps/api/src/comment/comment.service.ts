import { CategoryService } from '@api/category/category.service';
import { CommentRepository } from '@api/comment/repositories/comment.repository';
import { NotificationService } from '@api/notification/notification.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { Comment } from '@app/entity/comment/comment.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { UpdateCommentRequestDto } from './dto/request/update-comment-request.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly notificationService: NotificationService,
    private readonly categoryService: CategoryService,
  ) {}

  async findOneByIdOrFail(id: number, options?: FindOneOptions): Promise<Comment> {
    return this.commentRepository.findOneOrFail(id, options);
  }

  async findAllByWriterId(
    writerId: number,
    options: PaginationRequestDto,
  ): Promise<{
    comments: Comment[];
    totalCount: number;
  }> {
    return this.commentRepository.findAllByWriterId(writerId, options);
  }

  async updateContent(id: number, writerId: number, updateCommentDto: UpdateCommentRequestDto): Promise<void | never> {
    const comment = await this.commentRepository.findOneOrFail({
      id,
      writerId,
    });
    const newComment = {
      ...comment,
      ...updateCommentDto,
    };
    await this.commentRepository.save(newComment);
  }

  async increaseLikeCount(comment: Comment): Promise<Comment> {
    await this.commentRepository.update(comment.id, {
      likeCount: () => 'like_count + 1',
    });
    comment.likeCount += 1;
    return comment;
  }

  async decreaseLikeCount(comment: Comment): Promise<Comment> {
    if (comment.likeCount <= 0) {
      throw new BadRequestException('좋아요는 0이하가 될 수 없습니다.');
    }
    await this.commentRepository.update(comment.id, {
      likeCount: () => 'like_count - 1',
    });
    comment.likeCount -= 1;
    return comment;
  }
}
