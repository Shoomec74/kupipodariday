import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, IsUrl, Length } from 'class-validator';
import { CreateUserDto } from './createUser.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Length(2, 30)
  @IsString()
  username?: string;

  @Length(2, 200)
  @IsString()
  about?: string;

  @IsUrl()
  avatar?: string;

  @IsEmail()
  email: string;

  @Length(3, 10)
  @IsString()
  password?: string;
}
