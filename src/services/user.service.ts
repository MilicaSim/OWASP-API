import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private entityManager: EntityManager
  ){}

  async getHello(): Promise<void> {
  }
}
