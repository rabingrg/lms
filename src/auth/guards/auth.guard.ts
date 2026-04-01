import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from '../interfaces/authRequest.interface';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
      const decode = this.jwtService.verify(token);
      if (!decode?.sub) {
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

      if (error instanceof Error) {
        if (error.message === 'jwt expired') {
          throw new UnauthorizedException('Token expired');
        }
        if (
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
