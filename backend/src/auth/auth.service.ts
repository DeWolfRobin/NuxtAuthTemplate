//src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });

    // If no user is found, throw an error
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
      refreshToken: this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '7d' },
      ),
    };
  }

  //https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token

  //   async refreshTokens(userId: string, refreshToken: string) {
  //     const user = await this.usersService.findById(userId);
  //     if (!user || !user.refreshToken)
  //       throw new ForbiddenException('Access Denied');
  //     const refreshTokenMatches = await argon2.verify(
  //       user.refreshToken,
  //       refreshToken,
  //     );
  //     if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
  //     const tokens = await this.getTokens(user.id, user.username);
  //     await this.updateRefreshToken(user.id, tokens.refreshToken);
  //     return tokens;
  //   }
}
