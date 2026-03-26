import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import { hash } from 'bcrypt';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(registerData: RegisterDto): Promise<{ user: User }> {
    const hashedPw = await hash(registerData.password, 10);
    const data = {
      ...registerData,
      password: hashedPw,
    };

    const user = await this.userService.createUser(data);

    return { user };
  }
}
