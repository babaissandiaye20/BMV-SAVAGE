// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../common/decorator/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Connexion simple' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Déconnexion de l’utilisateur' })
  logout(@Headers('authorization') authHeader: string) {
    const token = authHeader.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Rafraîchir un token JWT' })
  refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Réinitialiser le mot de passe (à implémenter)' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return { message: 'Reset password functionality pending.' };
  }
}
