import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginSuccessDto } from 'src/dtos/auth/login-success.dto';
import { UserRole } from 'src/entities/user-role.entity';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) {}

  async login(user: User): Promise<LoginSuccessDto> {
    const payload = {sub: user.id};
    return user.user_role
      .then((role: UserRole) => {
        return {
          accessToken: this.jwtService.sign(payload),
          userId: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          permissions: role.permission_mask
        }
      });
  }

  async loginUser(email: string, password: string): Promise<LoginSuccessDto> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.email };
    const role = await user.user_role;
    return {
      accessToken: await this.jwtService.signAsync(payload),
      userId: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      permissions: role.permission_mask
    };
  }

  /**
   * Check if user with provided email and password exists
   * @param email 
   * @param password 
   * @returns User | null
   */
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

  /**
   * Find user by id
   * @param id 
   * @returns User
   */
  async getUserById(id: string): Promise<User> {
    return User.findOne({
      where: {
        id: id
      }
    });
  }

  // async getUserByToken(token: string): Promise<User> {
    
  // }
}