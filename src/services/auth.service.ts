import { Injectable } from '@nestjs/common';
import { LoginResponse } from 'src/dtos/login-response.dto';
import { AuthToken } from 'src/entities/auth-token.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(){}

  /**
   * Get user by token
   * @param token Token
   * @returns User
   */
  async getUserByToken(token: string): Promise<User> {

    const validAuthToken = await AuthToken.getValidToken(token);
    if (!validAuthToken || !validAuthToken.user || !validAuthToken.user.is_active)
      return null;

    return validAuthToken.user;
  }

  /**
   * Get user by id
   * @param id User id
   * @returns User
   */
  async getUserById(id: string): Promise<User> {
    return User.createQueryBuilder()
      .where({
        id: id,
        isActive: true
      })
      .getOne();
  }

  /**
   * 
   * @param email 
   * @param password 
   * @returns 
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    return;
  }
}
