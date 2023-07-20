import { Module } from '@nestjs/common';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishesModule } from '../wishes/wishes.module';
import { Wishlist } from './entity/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule],
  exports: [WishlistsService],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
