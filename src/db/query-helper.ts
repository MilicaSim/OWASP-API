import { EntityManager } from "typeorm";

export class QueryHelper {
  static executeQueryFromFunction(em: EntityManager, dbFunction: string, parameters?: any[]) {
    const params = parameters?.map((param, index) => {
      return `$${index + 1}`;
    }).join(',');

    return em.query(
      `SELECT * FROM ${dbFunction}(${params ?? ""})`, parameters
    );
  }
}