import { QueryHelper } from 'src/db/query-helper';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, UpdateDateColumn, CreateDateColumn, EntityManager } from 'typeorm';

@Entity()
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  id_number: number;

  @Column()
  name: string;

  @Column()
  created_by_id: string;

  @Column()
  cvc: number;

  @Column()
  number: string;

  @Column()
  exp_date: Date;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @Column()
  is_active: boolean;

  @Column()
  is_deleted: boolean;

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
