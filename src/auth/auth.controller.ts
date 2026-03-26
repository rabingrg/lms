import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/registerUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registerData: RegisterDto) {
    return this.authService.registerUser(registerData);
  }
}
