import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { SignUpUser } from 'src/users/dto/signup-user.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/auth/guards/refreshToken.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Request() req: any) {
    const userId = req.user.id;
    const refreshToken = req.user['refreshToken'];
    Logger.log(req.user);
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('signup')
  signup(@Body() signUpUser: SignUpUser) {
    return this.authService.signUp(signUpUser);
  }

  @Get('logout')
  //@UseGuards(AccessTokenGuard)
  logout(@Request() req: any) {
    Logger.log(req.payload);
    this.authService.logout(req.user.id);
  }
}
