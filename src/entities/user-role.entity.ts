import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: 'permissionmask'})
  permissionMask: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.userRole)
  users: Promise<User[]>
}
