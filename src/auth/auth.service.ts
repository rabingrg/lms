import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import { IUserRegisterResponse } from 'src/user/types/user.types';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(
    registerData: RegisterDto,
  ): Promise<IUserRegisterResponse> {
    const createdUser = (await this.userService.createUser(
      registerData,
    )) as UserDocument;

    const payload = {
      sub: createdUser._id.toString(),
      email: createdUser.email,
      role: createdUser.role,
    };

    return {
      data: createdUser as any,
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginUser(loginData: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.loginUser(loginData);
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(id: string) {
    return this.userService.getUserById(id);
  }
}
