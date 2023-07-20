import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Wish } from '../wishes/entity/wishes.entity';
import { HashService } from 'src/hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, HashService],
})
export class UsersModule {}
