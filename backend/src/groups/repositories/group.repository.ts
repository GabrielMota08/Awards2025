import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { Group } from 'src/entities/groups/groups.entity';

@Injectable()
export class GroupRepository {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  private groupsTable() {
    return this.knex<Group>('groups');
  }

  async getMyGroups(userId: number): Promise<Group[]> {
    try {
      return await this.groupsTable()
        .select('*')
        .where('creator_id', userId)
        .orderBy('created_at', 'desc');
    } catch (error) {
      throw new InternalServerErrorException(
        'Falha na obtenção dos dados!',
      );
    }
  }
}
