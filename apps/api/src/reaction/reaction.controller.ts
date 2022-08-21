import { Auth, AuthUser } from '@api/auth/auth.decorator';
import { Article } from '@app/entity/article/article.entity';
import { Comment } from '@app/entity/comment/comment.entity';
import { User } from '@app/entity/user/user.entity';
import { Controller, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReactionResponseDto } from './dto/response/reaction-response.dto';
import { ReactionService } from './reaction.service';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Reaction')
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}
}
