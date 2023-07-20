import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entity/wishes.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { CreateWishDto } from './dto/createWish.dto';
import { UpdateWishDto } from './dto/updateWish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    delete owner.password;
    delete owner.email;
    const newWish = this.wishesRepository.create({
      ...createWishDto,
      owner: owner,
    });
    return this.wishesRepository.save(newWish);
  }

  async find(query: FindOneOptions<Wish>): Promise<Wish> {
    return this.wishesRepository.findOne(query);
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return wish;
  }

  findMany(query: FindManyOptions<Wish>) {
    return this.wishesRepository.find(query);
  }

  async findLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  async findTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 20,
      order: { copied: 'DESC' },
    });
  }

  async updateOne(wishId: number, UpdatedWish: UpdateWishDto, userId: number) {
    const wish = await this.findOne(wishId);

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя редактировать чужой подарок');
    } else if (wish.raised !== 0 && wish.offers.length !== 0) {
      throw new ForbiddenException(
        'Нельзя редактировать подарок, на который уже скидываются',
      );
    } else if (!wish) {
      throw new NotFoundException('Подарок не найден');
    } else {
      await this.wishesRepository.update(wishId, UpdatedWish);
    }
  }

  async copy(wishId: number, user: User) {
    const wish = await this.findOne(wishId);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    } else if (user.id === wish.owner.id) {
      throw new ForbiddenException('Нельзя скопировать свой подарок');
    } else {
      await this.wishesRepository.update(wishId, {
        copied: (wish.copied = wish.copied + 1),
      });

      const { id, createdAt, ...wishWithoutIdAndCreatAt } = wish;

      const wishClone = {
        ...wishWithoutIdAndCreatAt,
        raised: 0,
        owner: user.id,
        offers: [],
        copied: 0,
      };

      await this.create(user, wishClone);
      return {};
    }
  }

  async remove(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя удалить чужой подарок');
    }
    await this.wishesRepository.delete(wishId);
    return wish;
  }

  async raiseAmount(wishId: number, amount: number) {
    return await this.wishesRepository.update(
      { id: wishId },
      { raised: amount },
    );
  }
}
