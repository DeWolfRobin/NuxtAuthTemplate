import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;
    return this.prisma.users.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  findOne(id: string) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  //Do password check first, not here
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const pwCheck = this.prisma.users.findUnique({
        where: { email: updateUserDto.email },
      });

      const newpw = await bcrypt.hash(updateUserDto.password, roundsOfHashing);

      if ((await pwCheck).password === newpw) {
        updateUserDto.password = newpw;
      }
    }

    return this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.users.delete({ where: { id } });
  }
}
