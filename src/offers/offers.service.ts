import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entity/offers.entity';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entity/user.entity';
import { CreateOfferDto } from './dto/createOffer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find({ relations: ['item', 'user'] });
  }

  async findOne(id: number): Promise<Offer> {
    return this.offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });
  }

  async create(user: User, createOfferDto: CreateOfferDto): Promise<Offer> {
    const { itemId, amount } = createOfferDto;
    const wish = await this.wishesService.findOne(itemId);

    if (!wish) {
      throw new NotFoundException('Заявка с таким id не найдена');
    }

    const newAmount = wish.raised + amount;

    if (amount < 0) {
      throw new BadRequestException('Cумма должна быть больше 0');
    } else if (user.id === wish.owner.id) {
      throw new BadRequestException(
        'Нельзя скидываться самому себе на подарок',
      );
    } else if (amount > wish.price - wish.raised) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    } else {
      await this.wishesService.raiseAmount(itemId, newAmount);
      const offer = this.offersRepository.create({
        ...createOfferDto,
        user,
        item: wish,
      });

      return await this.offersRepository.save(offer);
    }
  }
}
