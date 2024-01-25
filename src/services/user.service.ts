import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private entityManager: EntityManager
  ){}

  async getHello(): Promise<string> {
    let user = new User();
    user.firstName = "Milica";
    user.lastName = "Simeunovic";
    await user.save();

    const b = await this.entityManager.createQueryBuilder(User, 'u')
      .andWhere({
        firstName: 'Milica'
      })
      .getOne();
    console.log(b.lastName);
    return 'Hello World!';
  }
}
