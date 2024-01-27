import { Injectable, NotFoundException } from '@nestjs/common';
import { CardResult } from 'src/dtos/card-result.dto';
import { Card } from 'src/entities/card.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class CardService {
  constructor(
    private entityManager: EntityManager
  ){}

  /**
   * Get info about card with provided id
   * @param id Card id
   * @returns Card info
   */
  async getOneBad(id: number): Promise<CardResult> {
    const card = await Card.findOne({
      where: {
        id_number: id,
        is_deleted: false
      }
    });

    if (!card)
      throw new NotFoundException(`Card with provided id does not exist!`);

    let cardResult = new CardResult();
    cardResult.name = card.name;
    cardResult.number = card.number;
    card.cvc = card.cvc;
    return cardResult;
  }

  /**
   * Get info about card with provided id
   * @param id Card id
   * @param userId Logged in user
   * @returns Card info
   */
  async getOneGood(id: number, userId: string): Promise<CardResult> {
    const card = await this.entityManager.createQueryBuilder(Card, 'c')
      .where({
        id_number: id,
        is_deleted: false
      })
      .appendCardFilter('id_number', userId) // get only one that the logged in user can see (access is allowed)
      .getOne();

    if (!card)
      throw new NotFoundException(`Card with provided id does not exist!`);

      let cardResult = new CardResult();
      cardResult.name = card.name;
      cardResult.number = card.number;
      card.cvc = card.cvc;
      return cardResult;
  }
}
