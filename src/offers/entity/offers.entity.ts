import { Entity, Column, ManyToOne } from 'typeorm';
import { EntityBoilerplate } from '../../utils/entityBoilerplate';
import { User } from '../../users/entity/user.entity';
import { Wish } from '../../wishes/entity/wishes.entity';
import { IsBoolean, IsNotEmpty, NotEquals } from 'class-validator';

@Entity()
export class Offer extends EntityBoilerplate {
  @Column({
    default: 0,
    scale: 2,
  })
  @IsNotEmpty()
  @NotEquals(0)
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @IsNotEmpty()
  item: Wish;
}
