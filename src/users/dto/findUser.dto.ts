import { IsString, MinLength } from 'class-validator';

export class FindUserDto {
  @MinLength(2)
  @IsString()
  query: string;
}
