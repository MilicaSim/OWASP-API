import { Controller, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { CardResult } from 'src/dtos/card-result.dto';
import { CardService } from 'src/services/card.service';

@Controller('card')
export class CardController {
  constructor(
    private readonly cardService: CardService
  ) {}

  @Get(':id/bad')
  async getOneBad(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CardResult> {
    return this.cardService.getOneBad(id);
  }

  @Get(':id/good')
  async getOneGood(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request
  ): Promise<CardResult> {
    return this.cardService.getOneGood(id, req.formData.toString());
  }

  // @Post()
  // async create(): Promise<void> {
  //   await this.cardService.create();
  // }

  // @Put()
  // async update(): Promise<void> {
  //   await this.cardService.update();
  // }
}
