import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class BaseUserResponseDto {
  @ApiProperty()
  id!: number;

  @IsString()
  @ApiProperty()
  teamsUsername!: string;

  constructor(id: number, teamsUsername: string) {
    this.id = id;
    this.teamsUsername = teamsUsername;
  }
}
