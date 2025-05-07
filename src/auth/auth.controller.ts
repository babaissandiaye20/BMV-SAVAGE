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
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { Public } from '../common/decorator/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @Post('request-password-reset')
  @ApiOperation({ summary: 'Demander un code de réinitialisation de mot de passe' })
  @ApiResponse({ status: 200, description: 'Code envoyé avec succès' })
  requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Réinitialiser le mot de passe avec le code reçu' })
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé avec succès' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(
      dto.email,
      dto.code,
      dto.newPassword,
    );
  }
}
