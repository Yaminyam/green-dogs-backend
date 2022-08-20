import { User } from '@app/entity/user/user.entity';
import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from '../base-user.dto';

export class UserResponseDto extends PickType(BaseUserDto, ['id', 'createdAt', 'updatedAt']) {
  constructor(config: { id: number; createdAt: Date; updatedAt: Date }) {
    super();

    this.id = config.id;
    this.createdAt = config.createdAt;
    this.updatedAt = config.updatedAt;
  }

  static of(config: { user: User }): UserResponseDto {
    return new UserResponseDto({
      ...config.user,
    });
  }
}
