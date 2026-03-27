import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registerData: RegisterDto) {
    return this.authService.registerUser(registerData);
  }

  @Post('login')
  loginUser(@Body() loginData: LoginDto) {
    return this.authService.loginUser(loginData);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getAll(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
