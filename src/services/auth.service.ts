import { Injectable } from '@nestjs/common';
import { LoginResponse } from 'src/dtos/login-response.dto';
import { AuthToken } from 'src/entities/auth-token.entity';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ){}

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

  async validateUser(email: string, password: string): Promise<User> {
    const user = await User.findOne({
      where: {
        email: email,
        is_active: true
      }
    });

    if (user && bcrypt.compareSync(password, user.password_hash))
      return user;

    return null;
  }

  async login(user: User): Promise<LoginResponse> {
    const payload = { sub: user.id };
    const userRole = user.user_role;

    return {
      accessToken: this.jwtService.sign(payload),
      userId: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      permissioins: (await userRole).permission_mask
    }
  }

  async loginUser(email: string, password: string): Promise<LoginResponse> {
    return;
  }
}
