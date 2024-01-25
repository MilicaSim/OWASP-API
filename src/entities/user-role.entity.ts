import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  permission_mask: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.user_role)
  users: Promise<User[]>
}
