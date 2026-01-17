import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { Category } from 'src/entities/categories/categories.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  private categoriesTable() {
    return this.knex<Category>('categories');
  }

}
