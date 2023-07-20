import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entity/wishes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish])],
  exports: [WishesService],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
