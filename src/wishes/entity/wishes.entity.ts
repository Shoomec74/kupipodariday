import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Length, IsUrl, IsInt } from 'class-validator';
import { EntityBoilerplate } from '../../utils/entityBoilerplate';
import { User } from '../../users/entity/user.entity';
import { Offer } from '../../offers/entity/offers.entity';

@Entity()
export class Wish extends EntityBoilerplate {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsInt()
  price: number;

  @Column({ default: 0 })
  @IsInt()
  raised: number;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({
    default: 0,
  })
  copied: number;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
