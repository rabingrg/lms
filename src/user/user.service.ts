import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { IUserRegisterResponse } from './types/user.types';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(registerData: RegisterDto): Promise<IUserRegisterResponse> {
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

    const createdUser = await this.userModel.create(data);

    const token = sign(
      {
        fullName: `${registerData.firstName} ${registerData.lastName}`,
        email: registerData.email,
      },
      process.env.JWT_SECRET as string,
    );

    return {
      data: createdUser,
      access_token: token,
    };
  }
}
