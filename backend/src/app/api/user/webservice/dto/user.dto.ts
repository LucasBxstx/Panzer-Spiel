import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
