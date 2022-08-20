import { UserResponseDto } from '@api/user/dto/response/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class BaseTaskDto {
  @ApiProperty()
  id!: number;

  @IsString()
  @MaxLength(42)
  @IsNotEmpty()
  @ApiProperty({ example: '제목 입니다.' })
  title!: string;

  @IsString()
  @MaxLength(4242)
  @IsNotEmpty()
  @ApiProperty({ example: '내용 입니다.' })
  content!: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  weight!: number;

  @IsInt()
  @ApiProperty({ example: '작성자 입니다.' })
  assigneeId!: number;

  @ApiProperty({ example: '2021-12-31 00:00:00' })
  dueDate!: Date;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  parentTaskId!: number;

  //   @ApiProperty({ type: () => TaskResponseDto })
  //   parentTask?: TaskResponseDto;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  writerId!: number;

  @ApiProperty({ type: () => UserResponseDto })
  writer?: UserResponseDto;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  deletedAt?: Date;
}
