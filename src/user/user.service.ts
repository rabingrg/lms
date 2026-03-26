import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  registerUser(data: any) {
    return {
      data,
    };
  }
}
