import { QueryHelper } from 'src/db/query-helper';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, UpdateDateColumn, CreateDateColumn, EntityManager } from 'typeorm';

@Entity()
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({name: 'idnumber'})
  idNumber: number;

  @Column()
  name: string;

  @Column({name: 'createdbyid'})
  createdById: string;

  @Column()
  cvc: number;

  @Column()
  number: string;

  @Column()
  expDate: Date;

  @CreateDateColumn({name: 'createdon'})
  createdOn: Date;

  @UpdateDateColumn({name: 'updatedon'})
  updatedOn: Date;

  @Column({ default: true, name: 'isactive' })
  isActive: boolean;

  @Column({ default: false, name: 'isdeleted' })
  isDeleted: boolean;

  /**
   * Checks whether provided user has the access to provided card
   * @param entityManager 
   * @param cardId 
   * @param userId 
   * @returns boolean - whether provided user has the access to provided card
   */
  public static async isAccessAllowed(entityManager: EntityManager, cardId: number, userId: string): Promise<boolean> {
    const dbFunction = "get_user_allowed_card_ids";

    const allowedCardIds = await QueryHelper.executeQueryFromFunction(entityManager, dbFunction, [userId]);
    const cardIds = allowedCardIds.map((x => x.id));
    return cardIds.includes(cardId);
  }
}
