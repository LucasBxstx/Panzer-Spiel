import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { UserResponseDto } from './webservice/dto/user-response.dto';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UpdateUserDto } from './webservice/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,

    @Inject(EntityManager)
    protected entityManager: EntityManager<PostgreSqlDriver>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => UserResponseDto.fromEntity(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneOrFail({ id });

    return UserResponseDto.fromEntity(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneOrFail({ id });

    user.email = updateUserDto.email;
    user.name = updateUserDto.name;

    await this.entityManager.flush();

    return UserResponseDto.fromEntity(user);
  }
}
