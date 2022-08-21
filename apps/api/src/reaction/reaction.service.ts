import { CategoryService } from '@api/category/category.service';
import { PaginationRequestDto } from '@api/pagination/dto/pagination-request.dto';
import { ReactionArticle, ReactionArticleType } from '@app/entity/reaction/reaction-article.entity';
import { ReactionComment, ReactionCommentType } from '@app/entity/reaction/reaction-comment.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReactionArticleRepository } from './repositories/reaction-article.repository';

@Injectable()
export class ReactionService {
  constructor(
    private readonly reactionArticleRepository: ReactionArticleRepository,

    @InjectRepository(ReactionComment)
    private readonly reactionCommentRepository: Repository<ReactionComment>,

    private readonly categoryService: CategoryService,
  ) {}

  async isMyReactionArticle(
    userId: number,
    articleId: number,
    type: ReactionArticleType = ReactionArticleType.LIKE,
  ): Promise<boolean> {
    return this.reactionArticleRepository.isExist(userId, articleId, type);
  }

  async findAllMyReactionComment(
    userId: number,
    articleId: number,
    type: ReactionCommentType = ReactionCommentType.LIKE,
  ): Promise<ReactionComment[]> {
    return this.reactionCommentRepository.find({
      userId,
      articleId,
      type,
    });
  }

  async findAllArticleByUserId(
    userId: number,
    options: PaginationRequestDto,
  ): Promise<{
    likeArticles: ReactionArticle[];
    totalCount: number;
  }> {
    return this.reactionArticleRepository.findAllArticleByUserId(userId, options);
  }
}
