import { User } from '../schema/user.schema';

export enum Role {
  ADMIN = 'admin',
  STUDENT = 'student',
}

export interface IUserRegisterResponse {
  data: User;
  access_token: string;
}
