import { Injectable, Inject, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { Knex } from "knex"

@Injectable()
export class CategoriesService {
    constructor(
            @Inject('KNEX_CONNECTION') private readonly knex: Knex,
        ) {}

    async createCategorie(categorieDto: any, userId: number){
        try {
            const group = await this.knex('award_groups')
            .select('id')
            .where({
                id: categorieDto.groupId,
                creator_id: userId,
            })
            .first();

            if (!group) {
                throw new ForbiddenException(
                    'Esta votação não pertence a você ou não existe.',
                );
            }
            
            const [categoryId] = await this.knex('categories').insert({
                group_id: categorieDto.groupId,
                name: categorieDto.name,
                description: categorieDto.description,
                creator_id: userId,
            });
            
            return { msg: 'Categoria adicionada!', categoryId};
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }

            throw new InternalServerErrorException(error.message);
        }
    }

    async updateCategorie(id: number, categorieDto: any, userId: number){
        try {
            const updatedRows = await this.knex('categories')
            .update({
                group_id: categorieDto.groupId,
                name: categorieDto.name,
                description: categorieDto.description,
            })
            .where({id: id, creator_id: userId});

            if (updatedRows === 0) {
                throw new ForbiddenException(
                    'Você não tem permissão para editar esta categoria ou ela não existe.',
                );
            }

            return { msg: 'Categoria atualizada!' };
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }

            throw new InternalServerErrorException('Falha ao atualizar categoria.');
        }
    }

    async deleteCategorie(id: number, userId: number){
        try {
            const deletedRows = await this.knex('categories')
            .delete()
            .where({id: id, creator_id: userId});

            if (deletedRows === 0) {
                throw new ForbiddenException(
                    'Você não tem permissão para remover esta categoria ou ela não existe.',
                );
            }

            return { msg: 'Categoria removida!' };
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }

            throw new InternalServerErrorException('Falha ao remover categoria.');
        }
    }
}
