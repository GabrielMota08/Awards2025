import { Module } from '@nestjs/common';
import { knex, Knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  providers: [
    {
      provide: 'KNEX_CONNECTION',
      useFactory: (): Knex => {
        return knex({
          client: 'mysql2',
          connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
              minVersion: 'TLSv1.2',
              rejectUnauthorized: true,
            },
          },
          pool: { min: 0, max: 10 },
        });
      },
    },
  ],
  exports: ['KNEX_CONNECTION'],
})
export class DatabaseModule {}