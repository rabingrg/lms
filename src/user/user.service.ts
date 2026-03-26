import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(registerData: RegisterDto): Promise<User> {
    const emailExists = await this.userModel.findOne({
      email: registerData.email,
    });

    if (emailExists) {
      throw new ConflictException('Email already exists!');
    }

    const hashedPw = await hash(registerData.password, 10);
    const data = {
      ...registerData,
      password: hashedPw,
    };
    return await this.userModel.create(data);
  }
}
