import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, UpdateDateColumn, CreateDateColumn, ManyToOne, PrimaryColumn, EntityManager, JoinColumn, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';
import { Permission } from 'src/enums/permission.enum';
import { QueryHelper } from 'src/db/query-helper';
import { AuthToken } from './auth-token.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({name: 'firstname'})
  firstName: string;

  @Column({name: 'lastname'})
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({name: 'passwordhash'})
  passwordHash: string;

  @Column({name: 'roleid'})
  roleId: number;

  @CreateDateColumn({name: 'createdon'})
  createdOn: Date;

  @UpdateDateColumn({name: 'updatedon'})
  updatedOn: Date;

  @Column({ default: true, name: 'isactive' })
  isActive: boolean;

  @Column({name: 'storagespace'})
  storageSpace: number; // allowed storage space in MB

  @Column({name: 'usedspace'})
  used_space: number; // used space in bytes

  @ManyToOne(() => UserRole)
  @JoinColumn({
    name: 'roleid',
    referencedColumnName: 'id'
  })
  userRole: Promise<UserRole>;

  @OneToMany(() => AuthToken, (authToken) => authToken.user)
  authtokens: Promise<AuthToken[]>

  async hasPermission(permission: Permission): Promise<boolean> {
    const role = await this.userRole;
    const permissionBit = role.permissionMask.charAt(role.permissionMask.length - 1 - (permission - 1));

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
    const allowedStorageSpace = Number(this.storageSpace[0]['allowed_space']);
    return necessarySpace < allowedStorageSpace;
  }
}
