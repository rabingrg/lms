import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(registerData: RegisterDto): Promise<User> {
    return await this.userService.createUser(registerData);
  }
}
