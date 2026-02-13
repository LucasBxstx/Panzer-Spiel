import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './webservice/dtos/register.dto';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { LoginDto } from './webservice/dtos/login.dto';
import { TokenResponseDto } from './webservice/dtos/token-response.dto';
import { JwtPayload } from '../../common/interfaces/jwt-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(EntityManager)
    private readonly entityManager: EntityManager<PostgreSqlDriver>,

    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,

    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      email: registerDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const existingUserName = await this.userRepository.findOne({
      name: registerDto.name,
    });

    if (existingUserName) {
      throw new ConflictException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      createdAt: new Date(),
    });

    await this.entityManager.persistAndFlush(user);

    const payload: JwtPayload = { userId: user.id, email: user.email };

    const authResponse: TokenResponseDto = {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };

    return authResponse;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({ email: loginDto.email });

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload: JwtPayload = { userId: user.id, email: loginDto.email };

    const authResponse: TokenResponseDto = {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };

    return authResponse;
  }
}
