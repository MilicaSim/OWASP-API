import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, MoreThan, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AuthToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  user_id: string;

  @Column()
  token: string;

  @Column()
  issued_on: Date;

  @Column()
  exp_date: Date;

  @ManyToOne(() => User)
  user: User

  static async getValidToken(token: string): Promise<AuthToken> {
    return AuthToken.findOne({
      where: {
        token: token,
        exp_date: MoreThan(new Date()) // non expired
      },
      relations: ['user', 'user.user_role']
    })
  }
}
