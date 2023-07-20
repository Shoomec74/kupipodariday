import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwtAuth.guards';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Get()
  async getWishlists() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  async getWishlistsById(@Param('id') id: string) {
    return this.wishlistsService.findWishlistsById(+id);
  }

  @Post()
  async create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  @Patch(':id')
  async updateOne(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.wishlistsService.updateOne(req.user, +id, updateWishlistDto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.wishlistsService.remove(+id, req.user.id);
  }
}
