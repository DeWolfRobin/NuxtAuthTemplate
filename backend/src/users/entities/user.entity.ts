import { ApiProperty } from '@nestjs/swagger';
import { users } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements users {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @Exclude()
  password: string;

  @ApiProperty({ required: false, default: true })
  admin: boolean = false;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
