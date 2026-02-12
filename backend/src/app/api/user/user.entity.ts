import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './webservice/dto/user.dto';
import { v4 } from 'uuid';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true })
  email: string;

  @Property({ type: String })
  name: string;

  constructor(createUserDto: CreateUserDto) {
    super();

    this.email = createUserDto.email;
  }
}
