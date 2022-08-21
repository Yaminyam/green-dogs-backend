import { Auth, AuthUser } from '@api/auth/auth.decorator';
import { User } from '@app/entity/user/user.entity';
import { Body, Controller, Param, ParseIntPipe, Put } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { UpdateCommentRequestDto } from './dto/request/update-comment-request.dto';

@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: '인증 실패' })
@ApiTags('Comment')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Put(':id')
  @Auth()
  @ApiOperation({ summary: '댓글 수정' })
  @ApiOkResponse({ description: '댓글 수정 완료' })
  @ApiNotFoundResponse({ description: '존재하지 않거나, 내가 쓴게 아님' })
  async updateContent(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() writer: User,
    @Body() updateCommentDto: UpdateCommentRequestDto,
  ): Promise<void | never> {
    return this.commentService.updateContent(id, writer.id, updateCommentDto);
  }
}
