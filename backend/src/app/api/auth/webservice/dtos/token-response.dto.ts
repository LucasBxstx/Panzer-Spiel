import { Expose } from 'class-transformer';

export class TokenResponseDto {
  @Expose()
  access_token: string;

  @Expose()
  user: AuthUserResponseDto;
}

export class AuthUserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;
}
