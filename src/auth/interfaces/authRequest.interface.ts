import { User } from 'src/user/schema/user.schema';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: Omit<User, 'password'> | null;
}
