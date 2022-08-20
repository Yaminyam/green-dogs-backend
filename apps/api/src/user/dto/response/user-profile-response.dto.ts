import { BaseUserResponseDto } from '@api/user/dto/response/base-user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserProfileResponseDto extends BaseUserResponseDto {
  @IsString()
  @ApiProperty({ required: false, example: 'chlim', nullable: true })
  intraId: string | null;

  constructor(id: number, teamsUsername: string, intraId: string | null) {
    super(id, teamsUsername);
    this.intraId = intraId;
  }
}
