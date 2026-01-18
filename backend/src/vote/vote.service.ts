import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class VoteService {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) {}

    async getVoteData(token: string){
        const groups = await this.knex('award_groups')
            .select('*')
            .where('access_token', token)
        if (groups.length === 0) {
            throw new InternalServerErrorException('Votação não encontrada');
        }
        
        const group = data[0];
        const rows = await this.knex('categories as c')
            .leftJoin('nominees as n', 'c.id', 'n.category_id')
            .select(
            'c.id as cat_id',
            'c.name as cat_name',
            'c.description as cat_desc',
            'c.order_index as cat_order',
            'n.id as nom_id',
            'n.name as nom_name',
            'n.description as nom_desc',
            'n.image_url as nom_img',
            )
            .where('c.group_id', group.id)
            .orderBy([
            { column: 'c.order_index', order: 'asc' },
            { column: 'c.id', order: 'asc' },
        ]);

        if (rows.length === 0) {
            throw new InternalServerErrorException('Nenhuma categoria encontrada');
        }

        const categoriesMap = new Map<number, any>();
        rows.forEach(row => {
            if (!categoriesMap.has(row.cat_id)) {
            categoriesMap.set(row.cat_id, {
                id: row.cat_id,
                name: row.cat_name,
                description: row.cat_desc,
                order_index: row.cat_order,
                nominees: [],
            });
            }

            if (row.nom_id) {
            categoriesMap.get(row.cat_id).nominees.push({
                id: row.nom_id,
                name: row.nom_name,
                description: row.nom_desc,
                image: row.nom_img,
            });
            }
        });

        return {
            group: {
            id: group.id,
            title: group.title,
            description: group.description,
            start_date: group.start_date,
            end_date: group.end_date,
            theme: group.theme,
            },
            categories: Array.from(categoriesMap.values()),
        };
    }

    async createVote(voteDto: any, userId: number){
        try {
            await this.knex('votes').insert({
                user_id: userId,
                group_id: voteDto.group_id,
                category_id: voteDto.category_id,
                nominee_id: voteDto.nominee_id,
            });

            return { msg: 'Voto confirmado!' };
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Você já votou nesta categoria!');
            }
            throw new InternalServerErrorException('Erro ao registrar voto');
        }
    }

    async deleteVote(voteDto: any, userId: number){
        try {
            const affectedRows = await this.knex('votes')
            .where('user_id', userId)
            .where('group_id', voteDto.group_id)
            .where('category_id', voteDto.category_id)
            .del();

            if(affectedRows === 0){
                throw new NotFoundException('Voto não encontrado');
            }
            return { msg: 'Voto deletado!' };
        } catch (err) {
            throw new InternalServerErrorException('Erro ao deletar voto');
        }
    }

    async getMyVotes(groupId: number, userId: number){
        try {
            const rows = await this.knex('votes as v')
            .join('nominees as n', 'v.nominee_id', 'n.id')
            .select(
                'v.category_id', 
                'n.name as nominee_name',
            )
            .where('v.user_id', userId)
            .where('v.group_id', groupId);

            const votesMap: Record<number, string> = {};
            rows.forEach(row => {
                votesMap[row.category_id] = row.nominee_name;
            });

            return votesMap;
        } catch (err) {
            throw new InternalServerErrorException('Erro ao buscar votos do usuário');
        }
    }
}
