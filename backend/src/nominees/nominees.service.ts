import { Injectable, Inject, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { Knex } from "knex"

@Injectable()
export class NomineesService {
    constructor(
            @Inject('KNEX_CONNECTION') private readonly knex: Knex,
        ) {}

    async createNominee(nomineeDto: any, userId: number){
        try {
            const nominee = await this.knex('categories')
            .select('id')
            .where({
                id: nomineeDto.categoryId,
                creator_id: userId,
            })
            .first();
            
            if (!nominee) {
                throw new ForbiddenException(
                    'Esta categoria não pertence a você ou não existe.',
                );
            }

            const [nomineeId] = await this.knex('nominees').insert({
                category_id: nomineeDto.categoryId,
                name: nomineeDto.name,
                description: nomineeDto.description,
                image_url: nomineeDto.imageUrl
            })

            return { msg: 'Indicado adicionado!', nomineeId};
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }

            throw new InternalServerErrorException(error.message);
        }
    }

    async updateNominee(id, nomineeDto, userId){
        try {
            const nominee = await this.knex('nominees')
            .join('categories', 'categories.id', 'nominees.category_id')
            .select('nominees.id')
            .where('nominees.id', id)
            .where('categories.creator_id', userId)
            .first();

            if (!nominee) {
                throw new ForbiddenException(
                    'Indicado não encontrado ou não pertence a você',
                );
            }

            await this.knex('nominees')
                .where('id', id)
                .update({
                    name: nomineeDto.name,
                    description: nomineeDto.description,
                    image_url: nomineeDto.imageUrl,
            });
            return { msg: 'Indicado atualizado!'};
        } catch (error) {
             if (error instanceof ForbiddenException) {
                throw error;
            }

            throw new InternalServerErrorException(error.message);
        }
    }
    
    async deleteNominee(id, userId){
        try {
            const nominee = await this.knex('nominees')
            .join('categories', 'categories.id', 'nominees.category_id')
            .select('nominees.id')
            .where('nominees.id', id)
            .where('categories.creator_id', userId)
            .first();

            if (!nominee) {
                throw new ForbiddenException(
                    'Indicado não encontrado ou não pertence a você',
                );
            }

            await this.knex('nominees')
            .where('id', id)
            .del();

            return { message: 'Indicado removido com sucesso' };
        } catch (error) {
             if (error instanceof ForbiddenException) {
                throw error;
            }

            throw new InternalServerErrorException(error.message);
        }
    }
}
