import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

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
}
