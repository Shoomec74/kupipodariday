import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entity/wishlist.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(owner: User, createWishlistDto: CreateWishlistDto) {
    delete owner.password;
    delete owner.email;
    const wishes = await this.wishesService.findMany({});
    const items = createWishlistDto.itemsId.map((item) => {
      return wishes.find((wish) => wish.id === item);
    });
    const newWishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: owner,
      items: items,
    });
    return this.wishlistsRepository.save(newWishlist);
  }

  async findOne(query: FindOneOptions<Wishlist>): Promise<Wishlist> {
    return this.wishlistsRepository.findOne(query);
  }

  async findAll() {
    const wishlists = await this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
    wishlists.forEach((wishlist) => {
      delete wishlist.owner.password;
      delete wishlist.owner.email;
    });
    return wishlists;
  }

  async findWishlistsById(id: number) {
    return this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async updateOne(
    user: User,
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findWishlistsById(wishlistId);
    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    if (user.id !== wishlist.owner.id) {
      throw new ForbiddenException('Нельзя редактировать чужой список');
    }
    await this.wishlistsRepository.update(wishlistId, updateWishlistDto);
    const updatedWishlist = await this.findOne({
      where: { id: wishlistId },
      relations: {
        owner: true,
        items: true,
      },
    });
    delete updatedWishlist.owner.password;
    delete updatedWishlist.owner.email;
    return updatedWishlist;
  }

  async remove(wishlistId: number, userId: number) {
    const wishlist = await this.findOne({
      where: { id: wishlistId },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException('Нельзя редактировать чужиой список');
    }
    await this.wishlistsRepository.delete(wishlistId);
    return wishlist;
  }
}
