import { Injectable, Inject, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { Knex } from "knex"
import { randomUUID } from 'crypto';

@Injectable()
export class GroupsService {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) {}

    async getMyGroups(userId: number) {
        try {
        return await this.knex('award_groups')
            .select('*')
            .where('creator_id', userId)
            .orderBy('created_at', 'desc');
        } catch (error) {
        throw new InternalServerErrorException('Falha ao buscar grupos de votação do usuário ' + userId);
        }
    }

    async createGroup(groupDto: any, userId: number) {
        try {
            const token = randomUUID();
            const [groupId] = await this.knex('award_groups').insert({
                creator_id: userId,
                title: groupDto.title,
                description: groupDto.description,
                start_date: groupDto.start_date,
                end_date: groupDto.end_date,
                access_token: token,
                theme: groupDto.theme,
        });
            return { msg: 'Votação criada com sucesso!', groupId, linkToken: token };
        } catch (error) {
            throw new InternalServerErrorException('Falha ao criar a votação');
        }
    }

    async updateGroup(id: number, groupDto: any, userId: number) {
        try {
            const updatedRows = await this.knex('award_groups')
            .update({
                title: groupDto.title,
                description: groupDto.description,
                start_date: groupDto.start_date,
                end_date: groupDto.end_date,
                theme: groupDto.theme,
            })
            .where({ id: id, creator_id: userId });

             if (updatedRows === 0) {
                throw new ForbiddenException(
                    'Você não tem permissão para editar esta votação ou ela não existe.',
                );
            }

            return { msg: 'Votação atualizada com sucesso!' };
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }

            throw new InternalServerErrorException('Falha ao atualizar a votação.');
        }
    }

}
