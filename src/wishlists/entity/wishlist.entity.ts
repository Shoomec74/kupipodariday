import { Entity, Column, JoinTable, ManyToOne, ManyToMany } from 'typeorm';
import {
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';
import { EntityBoilerplate } from 'src/utils/entityBoilerplate';
import { Wish } from 'src/wishes/entity/wishes.entity';
import { User } from 'src/users/entity/user.entity';

@Entity()
export class Wishlist extends EntityBoilerplate {
  @Column()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @MaxLength(1500)
  description: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsOptional()
  @IsUrl()
  image: string;

  @JoinTable()
  @IsOptional()
  @ManyToMany(() => Wish)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
