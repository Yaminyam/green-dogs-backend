import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateToCadetDto {
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;
}
