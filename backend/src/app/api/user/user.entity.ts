import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRepository } from './user.repository';
import { v4 } from 'uuid';
import { CreateUserDto } from './webservice/dto/user.dto';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true })
  email: string;

  @Property({ type: String })
  password: string;

  @Property({ type: String, unique: true })
  name: string;

  @Property({ type: Date })
  createdAt: Date;

  constructor(createUserDto: CreateUserDto) {
    super();

    this.name = createUserDto.name;
    this.email = createUserDto.email;
  }
}
