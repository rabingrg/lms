import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { IUserRegisterResponse } from './types/user.types';
import { LoginDto } from 'src/auth/dto/login.dto';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  getToken({
    sub,
    email,
    role,
  }: {
    sub: string;
    email: string;
    role: string;
  }): string {
    const token = sign(
      {
        sub,
        email,
        role,
      },
      process.env.JWT_SECRET as string,
    );
    return token;
  }

  async createUser(registerData: RegisterDto): Promise<IUserRegisterResponse> {
    const normalizedEmail = registerData.email.toLowerCase().trim();

    const emailExists = await this.userModel.findOne({
      email: normalizedEmail,
    });

    if (emailExists) {
      throw new ConflictException('Email already exists!');
    }

    const hashedPw = await hash(registerData.password, 10);

    const data = {
      ...registerData,
      email: normalizedEmail,
      password: hashedPw,
    };

    const createdUser = await this.userModel.create(data);

    const payload = {
      sub: createdUser._id.toString(),
      email: createdUser.email,
      role: createdUser.role,
    };

    return {
      data: createdUser,
      access_token: this.getToken(payload),
    };
  }

  async loginUser(loginData: LoginDto): Promise<{ access_token: string }> {
    const normalizedEmail = loginData.email.toLowerCase().trim();

    const existingUser = await this.userModel
      .findOne({
        email: normalizedEmail,
      })
      .select('email password role'); // return selective fields

    if (!existingUser) {
      throw new HttpException(
        'Email or Password wrong!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const matchPassword = await compare(
      loginData.password,
      existingUser.password,
    );

    if (!matchPassword) {
      throw new HttpException(
        'Email or Password wrong!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      sub: existingUser._id.toString(),
      email: existingUser.email,
      role: existingUser.role,
    };

    return {
      access_token: this.getToken(payload),
    };
  }
}
