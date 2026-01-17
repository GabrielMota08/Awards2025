import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { Nominee } from 'src/entities/nominees/nominees.entity';

@Injectable()
export class NomineeRepository {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  private nomineesTable() {
    return this.knex<Nominee>('nominees');
  }
}
