import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import { IUserRegisterResponse } from 'src/user/types/user.types';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(
    registerData: RegisterDto,
  ): Promise<IUserRegisterResponse> {
    return await this.userService.createUser(registerData);
  }

  async loginUser(loginData: LoginDto): Promise<{ access_token: string }> {
    return this.userService.loginUser(loginData);
  }

  async getProfile(id: string) {
    return this.userService.getUserById(id);
  }
}
