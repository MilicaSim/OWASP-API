import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";

declare module "typeorm/query-builder/SelectQueryBuilder" {
  interface SelectQueryBuilder<Entity> {
    appendCardFilter(this: SelectQueryBuilder<Entity>, column: string, userId: string): SelectQueryBuilder<Entity>;
  }
}

SelectQueryBuilder.prototype.appendCardFilter = function <Entity>(this: SelectQueryBuilder<Entity>, column: string, userId: string): SelectQueryBuilder<Entity> {
  const subQueryDbFunction: string = "get_user_allowed_card_ids";
  const sqlCondition = `${this.alias}.${column} IN (SELECT id FROM ${subQueryDbFunction}('${userId}'))`;
  this.andWhere(sqlCondition);
  return this;
}