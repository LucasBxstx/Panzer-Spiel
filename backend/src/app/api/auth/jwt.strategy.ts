import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../user/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { JwtPayload } from '../../common/models/jwt-user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'uF9sT3Lh4qZpW1r8XyB2vN7cQ6mR0dKjE5tH9aP4sU',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOne({ id: payload.userId });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
