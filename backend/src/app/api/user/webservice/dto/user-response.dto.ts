import { Expose } from 'class-transformer';
import { User } from '../../user.entity';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  static fromEntity(entity: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.name = entity.name;

    return dto;
  }
}
