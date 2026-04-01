import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { LoginDto } from 'src/auth/dto/login.dto';
import { compare, hash } from 'bcrypt';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(registerData: RegisterDto): Promise<User> {
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
    return createdUser;
  }

  async loginUser(loginData: LoginDto): Promise<UserDocument> {
    const normalizedEmail = loginData.email.toLowerCase().trim();

    const existingUser = await this.userModel
      .findOne({
        email: normalizedEmail,
      })
      .select('email +password role'); // return selective fields, "+" to return "select: false" added field in schema

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

    return existingUser;
  }

  async getUserById(id: string): Promise<{ user: User | null }> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return {
      user,
    };
  }
}
