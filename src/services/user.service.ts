import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from 'src/dtos/register.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(){}

  async register(data: RegisterDto): Promise<void> {
    const dbUser = await User.findOne({
      where: {
        email: data.email,
        is_active: true
      }
    });

    if (dbUser)
      throw new BadRequestException('User with provided email already exists');

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);

    let user: User = new User();
    user.email = data.email;
    user.password = data.password;
    user.password_hash = hash;
    user.first_name = data.firstName;
    user.last_name = data.lastName;
    await user.save();
  }

  async findOne(username: string): Promise<User> {
    const user = await User.findOne({
      where: {
        email: username
      }
    });

    if (!user)
      throw new NotFoundException();

    return user;
  }
}
