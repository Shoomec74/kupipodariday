import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entity/wishes.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { FindUserDto } from './dto/findUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashServise: HashService,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashServise.getHash(
      createUserDto.password,
    );
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    try {
      return await this.usersRepository.save(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(
          'Пользователь с таким username или email уже существует',
        );
      }
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
    return user;
  }

  findMany({ query }: FindUserDto): Promise<User[]> {
    return this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async getUserWishes(id: number) {
    const wishes = await this.wishesRepository.find({
      where: { owner: { id } },
      relations: ['owner'],
    });
    return wishes;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashServise.getHash(
        updateUserDto.password,
      );
    }
    await this.usersRepository.update({ id }, updateUserDto);
    const updatedUser = await this.findOne(id);
    delete updatedUser.password;
    return updatedUser;
  }

  async remove(id: number) {
    return await this.usersRepository.delete({ id });
  }
}
