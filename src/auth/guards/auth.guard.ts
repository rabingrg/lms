import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
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
      console.log({ decode });
      if (!decode.sub) {
        throw new UnauthorizedException('Invalid token payload!');
      }
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
