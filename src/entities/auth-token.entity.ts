import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, MoreThan, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AuthToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({name: 'userid'})
  userId: string;

  @Column()
  token: string;

  @Column({name: 'issuedon'})
  issuedOn: Date;

  @Column({name: 'expdate'})
  expDate: Date;

  @ManyToOne(() => User)
  user: User

  static async getValidToken(token: string): Promise<AuthToken> {
    return AuthToken.findOne({
      where: {
        token: token,
        expDate: MoreThan(new Date()) // non expired
      },
      relations: ['user', 'user.userRole']
    })
  }
}
