import { Entity, Column, BaseEntity, UpdateDateColumn, CreateDateColumn, ManyToOne, PrimaryColumn, EntityManager, JoinColumn, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';
import { Permission } from 'src/enums/permission.enum';
import { QueryHelper } from 'src/db/query-helper';
// import { AuthToken } from './auth-token.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  password_hash: string;

  @Column()
  role_id: number;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @Column()
  is_active: boolean;

  @Column()
  storage_space: number; // allowed storage space in MB

  @Column()
  used_space: number; // used space in bytes

  @ManyToOne(() => UserRole)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id'
  })
  user_role: Promise<UserRole>;

  // @OneToMany(() => AuthToken, (authToken) => authToken.user)
  // auth_tokens: Promise<AuthToken[]>

  async hasPermission(permission: Permission): Promise<boolean> {
    const role = await this.user_role;
    const permissionBit = role.permission_mask.charAt(role.permission_mask.length - 1 - (permission - 1));

    return Boolean(Number(permissionBit));
  }

  /**
   * Checks whether the user has enough storage space
   * @param em Entity manager
   * @param fileSize Size of the file that user wants to add (in bytes)
   * @returns Indicates whether the user has enough storage space
   */
  async hasEnoughSpace(em: EntityManager, fileSize: number): Promise<boolean> {
    const storageInfo = await QueryHelper.executeQueryFromFunction(
      em,
      'get_storage_space_info',
      [this.id]
    );

    const necessarySpace = Number(storageInfo[0]['used_space']) + fileSize;
    const allowedStorageSpace = Number(this.storage_space[0]['allowed_space']);
    return necessarySpace < allowedStorageSpace;
  }
}
