import { Controller, Post, Get, Body, Res, Req, UseGuards, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return result;
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message === 'Email already registered') {
        return { error: 'Email already registered' };
      }
      return { error: 'Failed to registered user' };
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    try {
      const result = await this.authService.login(loginDto);

      response.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: false, // Set to false for local development
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      response.status(HttpStatus.OK);

      return {
        success: result.success,
        message: result.message,
        user: result.user,
        token: result.token,
      };
    } catch (error) {
      response.status(HttpStatus.UNAUTHORIZED);
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }
  }

  @Get('session')
  @UseGuards(JwtAuthGuard)
  async getSession(@Req() request: any, @CurrentUser() user: any) {
    console.log('Session endpoint called');
    console.log('Request cookies:', request.cookies);
    console.log('Request headers:', request.headers);
    console.log('User from guard:', user);
    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('auth_token');
    return {
      success: true,
      message: 'Logout successful',
    };
  }
}
