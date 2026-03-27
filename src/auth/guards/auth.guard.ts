import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';
import { AuthRequest } from '../interfaces/authRequest.interface';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/user/types/user.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid token format!');
    }

    const token = parts[1];
    if (!token) {
      throw new UnauthorizedException('Missing token!');
    }

    try {
      const decode = verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (!decode.sub) {
        throw new UnauthorizedException('Invalid token payload!');
      }
      const { user } = await this.userService.getUserById(decode.sub);

      if (!user) {
        throw new NotFoundException('User not found!');
      }

      request.user = user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // jwt specific errors
      if (error instanceof Error) {
        if (error.message === 'jwt expired') {
          throw new UnauthorizedException('Token expired');
        } else if (
          error.message === 'invalid token' ||
          error.message === 'invalid signature'
        ) {
          throw new UnauthorizedException('Invalid token');
        }
      }

      throw new UnauthorizedException('Unauthorized');
    }
  }
}
