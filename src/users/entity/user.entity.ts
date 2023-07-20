import { Entity, Column, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { EntityBoilerplate } from '../../utils/entityBoilerplate';
import { Wish } from '../../wishes/entity/wishes.entity';
import { Offer } from '../../offers/entity/offers.entity';
import { Wishlist } from '../../wishlists/entity/wishlist.entity';

@Entity()
export class User extends EntityBoilerplate {
  @Column({ unique: true })
  @IsNotEmpty()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
